<script lang="ts" setup name="NavItem">
import { cn } from '@/uitls'
/**
 * Defines
 */
// Props
defineProps<{
  label: string
  icon: string
  isActive: boolean
}>()

// Emits
defineEmits<{
  onSelected: [id?: number]
}>()
</script>

<template>
  <button
    :class="
      cn(
        'group flex-x-2 px-2 h-8 rounded-lg bg-transparent text-(--layout-text-secondary) trans-colors cursor-pointer hover:text-(--layout-text-primary) hover:bg-(--layout-bg-secondary)',
        {
          'bg-(--layout-active-bg) text-(--layout-active-text) hover:bg-(--layout-active-bg)': isActive
        }
      )
    "
  >
    <UIcon :name="icon" class="size-5 text-(--layout-text-secondary) group-hover:text-(--layout-text-primary)" />
    <span class="text-sm">{{ label }}</span>
  </button>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
