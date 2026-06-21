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

const { masterVolume, stopSignal, onStopAll } = usePlaybackBus()

const audioEl = ref<HTMLAudioElement>()
const playing = ref(false)
const volume = ref(100)
let fadeIntervalId: ReturnType<typeof setInterval> | null = null

const cardEl = ref<HTMLElement>()
const canvasEl = ref<HTMLCanvasElement>()
const { setActive } = useWavyBorder(cardEl, canvasEl, () => props.iconColor)

/* ---------- Audio ---------- */
watch(playing, (value) => {
    if (audioEl.value) {
        if (value) audioEl.value.play()
        else audioEl.value.pause()
    }
    setActive(value)
})

watch(volume, (value) => {
    if (audioEl.value) audioEl.value.volume = (value / 100) * (masterVolume.value / 100)
})

watch(masterVolume, (value) => {
    if (audioEl.value) audioEl.value.volume = (volume.value / 100) * (value / 100)
})

onStopAll(() => audioEl.value?.pause())

watch(stopSignal, (signal) => {
    if (signal === 'fading' && playing.value) {
        startFade()
    } else if (signal === 'idle') {
        cancelFade()
    }
})

function startFade() {
    if (!audioEl.value) return
    const startVol = audioEl.value.volume
    const steps = 50
    const decrement = startVol / steps
    let step = 0

    fadeIntervalId = setInterval(() => {
        if (!audioEl.value) return
        step++
        if (step >= steps) {
            audioEl.value.volume = 0
            audioEl.value.pause()
            clearInterval(fadeIntervalId!)
            fadeIntervalId = null
        } else {
            audioEl.value.volume = Math.max(0, audioEl.value.volume - decrement)
        }
    }, 100)
}

function cancelFade() {
    if (fadeIntervalId) {
        clearInterval(fadeIntervalId)
        fadeIntervalId = null
    }
    if (audioEl.value) audioEl.value.volume = (volume.value / 100) * (masterVolume.value / 100)
}

function togglePlay() {
    playing.value = !playing.value
}

onMounted(() => {
    const audio = audioEl.value!

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

onUnmounted(cancelFade)
</script>
