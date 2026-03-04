<script lang="ts" setup name="CategoryNavs">
import { useCategory } from '@/composables'

/**
 * Hooks
 */
const { categories, currentCategoryId, isCategoryDialogVisible, initSortable, openCategoryDialog } = useCategory()

/**
 * States
 */
const UTooltip = resolveComponent('UTooltip')

/**
 * Lifecycles
 */
onMounted(() => {
  initSortable()
})
</script>

<template>
  <div class="flex-1 flex-y-2 p-2 border-b border-(--layout-border)">
    <!-- Category Navs Topbar -->
    <div class="flex-x-2 justify-between h-4">
      <!-- Category Navigations Topbar -->
      <span class="text-xs text-(--layout-text-secondary)">分类</span>

      <UTooltip text="新建分类">
        <UButton icon="tabler:folder-plus" size="xs" variant="ghost" color="neutral" @click="openCategoryDialog('create')" />
      </UTooltip>
    </div>

    <!-- Category Navigations List -->
    <div ref="sortableCointainer" class="flex-1 flex-x-1">
      <div v-if="!categories || categories.length === 0" class="flex-center gap-2 py-4 w-full">
        <UIcon name="tabler:folder-off" class="size-4 text-(--layout-text-secondary)" />
        <span class="text-xs text-(--layout-text-secondary)">请先添加分类</span>
      </div>

      <CategoryNavItem
        v-else
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :is-active="category.id === currentCategoryId"
      />
    </div>

    <!-- Category Create/Update Dialog -->
    <CategoryNavMutationDialog v-model:open="isCategoryDialogVisible" />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
