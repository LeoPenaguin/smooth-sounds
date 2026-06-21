<template>
  <div class="ControlPanel" :class="position">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ position?: 'left' | 'center' }>(), { position: 'center' })
</script>

<style scoped lang="scss">
.ControlPanel {
  position: absolute;
  bottom: 0;
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem;
  background: $bg-panel;
  border-radius: 9999px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55);

  // alignés sur le contenu de la colonne (padding 1rem de .control-bar)
  &.left {
    left: 1rem;
  }

  &.center {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
