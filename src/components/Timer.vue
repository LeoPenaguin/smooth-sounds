<template>
    <ControlPanel position="left">
        <div class="relative flex h-9 w-9 shrink-0 items-center justify-center">
            <Icon class="text-accent relative z-10 text-2xl" icon="mdi:timer-outline" />
            <svg v-if="isRunning" class="absolute inset-0 h-9 w-9" viewBox="0 0 40 40">
                <circle
                    class="stroke-bg-element"
                    stroke-width="3"
                    fill="transparent"
                    cx="20"
                    cy="20"
                    r="16"
                />
                <circle
                    class="stroke-accent origin-center -rotate-90 transition-[stroke-dashoffset] duration-1000 ease-linear"
                    stroke-width="3"
                    fill="transparent"
                    cx="20"
                    cy="20"
                    r="16"
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
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import ControlPanel from './ControlPanel.vue'
import ControlButton from './ControlButton.vue'
import { usePlaybackBus } from '@/composables/usePlaybackBus'

const { stopSignal } = usePlaybackBus()

const duration = ref(0)
const remaining = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const isRunning = computed(() => remaining.value > 0)

const circumference = 16 * 2 * Math.PI
const strokeDashoffset = computed(() =>
    duration.value ? circumference * (1 - remaining.value / duration.value) : circumference,
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
