<template>
  <div class="Timer">
    <div class="timer-controls">
      <div class="icon-wrapper">
        <Icon class="icon" icon="mdi:timer-outline" />
        <svg v-if="isRunning" class="progress-ring" viewBox="0 0 40 40">
          <circle class="track" stroke-width="3" fill="transparent" cx="20" cy="20" r="16" />
          <circle
            class="fill"
            stroke-width="3"
            fill="transparent"
            cx="20" cy="20" r="16"
            stroke-linecap="round"
            :stroke-dasharray="`${circumference} ${circumference}`"
            :stroke-dashoffset="strokeDashoffset"
          />
        </svg>
      </div>
      <template v-if="!isRunning">
        <button @click="start(15 * 60)">15 min</button>
        <button @click="start(30 * 60)">30 min</button>
        <button @click="start(60 * 60)">60 min</button>
      </template>
      <template v-else>
        <button class="cancel" @click="cancel">Annuler</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { Ref } from 'vue'
import { Icon } from '@iconify/vue'

const stopSignal = inject<Ref<'idle' | 'fading'>>('stopSignal')!

const duration = ref(0)
const remaining = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const isRunning = computed(() => remaining.value > 0)

const circumference = 16 * 2 * Math.PI
const strokeDashoffset = computed(() =>
  duration.value ? circumference * (1 - remaining.value / duration.value) : circumference
)

function start(seconds: number) {
  if (intervalId) clearInterval(intervalId)
  stopSignal.value = 'idle'
  duration.value = seconds
  remaining.value = seconds

  intervalId = setInterval(() => {
    remaining.value--
    if (remaining.value <= 0) {
      clearInterval(intervalId!)
      intervalId = null
      stopSignal.value = 'fading'
      setTimeout(() => {
        stopSignal.value = 'idle'
        remaining.value = 0
      }, 5500)
    }
  }, 1000)
}

function cancel() {
  if (intervalId) clearInterval(intervalId)
  intervalId = null
  remaining.value = 0
  stopSignal.value = 'idle'
}
</script>

<style lang="scss" scoped>
.Timer {
  position: fixed;
  bottom: 1.25rem;
  left: 1.25rem;
  background: $bg-panel;
  border-radius: 9999px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55);

  .timer-controls {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem;

    .icon {
      color: $accent;
      font-size: 22px;
    }

    .icon-wrapper {
      position: relative;
      width: 38px;
      height: 38px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        position: relative;
        z-index: 1;
      }

      .progress-ring {
        position: absolute;
        inset: 0;
        width: 38px;
        height: 38px;

        .track { stroke: $bg-element; }
        .fill { stroke: $accent; }

        .fill {
          transition: stroke-dashoffset 1s linear;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
      }
    }

    button {
      height: 38px;
      background: $bg-element;
      border: none;
      color: $text-muted;
      font-size: 0.9rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0 1.1rem;
      border-radius: 9999px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
      white-space: nowrap;

      &:hover {
        background: $bg-element-hover;
        color: $accent;
      }

      &.cancel {
        color: $accent;
        background: $bg-cancel;

        &:hover {
          background: $bg-cancel-hover;
        }
      }
    }

  }
}
</style>
