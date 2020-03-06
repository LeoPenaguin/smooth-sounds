<template>
  <div id="app">
    <Sounds/>
    <Timer/>
  </div>
</template>

<script>
import Sounds from './components/Sounds.vue'
import Timer from './components/Timer.vue'

export default {
  name: 'App',
  components: {
    Sounds,
    Timer
  }
}
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
        height: 100vh;
    }
}
</style>
