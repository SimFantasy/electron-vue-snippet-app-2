<script lang="ts" setup name="TagNavItem">
import { cn } from '@/uitls'

/**
 * Defines
 */
// Props
const { isActive, tag } = defineProps<{
  tag: string
  isActive: boolean
}>()

// Emits
const emit = defineEmits<{
  onSelect: [tag: string]
}>()

/**
 * Actions
 */
const handleSelect = (tag: string) => {
  emit('onSelect', tag)
}
</script>

<template>
  <button
    :class="
      cn(
        'px-1.5  py-1 bg-transparent rounded-md text-xs text-(--layout-text-secondary) cursor-pointer trans-colors hover:bg-(--layout-bg-secondary) hover:text-(--layout-text-primary)',
        {
          'bg-(--layout-active-bg) text-(--layout-active-text)': isActive
        }
      )
    "
    @click="handleSelect(tag)"
  >
    {{ tag }}
  </button>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
