<script lang="ts" setup name="CodeListItem">
import type { Code } from '@shared/types'
import type { ContextMenuItem } from '@nuxt/ui'

import { cn, formatDate } from '@/uitls'
import { languageIconMap } from '@/constants'

/**
 * Defines
 */
// Props
const { code, isTrash } = defineProps<{
  code: Code
  isActive: boolean
  isTrash: boolean
  codeCategory: string | null
}>()

// Emits
const emit = defineEmits<{
  onSelected: [id: number]
  onFavoriteToggle: [id: number]
  onRemove: [id: number]
  onRestore: [id: number]
}>()

/**
 * States
 */
// 删除确认弹窗
const confirmDialog = useTemplateRef('confirmDialog')

/**
 * Getters
 */
// 将Tags转换成数组
const tags = computed(() => (code.tags ? JSON.parse(code.tags) : []))

//  右键菜单选项
const contextMenuItems = computed<ContextMenuItem[]>(() => {
  const items = [
    {
      label: code.is_favorited ? '移出收藏夹' : '加入收藏夹',
      icon: code.is_favorited ? 'tabler:star-filled' : 'tabler:star',
      onSelect: () => handleFavoriteToggle()
    },
    { type: 'separator' },
    {
      label: isTrash ? '彻底删除代码片段' : '删除代码片段',
      icon: 'tabler:trash',
      onSelect: () => handleRemoveConfirm()
    }
  ]

  if (isTrash) {
    items.push({
      label: '恢复代码片段',
      icon: 'tabler:trash-off',
      onSelect: () => handleRestore()
    })
  }

  return items
})

/**
 * Actions
 */

// 选中当前代码片段
const handleSelected = () => {
  emit('onSelected', code.id)
}

// 切换收藏状态
const handleFavoriteToggle = () => {
  emit('onFavoriteToggle', code.id)
}

// 打开删除确认弹窗
const handleRemoveConfirm = () => {
  if (confirmDialog.value) {
    confirmDialog.value.open()
  }
}

// 删除代码片段
const handleRemove = () => {
  emit('onRemove', code.id)
}

// 恢复代码片段
const handleRestore = () => {
  emit('onRestore', code.id)
}
</script>

<template>
  <UContextMenu :items="contextMenuItems">
    <div
      :class="
        cn('group flex-y-2 p-2 w-full h-24 border-b border-border rounded-lg cursor-pointer trans-colors hover:bg-stone-50', {
          'bg-emerald-50': isActive
        })
      "
      :data-active="isActive"
      @click="handleSelected"
    >
      <!-- Code Title -->
      <div class="flex-x-2 text-sm text-stone-600 truncate group-data-[active=true]:text-emerald-500">
        <UIcon :name="languageIconMap[code.language].icon" />
        {{ code.title }}

        <UIcon v-if="code.is_favorited" name="tabler:star-filled" class="ml-auto size-5 text-emerald-500" />
      </div>

      <!-- Code Tags -->
      <div class="flex-x-2">
        <UBadge v-for="tag in tags" :key="tag" :label="tag" variant="soft" color="neutral" size="sm" />
      </div>

      <!-- Code Meta -->
      <div class="code-meta">
        <!-- Category -->
        <div class="code-meta-item">
          <UIcon name="tabler:folder" class="code-meta-item-icon" />
          <span>{{ codeCategory }}</span>
        </div>

        <!-- Updated At -->
        <div class="code-meta-item">
          <span>{{ formatDate(code.updated_at) }}</span>
        </div>
      </div>
    </div>
  </UContextMenu>

  <ConfirmDialog ref="confirmDialog" title="请确认" content="请确认是否删除该代码片段？" @on-confrim="handleRemove" />
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.code-meta {
  @apply flex-x-2 pt-2;

  .code-meta-item {
    @apply flex-x-1 text-xs text-stone-400;

    .code-meta-item-icon {
      @apply size-3 text-stone-400;
    }

    &:last-child {
      @apply ml-auto;
    }
  }
}
</style>
