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
  position: fixed;
  bottom: 1.25rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem;
  background: $bg-panel;
  border-radius: 9999px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55);

  &.left {
    left: 1.25rem;
  }

  &.center {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
