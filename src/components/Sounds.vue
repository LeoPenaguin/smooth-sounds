<template>
  <div id="Sounds">
    <Sound
      v-for="sound in sounds"
      :key="sound.id"
      :label="sound.name"
      :icon="sound.icon"
      :bg-color="sound.bgColor"
      :icon-color="sound.iconColor"
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
  icon: string
  bgColor: string
  iconColor: string
  autoPlay: boolean
  loop: boolean
}

const soundModules = import.meta.glob<string>('/src/assets/sounds/*.mp3', {
  query: '?url',
  import: 'default',
  eager: true,
})

function getSound(name: string): string {
  return soundModules[`/src/assets/sounds/${name}.mp3`] ?? ''
}

const sounds: SoundEntry[] = [
  { id: 1,  name: 'Forest',      path: getSound('forest'),            icon: 'mdi:pine-tree',             bgColor: '#0f2417', iconColor: '#4ade80', autoPlay: false, loop: true },
  { id: 2,  name: 'Fire',        path: getSound('fire'),              icon: 'mdi:fire',                  bgColor: '#2a1107', iconColor: '#fb7536', autoPlay: false, loop: true },
  { id: 3,  name: 'Rain',        path: getSound('rain'),              icon: 'mdi:weather-pouring',       bgColor: '#0c1f30', iconColor: '#38bdf8', autoPlay: false, loop: true },
  { id: 4,  name: 'Thunder',     path: getSound('thunder'),           icon: 'mdi:weather-lightning-rainy', bgColor: '#1c1733', iconColor: '#a78bfa', autoPlay: false, loop: true },
  { id: 5,  name: 'Night',       path: getSound('night'),             icon: 'mdi:weather-night',         bgColor: '#12152b', iconColor: '#818cf8', autoPlay: false, loop: true },
  { id: 6,  name: 'River',       path: getSound('river'),             icon: 'mdi:waves',                 bgColor: '#07221f', iconColor: '#2dd4bf', autoPlay: false, loop: true },
  { id: 7,  name: 'Ocean',       path: getSound('wave'),              icon: 'mdi:sail-boat',             bgColor: '#0a1830', iconColor: '#60a5fa', autoPlay: false, loop: true },
  { id: 8,  name: 'City Street', path: getSound('pedestrian_street'), icon: 'mdi:road-variant',          bgColor: '#281d08', iconColor: '#fbbf24', autoPlay: false, loop: true },
  { id: 9,  name: 'Chimney',     path: getSound('chimney'),           icon: 'mdi:fireplace',             bgColor: '#2a0f0c', iconColor: '#f87171', autoPlay: false, loop: true },
  { id: 10, name: 'Underwater',  path: getSound('underwater'),        icon: 'mdi:fish',                  bgColor: '#08222a', iconColor: '#22d3ee', autoPlay: false, loop: true },
  { id: 11, name: 'Wiper',       path: getSound('wiper'),             icon: 'mdi:wiper',                 bgColor: '#16202b', iconColor: '#94a3b8', autoPlay: false, loop: true },
  { id: 12, name: 'Footsteps',   path: getSound('steps'),             icon: 'mdi:shoe-print',            bgColor: '#261521', iconColor: '#f472b6', autoPlay: false, loop: true },
]
</script>

<style scoped>
#Sounds {
  display: grid;
  grid-gap: 1rem;
  max-width: 960px;
  width: 100%;
  padding: 5rem 1rem;
  margin: 0 auto;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 2rem 1rem;
  }
}
</style>
