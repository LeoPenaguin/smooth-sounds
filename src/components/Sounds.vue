<template>
  <div id="Sounds">
    <Sound
      v-for="sound in sounds"
      :key="sound.id"
      :label="sound.name"
      :cover="sound.cover"
      :file="sound.path"
      :auto-play="sound.autoPlay"
      :loop="sound.loop"
    />
  </div>
</template>

<script setup lang="ts">
import Sound from '@/components/Sound.vue'

interface SoundEntry {
  id: number
  name: string
  path: string
  cover: string
  autoPlay: boolean
  loop: boolean
}

const soundModules = import.meta.glob<string>('/src/assets/sounds/*.mp3', {
  query: '?url',
  import: 'default',
  eager: true,
})
const coverModules = import.meta.glob<string>('/src/assets/covers/*', {
  query: '?url',
  import: 'default',
  eager: true,
})

function getSound(name: string): string {
  return soundModules[`/src/assets/sounds/${name}.mp3`] ?? ''
}

function getCover(name: string, ext = 'gif'): string {
  return coverModules[`/src/assets/covers/${name}.${ext}`] ?? ''
}

const sounds: SoundEntry[] = [
  { id: 1,  name: 'Forest',      path: getSound('forest'),            cover: getCover('forest'),            autoPlay: false, loop: true },
  { id: 2,  name: 'Fire',        path: getSound('fire'),              cover: getCover('fire'),              autoPlay: false, loop: true },
  { id: 3,  name: 'Rain',        path: getSound('rain'),              cover: getCover('rain'),              autoPlay: false, loop: true },
  { id: 4,  name: 'Thunder',     path: getSound('thunder'),           cover: getCover('thunder'),           autoPlay: false, loop: true },
  { id: 5,  name: 'Night',       path: getSound('night'),             cover: getCover('night'),             autoPlay: false, loop: true },
  { id: 6,  name: 'River',       path: getSound('river'),             cover: getCover('river'),             autoPlay: false, loop: true },
  { id: 7,  name: 'Ocean',       path: getSound('wave'),              cover: getCover('wave'),              autoPlay: false, loop: true },
  { id: 8,  name: 'City Street', path: getSound('pedestrian_street'), cover: getCover('pedestrian_street'), autoPlay: false, loop: true },
  { id: 9,  name: 'Chimney',     path: getSound('chimney'),           cover: getCover('chimney'),           autoPlay: false, loop: true },
  { id: 10, name: 'Underwater',  path: getSound('underwater'),        cover: getCover('underwater'),        autoPlay: false, loop: true },
  { id: 11, name: 'Wiper',       path: getSound('wiper'),             cover: getCover('wiper'),             autoPlay: false, loop: true },
  { id: 12, name: 'Footsteps',   path: getSound('steps'),             cover: getCover('no_image', 'png'),  autoPlay: false, loop: true },
]
</script>

<style scoped>
#Sounds {
  display: grid;
  grid-gap: 1rem;
  width: 960px;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;
  margin: 0 auto;
  grid-template-columns: auto auto auto auto;
}
</style>
