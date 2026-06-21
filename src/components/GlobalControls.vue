<template>
    <ControlPanel position="center">
        <ControlButton :icon="volumeIcon" @click="toggleMute" />
        <input
            class="bg-bg-element [&::-webkit-slider-thumb]:bg-accent [&::-moz-range-thumb]:bg-accent h-1 w-32 cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0"
            type="range"
            min="0"
            max="100"
            v-model.number="masterVolume"
        />
        <ControlButton icon="mdi:stop" @click="stopAll" />
        <ControlButton
            :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'"
            @click="toggleFullscreen"
        />
    </ControlPanel>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ControlPanel from './ControlPanel.vue'
import ControlButton from './ControlButton.vue'
import { usePlaybackBus } from '@/composables/usePlaybackBus'

const VOLUME_LOW_MAX = 33
const VOLUME_MEDIUM_MAX = 66
const DEFAULT_UNMUTE_VOLUME = 100

const { masterVolume, stopAll } = usePlaybackBus()

const volumeIcon = computed(() => {
    const v = masterVolume.value
    if (v === 0) return 'mdi:volume-mute'
    if (v <= VOLUME_LOW_MAX) return 'mdi:volume-low'
    if (v <= VOLUME_MEDIUM_MAX) return 'mdi:volume-medium'
    return 'mdi:volume-high'
})

const volumeBeforeMute = ref(DEFAULT_UNMUTE_VOLUME)

function toggleMute() {
    if (masterVolume.value > 0) {
        volumeBeforeMute.value = masterVolume.value
        masterVolume.value = 0
    } else {
        masterVolume.value = volumeBeforeMute.value || DEFAULT_UNMUTE_VOLUME
    }
}

const isFullscreen = ref(false)

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        document.documentElement.requestFullscreen()
    }
}

function onFullscreenChange() {
    isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => document.addEventListener('fullscreenchange', onFullscreenChange))
onUnmounted(() => document.removeEventListener('fullscreenchange', onFullscreenChange))
</script>
