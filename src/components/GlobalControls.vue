<template>
  <div class="GlobalControls">
    <div class="controls">
      <button class="vol-btn" @click="toggleMute">
        <Icon :icon="volumeIcon" />
      </button>
      <input class="vol-slider" type="range" min="0" max="100" v-model.number="masterVolume" />
      <button class="stop-btn" @click="stopAll()">
        <Icon icon="mdi:stop" />
      </button>
      <button class="stop-btn" @click="toggleFullscreen()">
        <Icon :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { Icon } from '@iconify/vue'

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
.GlobalControls {
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  background: $bg-panel;
  border-radius: 9999px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55);

  .controls {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem;

    .vol-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      flex-shrink: 0;
      padding: 0;
      border: 0;
      background: none;
      color: $accent;
      font-size: 22px;
      cursor: pointer;
    }

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

    .stop-btn {
      width: 38px;
      height: 38px;
      background: $bg-element;
      border: none;
      color: $text-muted;
      border-radius: 9999px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 20px;
      transition: background-color 0.2s, color 0.2s;

      &:hover {
        background: $bg-element-hover;
        color: $accent;
      }
    }
  }
}
</style>
