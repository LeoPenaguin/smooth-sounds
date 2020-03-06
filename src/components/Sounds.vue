<template>
    <div id="Sounds">
        <Sound v-bind:key="sound.id" v-for="sound in sounds" :cover="sound.cover" :file="sound.path" :autoPlay="sound.autoPlay" :loop="sound.loop" />
    </div>
</template>

<script>
import Sound from '@/components/Sound'

export default {
  name: 'Sounds',
  components: {
    Sound,
  },
  data: () => ({
    sounds: [
        {
            id: 1,
            path: require('@/assets/sounds/forest.mp3'),
            cover: require('@/assets/covers/forest.gif'),
            autoPlay: false,
            loop: true
        },
        {
            id: 2,
            path: require('@/assets/sounds/fire.mp3'),
            cover: require('@/assets/covers/fire.gif'),
            autoPlay: false,
            loop: true
        },
        {
            id: 3,
            path: require('@/assets/sounds/rain.mp3'),
            cover: require('@/assets/covers/rain.gif'),
            autoPlay: false,
            loop: true
        },
        {
            id: 4,
            path: require('@/assets/sounds/thunder.mp3'),
            cover: require('@/assets/covers/thunder.gif'),
            autoPlay: false,
            loop: true
        },
        {
            id: 5,
            path: require('@/assets/sounds/night.mp3'),
            cover: require('@/assets/covers/night.gif'),
            autoPlay: false,
            loop: true
        },
        {
            id: 6,
            path: require('@/assets/sounds/river.mp3'),
            cover: require('@/assets/covers/river.gif'),
            autoPlay: false,
            loop: true
        },
        {
            id: 7,
            path: require('@/assets/sounds/wave.mp3'),
            cover: require('@/assets/covers/no_image.png'),
            autoPlay: false,
            loop: true
        },
        {
            id: 8,
            path: require('@/assets/sounds/pedestrian_street.mp3'),
            cover: require('@/assets/covers/no_image.png'),
            autoPlay: false,
            loop: true
        },
        {
            id: 9,
            path: require('@/assets/sounds/chimney.mp3'),
            cover: require('@/assets/covers/no_image.png'),
            autoPlay: false,
            loop: true
        },
        {
            id: 10,
            path: require('@/assets/sounds/underwater.mp3'),
            cover: require('@/assets/covers/no_image.png'),
            autoPlay: false,
            loop: true
        },
        {
            id: 11,
            path: require('@/assets/sounds/wiper.mp3'),
            cover: require('@/assets/covers/no_image.png'),
            autoPlay: false,
            loop: true
        },
        {
            id: 12,
            path: require('@/assets/sounds/steps.mp3'),
            cover: require('@/assets/covers/no_image.png'),
            autoPlay: false,
            loop: true
        },
    ]
	}),
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
