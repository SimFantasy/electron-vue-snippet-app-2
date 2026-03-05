<script lang="ts" setup name="CategoryNavItem">
import type { Category } from '@shared/types'
import { ContextMenuItem } from '@nuxt/ui'
import { useCategory, useCode } from '@/composables'

/**
 * Defines
 */

// Props
const { category } = defineProps<{
  category: Category
  isActive: boolean
}>()

// Emits
const emit = defineEmits<{
  onSelect: [id: number]
}>()

/**
 * Hooks
 */
const { openCategoryDialog, removeCategory } = useCategory()
const { selectCode, createCode } = useCode()

/**
 * States
 */
const UContextMenu = resolveComponent('UContextMenu')

// 右键菜单
const contextMenuItems = ref<ContextMenuItem[]>([
  {
    label: '修改文件夹',
    icon: 'tabler:edit',
    onSelect: () => openCategoryDialog('update', category)
  },
  {
    label: '删除文件夹',
    icon: 'tabler:trash',
    onSelect: async () => await removeCategory(category.id)
  },
  {
    type: 'separator'
  },
  {
    label: '创建代码片段',
    icon: 'tabler:file-plus',
    onSelect: async () => {
      // 创建代码片段
      const id = await createCode()

      // 设置当前代码片段
      if (id) {
        selectCode(id)
      }
    }
  }
])

/**
 * Actions
 */
const handleSelected = () => {
  emit('onSelect', category.id)
}
</script>

<template>
  <UContextMenu :items="contextMenuItems">
    <NavItem :label="category.name" icon="tabler:folder" :is-active="isActive" is-drag @on-selected="handleSelected" />
  </UContextMenu>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
