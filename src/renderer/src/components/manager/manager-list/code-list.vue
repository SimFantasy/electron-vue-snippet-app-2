<script lang="ts" setup name="CodeList">
import { useCode, useCategory, useCodeScroll } from '@/composables'

/**
 * Hooks
 */
const { codes, currentCodeId, selectCode, loadCodes, loadMore, isLoading, pagination, toggleFavorite, removeCode, restoreCode } =
  useCode()
const { categories, currentCategoryId } = useCategory()

/**
 * States
 */
const UEmpty = resolveComponent('UEmpty')

// 无限滚动容器
const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainer')

/**
 * Getters
 */
// 当前是否是回收站
const isTrash = computed(() => currentCategoryId.value === -2)

/**
 * Actions
 */
// 获取代码片段所属分类名称
const handleCurrentCategory = (id: number | null) => {
  if (id === null) return null
  const category = categories.value.find((c) => c.id === id)
  return category?.name || '未分类'
}

// 选择代码片段
const handleSelectCode = (id: number) => {
  selectCode(id)
}

// 切换收藏状态
const handleToggleFavorite = async (id: number) => {
  await toggleFavorite(id)
}

// 删除代码片段
const handleRemoveCode = async (id: number) => {
  await removeCode(id)
}

// 恢复代码片段
const handleRestoreCode = async (id: number) => {
  await restoreCode(id)
}

// 初始化代码无限加载
useCodeScroll({
  containerRef: scrollContainerRef,
  loadMore,
  hasMore: computed(() => pagination.value.hasMore),
  isLoading: computed(() => isLoading.value),
  threshold: 100,
  debounceDelay: 200
})

/**
 * Lifecycles
 */
onMounted(() => {
  // 初始化加载代码列表
  loadCodes(true)
})
</script>

<template>
  <div ref="scrollContainer" class="flex-1 flex-y-1 p-2 h-[calc(100vh-var(--spacing)*12-var(--spacing)*16)] overflow-y-auto">
    <!-- 空状态 -->
    <UEmpty
      v-if="codes.length === 0 && !isLoading"
      icon="tabler:inbox"
      title="暂无代码片段"
      variant="naked"
      :ui="{
        title: 'text-sm font-normal text-stone-400'
      }"
    />

    <!-- 代码列表 -->
    <CodeListItem
      v-for="code in codes"
      :key="code.id"
      :code="code"
      :is-active="code.id === currentCodeId"
      :is-trash="isTrash"
      :code-category="handleCurrentCategory(code.category_id)"
      @on-selected="handleSelectCode"
      @on-favorite-toggle="handleToggleFavorite"
      @on-remove="handleRemoveCode"
      @on-restore="handleRestoreCode"
    />

    <!-- 加载更多触发器 -->
    <div v-show="pagination.hasMore" class="flex-center py-2">
      <UIcon v-if="isLoading" name="tabler:loader-2" class="size-5 animate-spin text-stone-300" />
      <span v-else class="text-xs text-stone-400">加载更多...</span>
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
