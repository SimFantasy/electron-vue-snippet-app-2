<script lang="ts" setup name="NavItem">
import { cn } from '@/uitls'

/**
 * Defines
 */
// Props
const { isDrag = false } = defineProps<{
  label: string
  icon: string
  isActive: boolean
  isDrag?: boolean
}>()

// Emits
const emit = defineEmits<{
  onSelected: [id?: number]
}>()

/**
 * Actions
 */
// 点击导航
const handleSelected = () => {
  emit('onSelected')
}
</script>

<template>
  <button
    :class="
      cn(
        'group flex-x-2 px-2 py-1 w-full rounded-md bg-transparent text-(--layout-text-secondary) trans-colors cursor-pointer hover:text-(--layout-text-primary) hover:bg-(--layout-bg-secondary) sortable-handle',
        {
          'bg-(--layout-active-bg) text-(--layout-active-text) hover:bg-(--layout-active-bg)': isActive
        }
      )
    "
    @click="handleSelected"
  >
    <!-- 图标 -->
    <UIcon :name="icon" :class="cn('size-4 text-(--layout-text-secondary) group-hover:text-(--layout-text-primary)')" />
    <!-- 标题 -->
    <span class="flex-1 text-left text-sm">{{ label }}</span>
    <!-- 导航尾部插槽 -->
    <slot />
  </button>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
