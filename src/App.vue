<template>
    <div class="min-h-screen w-screen">
        <Sounds />
        <!-- même colonne centrée que la grille de sons (max-w-5xl + px-4) -->
        <div
            class="pointer-events-none fixed bottom-5 left-1/2 z-10 w-full max-w-5xl -translate-x-1/2 px-4"
        >
            <Timer />
            <GlobalControls />
        </div>
    </div>
</template>

<script setup lang="ts">
import Sounds from './components/Sounds.vue'
import Timer from './components/Timer.vue'
import GlobalControls from './components/GlobalControls.vue'
import { providePlaybackBus } from './composables/usePlaybackBus'

providePlaybackBus()
</script>
