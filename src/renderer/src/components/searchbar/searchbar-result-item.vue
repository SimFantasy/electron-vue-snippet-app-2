<script lang="ts" setup name="SearchbarResultItem">
import type { Code } from '@shared/types'
import { cn } from '@/uitls'

/**
 * Defines
 */
// Props
defineProps<{
  code: Code
  isSelected: boolean
  index: number
}>()

// Emits
const emit = defineEmits<{
  click: [index: number]
}>()

/**
 * Actions
 */
const handleClick = (index: number) => {
  emit('click', index)
}
</script>

<template>
  <div
    :class="
      cn(
        'flex-x-2 px-2 py-1.5 rounded-md text-sm text-stone-500 truncate cursor-pointer trans-colors hover:bg-(--layout-bg-primary)',
        {
          'bg-(--layout-active-bg) text-(--layout-active-text)': isSelected
        }
      )
    "
    @click="handleClick(index)"
  >
    {{ code.title }}
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
