<template>
    <div
        ref="cardEl"
        class="relative flex cursor-pointer flex-col rounded-3xl bg-(--bg) p-4"
        :style="{ '--bg': bgColor, '--icon': iconColor }"
        @click.prevent="togglePlay"
    >
        <canvas ref="canvasEl" class="pointer-events-none absolute z-0" />

        <div class="relative z-10 flex items-center justify-center gap-2.5 py-3">
            <Icon class="shrink-0 text-4xl text-(--icon)" :icon="icon" />
            <p class="text-base font-semibold tracking-wider text-(--icon) uppercase">
                {{ label }}
            </p>
        </div>

        <div class="relative z-10 w-full pt-2">
            <input
                @click.stop
                class="h-1 w-full appearance-none rounded-full transition-colors duration-300 outline-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-(--bg) [&::-moz-range-thumb]:transition-colors [&::-moz-range-thumb]:duration-300 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-(--bg) [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:duration-300"
                :class="
                    playing
                        ? 'bg-(--icon) [&::-moz-range-thumb]:bg-(--icon) [&::-webkit-slider-thumb]:bg-(--icon)'
                        : 'bg-bg-base [&::-webkit-slider-thumb]:bg-bg-base [&::-moz-range-thumb]:bg-bg-base'
                "
                v-model.number="volume"
                type="range"
                min="0"
                max="100"
            />
        </div>

        <audio :loop="loop" ref="audioEl" :src="file" preload="auto" style="display: none" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { usePlaybackBus } from '@/composables/usePlaybackBus'
import { useWavyBorder } from '@/composables/useWavyBorder'

const props = withDefaults(
    defineProps<{
        label: string
        file: string
        icon: string
        bgColor: string
        iconColor: string
        autoPlay?: boolean
        loop?: boolean
    }>(),
    {
        autoPlay: false,
        loop: false,
    },
)

const { stopSignal, onStopAll, audioContext, masterGain, ensureRunning } = usePlaybackBus()

/** Déclic-fade play/pause/stop pour éviter les pops. */
const FADE_SHORT = 0.12
/** Fondu de fin de minuteur. */
const FADE_TIMER = 5

const audioEl = ref<HTMLAudioElement>()
const playing = ref(false)
const volume = ref(100)
let gainNode: GainNode | null = null
let stopTimeoutId: ReturnType<typeof setTimeout> | null = null

const cardEl = ref<HTMLElement>()
const canvasEl = ref<HTMLCanvasElement>()
const { setActive } = useWavyBorder(cardEl, canvasEl, () => props.iconColor)

/* ---------- Audio ---------- */
/** Rampe le gain du son vers `target` depuis sa valeur courante (anti-clic). */
function rampTo(target: number, durationSec: number) {
    if (!gainNode) return
    const now = audioContext.currentTime
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setValueAtTime(gainNode.gain.value, now)
    gainNode.gain.linearRampToValueAtTime(target, now + durationSec)
}

function scheduleStop(afterSec: number) {
    clearStopTimeout()
    stopTimeoutId = setTimeout(() => {
        audioEl.value?.pause()
        stopTimeoutId = null
    }, afterSec * 1000)
}

function clearStopTimeout() {
    if (stopTimeoutId) {
        clearTimeout(stopTimeoutId)
        stopTimeoutId = null
    }
}

watch(playing, (value) => {
    if (value) {
        clearStopTimeout()
        audioEl.value?.play()
        rampTo(volume.value / 100, FADE_SHORT)
    } else {
        rampTo(0, FADE_SHORT)
        scheduleStop(FADE_SHORT)
    }
    setActive(value)
})

watch(volume, (value) => {
    if (playing.value) rampTo(value / 100, FADE_SHORT)
})

onStopAll(() => {
    playing.value = false
})

watch(stopSignal, (signal) => {
    if (signal === 'fading' && playing.value) {
        rampTo(0, FADE_TIMER)
        scheduleStop(FADE_TIMER)
    } else if (signal === 'idle') {
        clearStopTimeout()
        if (playing.value) rampTo(volume.value / 100, FADE_SHORT)
    }
})

function togglePlay() {
    ensureRunning()
    playing.value = !playing.value
}

onMounted(() => {
    const audio = audioEl.value!
    audio.volume = 1

    gainNode = audioContext.createGain()
    gainNode.gain.value = 0
    audioContext.createMediaElementSource(audio).connect(gainNode)
    gainNode.connect(masterGain)

    audio.addEventListener('loadeddata', () => {
        if (audio.readyState >= 2) playing.value = props.autoPlay
    })

    audio.addEventListener('pause', () => {
        playing.value = false
        audio.currentTime = 0
    })

    audio.addEventListener('play', () => {
        playing.value = true
    })
})

onUnmounted(() => {
    clearStopTimeout()
    gainNode?.disconnect()
})
</script>
