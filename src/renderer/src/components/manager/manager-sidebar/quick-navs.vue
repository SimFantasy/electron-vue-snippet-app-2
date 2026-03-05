<script lang="ts" setup name="QuickNavs">
import { useCategory, useTag, useCode } from '@/composables'

/**
 * Hooks
 */
const { selectCategory, currentCategoryId } = useCategory()
const { clearTag } = useTag()
const { clearTrash, trashCodes, favoriteCodes, uncategorizedCodes, allCodesCount } = useCode()

/**
 * States
 */
// 当前选中的快捷导航ID
// const currentQuickNavId = ref(-99)
// 确认弹窗Ref
const confirmDialogRef = useTemplateRef('confirmDialog')

const quickNavs = [
  { id: -99, label: '全部代码片段', icon: 'tabler:folder-code' },
  { id: 0, label: '未分类', icon: 'tabler:folder-off' },
  { id: -1, label: '收藏夹', icon: 'tabler:star' },
  { id: -2, label: '回收站', icon: 'tabler:trash' }
]

/**
 * Actions
 */
// 处理快捷导航选择
const handleQuickNavSelected = (id: number) => {
  // 更新选中状态
  // currentQuickNavId.value = id
  // 清除标签选择
  clearTag()
  // 根据id设置对应的筛选条件并加载代码
  selectCategory(id)
}

// 获取导航的代码片段数量
const getNavCount = (id: number) => {
  switch (id) {
    case -2:
      return trashCodes.value.length
    case -1:
      return favoriteCodes.value.length
    case 0:
      return uncategorizedCodes.value.length
    case -99:
    default:
      return allCodesCount.value
  }
}

// 打开清空回收站确认弹窗
const handleOpenConfirmDialog = () => {
  if (!confirmDialogRef.value) return

  confirmDialogRef.value.open()
}

// 清空回收站
const handleClearTrash = async () => {
  await clearTrash()
  // 刷新后重新选中回收站
  selectCategory(-2)
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
        :is-active="currentCategoryId === nav.id"
        @on-selected="handleQuickNavSelected(nav.id)"
        class="group"
      >
        <div class="flex-end gap-1">
          <!-- 清空回收站 -->
          <UIcon
            v-if="nav.id === -2"
            name="tabler:trash-x"
            title="清空回收站"
            class="hidden group-hover:block size-4"
            @click="handleOpenConfirmDialog"
          />
          <!-- 显示数量 -->
          <UBadge variant="soft" color="neutral" size="xs" :label="String(getNavCount(nav.id))" />
        </div>
      </NavItem>
    </div>

    <!-- 确认弹窗 -->
    <ConfirmDialog
      ref="confirmDialog"
      title="请确认"
      :content="`请确认是否要清空回收站？此操作无法恢复，请谨慎操作！`"
      @on-confrim="handleClearTrash"
    />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
