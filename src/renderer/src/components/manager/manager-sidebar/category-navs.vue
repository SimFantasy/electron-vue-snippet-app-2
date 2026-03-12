<script lang="ts" setup name="CategoryNavs">
import { VueDraggable } from 'vue-draggable-plus'
import { useCategory, useTag } from '@/composables'

/**
 * Hooks
 */
const {
  categories,
  currentCategoryId,
  isCategoryDialogVisible,
  updatingCategory,

  openCategoryDialog,
  onCreateCategorySubmit,
  onUpdateCategorySubmit,
  selectCategory,

  handleReorder
} = useCategory()

const { clearTag } = useTag()

/**
 * States
 */
const UTooltip = resolveComponent('UTooltip')

/**
 * Actions
 */
// 处理分类选择
const handleSelectCategory = (id: number) => {
  // 清除标签选择
  clearTag()
  // 选择分类
  selectCategory(id)
}

// 拖拽结束后的处理
const handleDragEnd = () => {
  handleReorder(categories.value)
}
</script>

<template>
  <div class="h-[calc(100vh-var(--spacing)*100)] border-b border-(--layout-border) overflow-hidden">
    <div class="flex-y-2 h-full">
      <!-- Category Navs Topbar -->
      <div class="flex-x-2 justify-between p-2 h-4">
        <!-- 分类标题 -->
        <span class="text-xs text-(--layout-text-secondary)">分类</span>

        <!-- 新建分类按钮 -->
        <UTooltip text="新建分类">
          <UButton icon="tabler:folder-plus" size="xs" variant="ghost" color="neutral" @click="openCategoryDialog('create')" />
        </UTooltip>
      </div>

      <!-- Category Navigations List -->
      <div class="flex-1 flex-x-1 pt-6 pb-2 overflow-y-auto">
        <div v-if="!categories || categories.length === 0" class="flex-center gap-2 py-4 w-full">
          <UIcon name="tabler:folder-off" class="size-4 text-(--layout-text-secondary)" />
          <span class="text-xs text-(--layout-text-secondary)">请先添加分类</span>
        </div>

        <div v-else class="flex-y-1 pt-2 px-2 w-full">
          <VueDraggable
            v-model="categories"
            :animation="150"
            ghost-class="drag-ghost"
            chosen-class="drag-chosen"
            drag-class="drag-dragging"
            @end="handleDragEnd"
          >
            <CategoryNavItem
              v-for="category in categories"
              :key="category?.id"
              :category="category"
              :is-active="category.id === currentCategoryId"
              @on-select="handleSelectCategory"
            />
          </VueDraggable>
        </div>
      </div>

      <!-- Category Create/Update Dialog -->
      <CategoryNavMutationDialog
        v-model:open="isCategoryDialogVisible"
        :category="updatingCategory"
        @on-create="onCreateCategorySubmit"
        @on-update="onUpdateCategorySubmit"
      />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.drag-ghost {
  opacity: 0.4;
  background-color: var(--layout-active-bg) !important;
}

.drag-chosen {
  background-color: var(--layout-bg-secondary);
}

.drag-dragging {
  opacity: 0.8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
