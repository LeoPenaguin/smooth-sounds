<template>
  <button class="ControlButton" :class="{ 'is-icon': icon }">
    <Icon v-if="icon" class="cb-icon" :icon="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{ icon?: string }>()
</script>

<style scoped lang="scss">
.ControlButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  min-width: 38px;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  background: $bg-element;
  color: $text-muted;
  transition: background-color 0.2s, color 0.2s;

  .cb-icon {
    font-size: 20px;
  }

  &.is-icon {
    width: 38px;
    padding: 0;
  }

  &:not(.is-icon) {
    padding: 0 1.1rem;
  }

  &:hover {
    background: $bg-element-hover;
    color: $accent;
  }
}
</style>
