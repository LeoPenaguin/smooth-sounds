<template>
    <!-- alignés sur le contenu de la colonne (px-4 de la control-bar) -->
    <div
        class="bg-bg-panel pointer-events-auto absolute bottom-0 flex items-center gap-1.5 rounded-full p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
        :class="position === 'left' ? 'left-4' : 'left-1/2 -translate-x-1/2'"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ position?: 'left' | 'center' }>(), { position: 'center' })
</script>
