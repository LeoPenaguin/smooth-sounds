<template>
    <div
        ref="cardEl"
        class="Sound"
        :class="{ playing }"
        :style="{ '--bg': bgColor, '--icon': iconColor }"
        @click.prevent="togglePlay"
    >
        <canvas ref="canvasEl" class="border-canvas" />

        <div class="top">
            <Icon class="sound-icon" :icon="icon" />
            <p class="sound-name">{{ label }}</p>
        </div>

        <div class="controls">
            <input
                @click.stop
                class="sound-slider"
                v-model.number="volume"
                type="range"
                min="0"
                max="100"
            />
        </div>

        <audio
            :loop="loop"
            ref="audioEl"
            :src="file"
            preload="auto"
            style="display: none"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, inject, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import { Icon } from "@iconify/vue";

const props = withDefaults(
    defineProps<{
        label: string;
        file: string;
        icon: string;
        bgColor: string;
        iconColor: string;
        autoPlay?: boolean;
        loop?: boolean;
    }>(),
    {
        autoPlay: false,
        loop: false,
    },
);

const stopSignal = inject<Ref<"idle" | "fading">>("stopSignal")!;
const masterVolume = inject<Ref<number>>("masterVolume")!;
const stopAllTrigger = inject<Ref<number>>("stopAllTrigger")!;

const audioEl = ref<HTMLAudioElement>();
const playing = ref(false);
const volume = ref(100);
let fadeIntervalId: ReturnType<typeof setInterval> | null = null;

/* ---------- Bordure animée (canvas) ---------- */
const TWO_PI = Math.PI * 2;
const MS_PER_SECOND = 1000;

const CORNER_RADIUS = 24; // rayon des coins, aligné sur le fond CSS
const REST_LINE_WIDTH = 2.5; // trait au repos
const WAVE_LINE_WIDTH = 3.5; // trait pendant la lecture
const WAVE_CYCLES = 34; // nb de vagues sur le périmètre (entier -> symétrique + boucle continue)
const WAVE_AMPLITUDE_MIN = 1.5; // px (amplitude basse de la respiration)
const WAVE_AMPLITUDE_MAX = 3; // px (amplitude haute de la respiration)
const WAVE_BREATH_SPEED = 1.2; // rad/s, vitesse de respiration de l'amplitude
const WAVE_TRAVEL_SPEED = 0.6; // rad/s, défilement des vagues (sens horaire)
const WAVE_TRANSITION_DURATION = 0.3; // s, fondu d'entrée/sortie des vagues
const PERIMETER_SAMPLE_STEP = 3; // px entre deux points du contour
const CANVAS_PADDING = Math.ceil(
    // marge pour que les vagues ne soient pas rognées
    WAVE_AMPLITUDE_MAX + WAVE_LINE_WIDTH,
);

interface ContourPoint {
    x: number;
    y: number;
    nx: number;
    ny: number;
    d: number;
}

const cardEl = ref<HTMLElement>();
const canvasEl = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D | null = null;
let resizeObserver: ResizeObserver | null = null;
let rafId: number | null = null;
let cardW = 0;
let cardH = 0;
let intensity = 0; // 0 = repos, 1 = vagues pleines (valeur lissée)
let targetIntensity = 0; // cible vers laquelle intensity se déplace
let lastFrameTime = 0;

// échantillonne le rectangle arrondi point par point, avec la normale sortante.
// Départ au MILIEU du côté haut -> avec cos(k·d) et WAVE_CYCLES entier, le motif
// est symétrique par rapport aux axes vertical et horizontal de la carte.
function buildContour(
    w: number,
    h: number,
): { points: ContourPoint[]; length: number } {
    const x0 = CANVAS_PADDING,
        y0 = CANVAS_PADDING;
    const x1 = CANVAS_PADDING + w,
        y1 = CANVAS_PADDING + h;
    const r = Math.max(0, Math.min(CORNER_RADIUS, w / 2, h / 2));
    const midX = (x0 + x1) / 2;

    const points: ContourPoint[] = [];
    let dist = 0;
    let prevX = 0,
        prevY = 0;
    let started = false;

    function push(x: number, y: number, nx: number, ny: number) {
        if (started) dist += Math.hypot(x - prevX, y - prevY);
        points.push({ x, y, nx, ny, d: dist });
        prevX = x;
        prevY = y;
        started = true;
    }

    function addLine(
        ax: number,
        ay: number,
        bx: number,
        by: number,
        nx: number,
        ny: number,
    ) {
        const n = Math.max(
            1,
            Math.round(Math.hypot(bx - ax, by - ay) / PERIMETER_SAMPLE_STEP),
        );
        for (let i = 0; i < n; i++) {
            const t = i / n;
            push(ax + (bx - ax) * t, ay + (by - ay) * t, nx, ny);
        }
    }

    function addArc(cx: number, cy: number, a0: number, a1: number) {
        const n = Math.max(
            1,
            Math.round((r * Math.abs(a1 - a0)) / PERIMETER_SAMPLE_STEP),
        );
        for (let i = 0; i < n; i++) {
            const a = a0 + (a1 - a0) * (i / n);
            const nx = Math.cos(a),
                ny = Math.sin(a);
            push(cx + r * nx, cy + r * ny, nx, ny);
        }
    }

    addLine(midX, y0, x1 - r, y0, 0, -1); // demi-côté haut (droite)
    addArc(x1 - r, y0 + r, -Math.PI / 2, 0); // coin haut-droit
    addLine(x1, y0 + r, x1, y1 - r, 1, 0); // droite
    addArc(x1 - r, y1 - r, 0, Math.PI / 2); // coin bas-droit
    addLine(x1 - r, y1, x0 + r, y1, 0, 1); // bas
    addArc(x0 + r, y1 - r, Math.PI / 2, Math.PI); // coin bas-gauche
    addLine(x0, y1 - r, x0, y0 + r, -1, 0); // gauche
    addArc(x0 + r, y0 + r, Math.PI, Math.PI * 1.5); // coin haut-gauche
    addLine(x0 + r, y0, midX, y0, 0, -1); // demi-côté haut (gauche)

    // longueur totale en refermant la boucle
    const length = dist + Math.hypot(points[0].x - prevX, points[0].y - prevY);
    return { points, length };
}

function drawBorder(amplitude: number, phase: number, lineWidth: number) {
    if (!ctx) return;
    const { points, length } = buildContour(cardW, cardH);
    ctx.clearRect(0, 0, cardW + CANVAS_PADDING * 2, cardH + CANVAS_PADDING * 2);

    const k = (TWO_PI * WAVE_CYCLES) / length;
    const n = points.length;

    // position finale de chaque point (décalé le long de sa normale)
    const fx = new Array<number>(n);
    const fy = new Array<number>(n);
    for (let i = 0; i < n; i++) {
        const p = points[i];
        const offset = amplitude * Math.cos(k * p.d - phase);
        fx[i] = p.x + p.nx * offset;
        fy[i] = p.y + p.ny * offset;
    }

    // contour lissé : courbes quadratiques passant par les milieux de segments,
    // chaque point servant de point de contrôle -> pas de facettes
    ctx.beginPath();
    ctx.moveTo((fx[n - 1] + fx[0]) / 2, (fy[n - 1] + fy[0]) / 2);
    for (let i = 0; i < n; i++) {
        const next = (i + 1) % n;
        ctx.quadraticCurveTo(
            fx[i],
            fy[i],
            (fx[i] + fx[next]) / 2,
            (fy[i] + fy[next]) / 2,
        );
    }
    ctx.closePath();
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";
    ctx.strokeStyle = props.iconColor;
    ctx.stroke();
}

function drawRest() {
    drawBorder(0, 0, REST_LINE_WIDTH);
}

function animate() {
    const time = performance.now() / MS_PER_SECOND;
    const dt = lastFrameTime ? time - lastFrameTime : 0;
    lastFrameTime = time;

    // intensity glisse vers sa cible sur WAVE_TRANSITION_DURATION, avec easing
    const step = dt / WAVE_TRANSITION_DURATION;
    intensity =
        targetIntensity > intensity
            ? Math.min(targetIntensity, intensity + step)
            : Math.max(targetIntensity, intensity - step);
    const ease = intensity * intensity * (3 - 2 * intensity); // smoothstep

    // l'amplitude respire entre MIN et MAX, atténuée par le fondu
    const breath = (1 + Math.sin(WAVE_BREATH_SPEED * time)) / 2;
    const amplitude =
        ease *
        (WAVE_AMPLITUDE_MIN +
            (WAVE_AMPLITUDE_MAX - WAVE_AMPLITUDE_MIN) * breath);
    // les vagues défilent lentement dans le sens horaire
    const phase = WAVE_TRAVEL_SPEED * time;
    const lineWidth =
        REST_LINE_WIDTH + (WAVE_LINE_WIDTH - REST_LINE_WIDTH) * ease;
    drawBorder(amplitude, phase, lineWidth);

    // fondu terminé et revenu au repos -> on arrête la boucle
    if (intensity === 0 && targetIntensity === 0) {
        rafId = null;
        lastFrameTime = 0;
        return;
    }
    rafId = requestAnimationFrame(animate);
}

function setWaveActive(active: boolean) {
    targetIntensity = active ? 1 : 0;
    if (rafId === null) {
        lastFrameTime = 0;
        rafId = requestAnimationFrame(animate);
    }
}

function resizeCanvas() {
    const canvas = canvasEl.value;
    const card = cardEl.value;
    if (!canvas || !card || !ctx) return;

    cardW = card.offsetWidth;
    cardH = card.offsetHeight;
    const cssW = cardW + CANVAS_PADDING * 2;
    const cssH = cardH + CANVAS_PADDING * 2;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    canvas.style.top = `${-CANVAS_PADDING}px`;
    canvas.style.left = `${-CANVAS_PADDING}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (rafId === null) drawRest();
}

/* ---------- Audio ---------- */
watch(playing, (value) => {
    if (audioEl.value) {
        if (value) audioEl.value.play();
        else audioEl.value.pause();
    }
    setWaveActive(value);
});

watch(volume, (value) => {
    if (audioEl.value)
        audioEl.value.volume = (value / 100) * (masterVolume.value / 100);
});

watch(masterVolume, (value) => {
    if (audioEl.value)
        audioEl.value.volume = (volume.value / 100) * (value / 100);
});

watch(stopAllTrigger, () => {
    if (audioEl.value) audioEl.value.pause();
});

watch(stopSignal, (signal) => {
    if (signal === "fading" && playing.value) {
        startFade();
    } else if (signal === "idle") {
        cancelFade();
    }
});

function startFade() {
    if (!audioEl.value) return;
    const startVol = audioEl.value.volume;
    const steps = 50;
    const decrement = startVol / steps;
    let step = 0;

    fadeIntervalId = setInterval(() => {
        if (!audioEl.value) return;
        step++;
        if (step >= steps) {
            audioEl.value.volume = 0;
            audioEl.value.pause();
            clearInterval(fadeIntervalId!);
            fadeIntervalId = null;
        } else {
            audioEl.value.volume = Math.max(
                0,
                audioEl.value.volume - decrement,
            );
        }
    }, 100);
}

function cancelFade() {
    if (fadeIntervalId) {
        clearInterval(fadeIntervalId);
        fadeIntervalId = null;
    }
    if (audioEl.value)
        audioEl.value.volume =
            (volume.value / 100) * (masterVolume.value / 100);
}

function togglePlay() {
    playing.value = !playing.value;
}

onMounted(() => {
    const audio = audioEl.value!;

    audio.addEventListener("loadeddata", () => {
        if (audio.readyState >= 2) playing.value = props.autoPlay;
    });

    audio.addEventListener("pause", () => {
        playing.value = false;
        audio.currentTime = 0;
    });

    audio.addEventListener("play", () => {
        playing.value = true;
    });

    ctx = canvasEl.value?.getContext("2d") ?? null;
    resizeCanvas();
    if (cardEl.value) {
        resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(cardEl.value);
    }
});

onUnmounted(() => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    resizeObserver?.disconnect();
    cancelFade();
});
</script>

<style lang="scss" scoped>
.Sound {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    cursor: pointer;
    background: var(--bg);
    border-radius: 24px;

    .border-canvas {
        position: absolute;
        z-index: 0;
        pointer-events: none;
    }

    .top {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        padding: 0.75rem 0;

        .sound-icon {
            font-size: 40px;
            color: var(--icon);
            flex-shrink: 0;
        }

        .sound-name {
            margin: 0;
            color: var(--icon);
            font-size: 1.05rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
    }

    .controls {
        position: relative;
        z-index: 1;
        width: 100%;
        padding-top: 0.5rem;

        .sound-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            background: $bg-base;
            outline: none;
            opacity: 1;
            border-radius: 9999px;
            transition: background-color 0.3s;

            &::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 8px;
                height: 20px;
                background-color: $bg-base;
                cursor: pointer;
                border-radius: 9999px;
                border: 3px solid var(--bg);
                transition: background-color 0.3s;
            }

            &::-moz-range-thumb {
                width: 8px;
                height: 20px;
                background-color: $bg-base;
                cursor: pointer;
                border-radius: 9999px;
                border: 3px solid var(--bg);
                transition: background-color 0.3s;
            }
        }
    }

    &.playing {
        .controls .sound-slider {
            background: var(--icon);

            &::-webkit-slider-thumb {
                background-color: var(--icon);
            }

            &::-moz-range-thumb {
                background-color: var(--icon);
            }
        }
    }
}
</style>
