<script lang="ts" setup name="QuickNavs">
import { useCategory, useTag } from '@/composables'

/**
 * Hooks
 */
const { selectCategory } = useCategory()
const { clearTag } = useTag()

/**
 * States
 */
const quickNavs = ref<{ id: number; label: string; icon: string }[]>([
  { id: -99, label: '全部代码片段', icon: 'tabler:folder-code' },
  { id: 0, label: '未分类', icon: 'tabler:folder-off' },
  { id: -1, label: '收藏夹', icon: 'tabler:star' },
  { id: -2, label: '回收站', icon: 'tabler:trash' }
])

// 当前选中的快捷导航ID
const currentQuickNavId = ref(-99)

/**
 * Actions
 */
// 处理快捷导航选择
const handleQuickNavSelected = (id: number) => {
  // 更新选中状态
  currentQuickNavId.value = id
  // 清除标签选择
  clearTag()
  // 根据id设置对应的筛选条件并加载代码
  selectCategory(id)
}
</script>

<template>
  <div class="flex-y-2 p-2 w-full border-b border-(--layout-border)">
    <span class="text-xs text-(--layout-text-secondary)">快捷操作</span>
    <div class="flex-y-1">
      <NavItem
        v-for="nav in quickNavs"
        :key="nav.id"
        :icon="nav.icon"
        :label="nav.label"
        :is-active="currentQuickNavId === nav.id"
        @on-selected="handleQuickNavSelected(nav.id)"
      />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
