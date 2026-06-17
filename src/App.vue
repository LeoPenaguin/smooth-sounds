<template>
  <div id="app">
    <Sounds />
    <Timer />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import Sounds from './components/Sounds.vue'
import Timer from './components/Timer.vue'

const stopSignal = ref<'idle' | 'fading'>('idle')
provide('stopSignal', stopSignal)
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

html, body {
  padding: 0;
  margin: 0;
  background: #0c161f;
  #app {
    width: 100vw;
    min-height: 100vh;
  }
}
</style>
