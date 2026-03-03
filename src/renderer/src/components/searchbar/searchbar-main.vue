<script lang="ts" setup name="SearchbarMain">
import { useSettings, useSearch } from '@/composables'

/**
 * Hooks
 */
const { appearanceSettings } = useSettings()
const { keyword, debouncedSearch, handleKeyNavigation, clearSearch, openManagePage } = useSearch()

/**
 * States
 */
const UInput = resolveComponent('UInput')
const UButton = resolveComponent('UButton')

/**
 * Lifecycles
 */
onMounted(() => {
  // 处理键盘事件
  window.addEventListener('keydown', handleKeyNavigation)
})

onUnmounted(() => {
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeyNavigation)
})
</script>

<template>
  <div class="relative w-full h-(--searchbar-height) rounded-lg bg-(--layout-bg-primary) overflow-hidden">
    <!-- OverLay -->
    <div class="absolute inset-0 z-10 flex-x-2 px-2 size-full">
      <UInput
        autofocus
        :model-value="keyword"
        size="lg"
        icon="tabler:search"
        placeholder="输入 分类:关键字 搜索代码片段..."
        @update:model-value="debouncedSearch"
        class="w-full"
      >
        <template #tralling>
          <UButton if="keyword" icon="tabler:x" variant="ghost" color="neutral" size="xs" @click="clearSearch" />
        </template>
      </UInput>

      <UButton icon="tabler:settings-2" variant="ghost" color="neutral" title="打开代码片段管理" @click="openManagePage" />
    </div>

    <!-- Background Image -->
    <img
      v-if="appearanceSettings?.searchbar.backgroundImage"
      :src="appearanceSettings.searchbar.backgroundImage"
      class="absolute inset-0 z-0 size-full object-cover"
    />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
