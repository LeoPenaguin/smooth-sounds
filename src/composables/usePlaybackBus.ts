import { ref, watch, provide, inject, onUnmounted } from 'vue'
import type { InjectionKey, Ref } from 'vue'

export type StopSignal = 'idle' | 'fading'

/** Rampe courte (s) pour lisser les changements de volume maître sans clic. */
const MASTER_RAMP = 0.03

export interface PlaybackBus {
    /** Volume maître global, 0-100. */
    masterVolume: Ref<number>
    /** 'fading' déclenche le fondu de fin de minuteur sur les sons en lecture. */
    stopSignal: Ref<StopSignal>
    /** Coupe immédiatement tous les sons. */
    stopAll: () => void
    /** Abonne un son à l'arrêt global. Désabonnement automatique au démontage. */
    onStopAll: (handler: () => void) => void
    /** Contexte Web Audio partagé par tous les sons. */
    audioContext: AudioContext
    /** Nœud de gain maître : chaque son s'y branche avant la sortie. */
    masterGain: GainNode
    /** Reprend le contexte (suspendu tant qu'aucun geste utilisateur). */
    ensureRunning: () => void
}

const KEY: InjectionKey<PlaybackBus> = Symbol('playback-bus')

/** À appeler dans le composant racine. */
export function providePlaybackBus(): PlaybackBus {
    const masterVolume = ref(100)
    const stopSignal = ref<StopSignal>('idle')
    const handlers = new Set<() => void>()

    const audioContext = new AudioContext()
    const masterGain = audioContext.createGain()
    masterGain.gain.value = masterVolume.value / 100
    masterGain.connect(audioContext.destination)

    watch(masterVolume, (value) => {
        const now = audioContext.currentTime
        masterGain.gain.cancelScheduledValues(now)
        masterGain.gain.setValueAtTime(masterGain.gain.value, now)
        masterGain.gain.linearRampToValueAtTime(value / 100, now + MASTER_RAMP)
    })

    const bus: PlaybackBus = {
        masterVolume,
        stopSignal,
        stopAll: () => handlers.forEach((handler) => handler()),
        onStopAll: (handler) => {
            handlers.add(handler)
            onUnmounted(() => handlers.delete(handler))
        },
        audioContext,
        masterGain,
        ensureRunning: () => {
            if (audioContext.state === 'suspended') audioContext.resume()
        },
    }

    provide(KEY, bus)
    return bus
}

export function usePlaybackBus(): PlaybackBus {
    const bus = inject(KEY)
    if (!bus)
        throw new Error(
            'usePlaybackBus() doit être utilisé sous un composant qui a appelé providePlaybackBus()',
        )
    return bus
}
