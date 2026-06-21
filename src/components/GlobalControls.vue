<template>
  <ControlPanel position="center">
    <ControlButton :icon="volumeIcon" @click="toggleMute" />
    <input class="vol-slider" type="range" min="0" max="100" v-model.number="masterVolume" />
    <ControlButton icon="mdi:stop" @click="stopAll" />
    <ControlButton :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" @click="toggleFullscreen" />
  </ControlPanel>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import ControlPanel from './ControlPanel.vue'
import ControlButton from './ControlButton.vue'

const VOLUME_LOW_MAX = 33
const VOLUME_MEDIUM_MAX = 66
const DEFAULT_UNMUTE_VOLUME = 100

const masterVolume = inject<Ref<number>>('masterVolume')!
const stopAllTrigger = inject<Ref<number>>('stopAllTrigger')!

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

function stopAll() {
  stopAllTrigger.value++
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

<style lang="scss" scoped>
.vol-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 130px;
  height: 4px;
  background: $bg-element;
  outline: none;
  border-radius: 9999px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: $accent;
    border-radius: 9999px;
    border: 0;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: $accent;
    border-radius: 9999px;
    border: 0;
    cursor: pointer;
  }
}
</style>
