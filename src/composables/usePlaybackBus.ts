import { ref, provide, inject, onUnmounted } from 'vue'
import type { InjectionKey, Ref } from 'vue'

export type StopSignal = 'idle' | 'fading'

export interface PlaybackBus {
    /** Volume maître global, 0-100. */
    masterVolume: Ref<number>
    /** 'fading' déclenche le fondu de fin de minuteur sur les sons en lecture. */
    stopSignal: Ref<StopSignal>
    /** Coupe immédiatement tous les sons. */
    stopAll: () => void
    /** Abonne un son à l'arrêt global. Désabonnement automatique au démontage. */
    onStopAll: (handler: () => void) => void
}

const KEY: InjectionKey<PlaybackBus> = Symbol('playback-bus')

/** À appeler dans le composant racine. */
export function providePlaybackBus(): PlaybackBus {
    const masterVolume = ref(100)
    const stopSignal = ref<StopSignal>('idle')
    const handlers = new Set<() => void>()

    const bus: PlaybackBus = {
        masterVolume,
        stopSignal,
        stopAll: () => handlers.forEach((handler) => handler()),
        onStopAll: (handler) => {
            handlers.add(handler)
            onUnmounted(() => handlers.delete(handler))
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
