<template>
    <div
        class="mx-auto grid w-full max-w-5xl grid-cols-4 gap-4 px-4 py-20 max-sm:grid-cols-2 max-sm:py-8"
    >
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
