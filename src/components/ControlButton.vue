<template>
    <button
        class="bg-bg-element text-text-muted hover:bg-bg-element-hover hover:text-accent inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-full border-0 text-sm tracking-wider whitespace-nowrap uppercase transition-colors duration-200"
        :class="icon ? 'w-9 p-0' : 'px-4'"
    >
        <Icon v-if="icon" class="text-xl" :icon="icon" />
        <slot />
    </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{ icon?: string }>()
</script>
