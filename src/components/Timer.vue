<template>
  <ControlPanel position="left">
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
      <ControlButton @click="start(15 * 60)">15 min</ControlButton>
      <ControlButton @click="start(30 * 60)">30 min</ControlButton>
      <ControlButton @click="start(60 * 60)">60 min</ControlButton>
    </template>
    <ControlButton v-else @click="cancel">Annuler</ControlButton>
  </ControlPanel>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { Ref } from 'vue'
import { Icon } from '@iconify/vue'
import ControlPanel from './ControlPanel.vue'
import ControlButton from './ControlButton.vue'

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
    color: $accent;
    font-size: 22px;
  }

  .progress-ring {
    position: absolute;
    inset: 0;
    width: 38px;
    height: 38px;

    .track {
      stroke: $bg-element;
    }

    .fill {
      stroke: $accent;
      transition: stroke-dashoffset 1s linear;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
  }
}
</style>
