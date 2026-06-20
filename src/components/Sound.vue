<template>
    <div
        ref="rootEl"
        class="Sound"
        :class="{ playing }"
        :style="{ '--bg': bgColor, '--icon': iconColor }"
        @click.prevent="togglePlay"
    >
        <svg
            v-if="playing"
            class="wave-border"
            :width="dims.w"
            :height="dims.h"
            :viewBox="`0 0 ${dims.w} ${dims.h}`"
        >
            <path :d="wavePath" fill="none" stroke="var(--icon)" stroke-width="2" stroke-linejoin="round" />
        </svg>

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
import { ref, reactive, watch, inject, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import { Icon } from "@iconify/vue";

const RADIUS = 14;

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

const stopSignal = inject<Ref<'idle' | 'fading'>>('stopSignal')!
const masterVolume = inject<Ref<number>>('masterVolume')!
const stopAllTrigger = inject<Ref<number>>('stopAllTrigger')!

const rootEl = ref<HTMLElement>();
const audioEl = ref<HTMLAudioElement>();
const playing = ref(false);
const volume = ref(100);
let fadeIntervalId: ReturnType<typeof setInterval> | null = null;

// --- Bordure sinusoïdale animée ---
const dims = reactive({ w: 0, h: 0 });
const wavePath = ref("");
let waveRaf: number | null = null;
let phase = 0;

// trace un contour ondulé (sinusoïde) autour du rectangle arrondi
function buildWavePath(w: number, h: number, radius: number, amp: number, waveLen: number, ph: number): string {
    if (w <= 0 || h <= 0) return "";
    const margin = amp + 2;
    const x0 = margin, y0 = margin, x1 = w - margin, y1 = h - margin;
    const r = Math.max(0, Math.min(radius - margin, (x1 - x0) / 2, (y1 - y0) / 2));

    const pts: { x: number; y: number; nx: number; ny: number }[] = [];

    function addLine(ax: number, ay: number, bx: number, by: number, nx: number, ny: number) {
        const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / 4));
        for (let i = 0; i < n; i++) {
            const t = i / n;
            pts.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t, nx, ny });
        }
    }
    function addArc(cx: number, cy: number, a0: number, a1: number) {
        const steps = 8;
        for (let i = 0; i < steps; i++) {
            const a = a0 + (a1 - a0) * (i / steps);
            pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) });
        }
    }

    addLine(x0 + r, y0, x1 - r, y0, 0, -1);            // haut
    addArc(x1 - r, y0 + r, -Math.PI / 2, 0);           // coin haut-droit
    addLine(x1, y0 + r, x1, y1 - r, 1, 0);             // droite
    addArc(x1 - r, y1 - r, 0, Math.PI / 2);            // coin bas-droit
    addLine(x1 - r, y1, x0 + r, y1, 0, 1);             // bas
    addArc(x0 + r, y1 - r, Math.PI / 2, Math.PI);      // coin bas-gauche
    addLine(x0, y1 - r, x0, y0 + r, -1, 0);            // gauche
    addArc(x0 + r, y0 + r, Math.PI, Math.PI * 1.5);    // coin haut-gauche

    const N = pts.length;
    const dists = new Array<number>(N);
    dists[0] = 0;
    let total = 0;
    for (let i = 1; i < N; i++) {
        total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        dists[i] = total;
    }
    total += Math.hypot(pts[0].x - pts[N - 1].x, pts[0].y - pts[N - 1].y);

    // nombre entier d'ondes pour un raccord continu en bouclant
    const waves = Math.max(1, Math.round(total / waveLen));
    const k = (2 * Math.PI * waves) / total;

    let d = "";
    for (let i = 0; i < N; i++) {
        const off = amp * Math.sin(k * dists[i] + ph);
        d += (i === 0 ? "M" : "L") + (pts[i].x + pts[i].nx * off).toFixed(2) + " " + (pts[i].y + pts[i].ny * off).toFixed(2);
    }
    return d + "Z";
}

function animateWave() {
    phase += 0.06;
    wavePath.value = buildWavePath(dims.w, dims.h, RADIUS, 3, 18, phase);
    waveRaf = requestAnimationFrame(animateWave);
}

function startWave() {
    if (waveRaf === null) animateWave();
}

function stopWave() {
    if (waveRaf !== null) {
        cancelAnimationFrame(waveRaf);
        waveRaf = null;
    }
}

let resizeObserver: ResizeObserver | null = null;

watch(playing, (value) => {
    if (!audioEl.value) return;
    if (value) { audioEl.value.play(); startWave(); }
    else { audioEl.value.pause(); stopWave(); }
});

watch(volume, (value) => {
    if (audioEl.value) audioEl.value.volume = (value / 100) * (masterVolume.value / 100);
});

watch(masterVolume, (value) => {
    if (audioEl.value) audioEl.value.volume = (volume.value / 100) * (value / 100);
});

watch(stopAllTrigger, () => {
    if (audioEl.value) audioEl.value.pause();
});

watch(stopSignal, (signal) => {
    if (signal === 'fading' && playing.value) {
        startFade();
    } else if (signal === 'idle') {
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
            audioEl.value.volume = Math.max(0, audioEl.value.volume - decrement);
        }
    }, 100);
}

function cancelFade() {
    if (fadeIntervalId) {
        clearInterval(fadeIntervalId);
        fadeIntervalId = null;
    }
    if (audioEl.value) audioEl.value.volume = (volume.value / 100) * (masterVolume.value / 100);
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

    if (rootEl.value) {
        resizeObserver = new ResizeObserver(() => {
            if (rootEl.value) {
                dims.w = rootEl.value.offsetWidth;
                dims.h = rootEl.value.offsetHeight;
            }
        });
        resizeObserver.observe(rootEl.value);
    }
});

onUnmounted(() => {
    stopWave();
    resizeObserver?.disconnect();
});
</script>

<style lang="scss" scoped>
.Sound {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 14px;
    border: 2px solid var(--icon);
    background: var(--bg);
    padding: 1rem;
    cursor: pointer;
    transition: border-color 0.3s;

    .wave-border {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        overflow: visible;
    }

    .top {
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
        width: 100%;
        padding-top: 0.5rem;

        .sound-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 6px;
            background: $bg-element;
            outline: none;
            opacity: 1;
            border-radius: 1rem;

            &::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background-color: $bg-element;
                cursor: pointer;
                border-radius: 3rem;
                border: 0;
                transition: background-color 0.3s;
            }

            &::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background-color: $bg-element;
                cursor: pointer;
                border-radius: 3rem;
                border: 0;
                transition: background-color 0.3s;
            }
        }
    }

    &.playing {
        border-color: transparent;

        .controls .sound-slider {
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
