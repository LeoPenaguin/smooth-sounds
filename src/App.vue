<template>
  <div id="app">
    <Sounds />
    <div class="control-bar">
      <Timer />
      <GlobalControls />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import Sounds from './components/Sounds.vue'
import Timer from './components/Timer.vue'
import GlobalControls from './components/GlobalControls.vue'

const stopSignal = ref<'idle' | 'fading'>('idle')
const masterVolume = ref(100)
const stopAllTrigger = ref(0)

provide('stopSignal', stopSignal)
provide('masterVolume', masterVolume)
provide('stopAllTrigger', stopAllTrigger)
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

html, body {
  padding: 0;
  margin: 0;
  font-family: $font-base;
  background: $bg-base;
  #app {
    width: 100vw;
    min-height: 100vh;
  }
}

// même colonne centrée que la grille de sons (#Sounds : max-width 960 + padding 1rem)
.control-bar {
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 960px;
  padding: 0 1rem;
  z-index: 10;
  pointer-events: none;
}
</style>
