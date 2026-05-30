<template>
  <div class="Sound" :class="{ playing }" @click.prevent="togglePlay">
    <div class="cover">
      <img class="cover-image" :src="cover" alt="" />
      <svg class="progress-ring" viewBox="0 0 150 150">
        <circle
          class="progress-ring__circle"
          stroke="#FF00FF"
          stroke-width="6"
          fill="transparent"
          cx="75" cy="75" r="72"
          stroke-linecap="round"
          :stroke-dasharray="`${circumference} ${circumference}`"
          :stroke-dashoffset="strokeDashoffset"
        />
      </svg>
    </div>
    <div class="controls">
      <input @click.stop class="sound-slider" v-model.number="volume" type="range" min="0" max="100" />
    </div>
    <audio :loop="loop" ref="audioEl" :src="file" preload="auto" style="display: none;" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  file: string
  cover: string
  autoPlay?: boolean
  loop?: boolean
}>(), {
  autoPlay: false,
  loop: false,
})

const audioEl = ref<HTMLAudioElement>()
const playing = ref(false)
const currentSeconds = ref(0)
const durationSeconds = ref(0)
const volume = ref(100)

// radius is hardcoded to 72 in the template
const circumference = 72 * 2 * Math.PI

const percentComplete = computed(() =>
  durationSeconds.value ? Math.round(currentSeconds.value / durationSeconds.value * 100) : 0
)

const strokeDashoffset = computed(() =>
  circumference - percentComplete.value / 100 * circumference
)

watch(playing, (value) => {
  if (!audioEl.value) return
  if (value) audioEl.value.play()
  else audioEl.value.pause()
})

watch(volume, (value) => {
  if (audioEl.value) audioEl.value.volume = value / 100
})

function togglePlay() {
  playing.value = !playing.value
}

onMounted(() => {
  const audio = audioEl.value!

  audio.addEventListener('timeupdate', () => {
    currentSeconds.value = Math.floor(audio.currentTime)
  })

  audio.addEventListener('loadeddata', () => {
    if (audio.readyState >= 2) {
      durationSeconds.value = Math.floor(audio.duration)
      playing.value = props.autoPlay
    }
  })

  audio.addEventListener('pause', () => {
    playing.value = false
    audio.currentTime = 0
  })

  audio.addEventListener('play', () => {
    playing.value = true
  })
})
</script>

<style lang="scss" scoped>
.Sound {
  border-radius: 1rem;
  padding: 1rem;
  transition: background-color 0.3s;

  .cover {
    height: 150px;
    width: 150px;
    border-radius: 100%;
    box-shadow: 0 0 0 6px #193043 inset;
    position: relative;

    .cover-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }

    .progress-ring__circle {
      transition: 0.2s stroke-dashoffset;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
  }

  .controls {
    width: 100%;
    padding: 1rem 0 0.5rem 0;

    .sound-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      background: #193043;
      outline: none;
      opacity: 1;
      border-radius: 1rem;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background-color: #193043;
        cursor: pointer;
        border-radius: 3rem;
        border: 0;
        transition: background-color 0.3s;
      }

      &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background-color: #193043;
        cursor: pointer;
        border-radius: 3rem;
        border: 0;
        transition: background-color 0.3s;
      }
    }
  }

  &.playing {
    background-color: #091119;

    .controls .sound-slider {
      &::-webkit-slider-thumb {
        background-color: #FF00FF;
      }

      &::-moz-range-thumb {
        background-color: #FF00FF;
      }
    }
  }
}
</style>
