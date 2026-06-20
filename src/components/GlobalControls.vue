<template>
  <div class="GlobalControls">
    <div class="controls">
      <span class="vol-icon">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path d="M3 9v6h4l5 5V4L7 9H3z" fill="#ff00ff"/>
          <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="#ff00ff"/>
        </svg>
      </span>
      <input class="vol-slider" type="range" min="0" max="100" v-model.number="masterVolume" />
      <button class="stop-btn" @click="stopAll()">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"/>
        </svg>
      </button>
      <button class="stop-btn" @click="toggleFullscreen()">
        <svg v-if="!isFullscreen" viewBox="0 0 24 24" width="16" height="16">
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="16" height="16">
          <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

const masterVolume = inject<Ref<number>>('masterVolume')!
const stopAllTrigger = inject<Ref<number>>('stopAllTrigger')!

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

    .vol-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      flex-shrink: 0;
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
      transition: background-color 0.2s, color 0.2s;

      &:hover {
        background: $bg-element-hover;
        color: $accent;
      }
    }
  }
}
</style>
