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
import { sounds } from '@/data/sounds'
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
