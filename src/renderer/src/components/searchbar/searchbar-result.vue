<script lang="ts" setup name="SearchbarResult">
import { useSearch } from '@/composables'

/**
 * Hooks
 */
const { results, selectedIndex, hasResults, selectedByIndex, confirmSelection } = useSearch()

/**
 * Actions
 */
// 处理结果项点击
const handleItemClick = (index: number) => {
  selectedByIndex(index)
  confirmSelection()
}
</script>

<template>
  <div v-if="hasResults" class="p-2 w-full h-[calc(100vh-var(--searchbar-height))] overflow-y-auto bg-(--layout-bg-secondary)">
    <!-- 结果列表 -->
    <div v-if="hasResults">
      <SearchbarResultItem
        v-for="(code, index) in results"
        :key="code.id"
        :code="code"
        :index="index"
        :is-selected="selectedIndex === index"
        @click="handleItemClick"
      />
    </div>

    <!-- 无结果 -->
    <div v-else class="flex-center py-4 text-sm text-(--layout-secondary-text)">
      <span>没有找到匹配的结果</span>
    </div>

    <!-- 快捷键提示 -->
    <div class="text-center text-xs text-(--layout-secondary-text)">
      <span>↑↓: 选择结果, Enter: 复制结果, ESC: 隐藏搜索框</span>
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
