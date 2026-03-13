<script lang="ts" setup name="ManagerDetail">
import type { CreateCodeInput } from '@shared/types'
import type { SelectItem } from '@nuxt/ui'

import { useCode, useCategory } from '@/composables'
import { languageOptions } from '@/constants'

/**
 * Hooks
 */
const {
  codes,
  currentCode,
  selectCode,
  updateTitle,
  updateCategory,
  updateTags,
  updateContent,
  updateLanguage,
  removeCode,
  toggleFavorite,
  isSaving
} = useCode()
const { categories } = useCategory()

const router = useRouter()
const toast = useToast()

/**
 * States
 */
const UInputTags = resolveComponent('UInputTags')

// 删除确认弹窗引用
const confirmDialog = useTemplateRef('confirmDialog')

// 代码片段详情初始化数据
const code = ref<CreateCodeInput>({
  title: '',
  category_id: 0,
  tags: [],
  content: '',
  language: 'javascript',
  is_favorited: false,
  sort_order: 0
})

// 代码统计信息
const codeStats = ref({
  line: 1,
  column: 1,
  totalLines: 1,
  totalChars: 0
})

/**
 * Getters
 */
// 分类选项
const categoryItems = computed<SelectItem[]>(() => {
  const items: SelectItem[] = [{ label: '未分类', value: 0 }]
  items.push(
    ...categories.value
      .filter((c) => c.id !== 0)
      .map((category) => ({
        label: category.name,
        value: category.id
      }))
  )
  return items
})

// 是否已经收藏
const isFavorited = computed(() => code.value.is_favorited)

/**
 * Actions
 */
// 处理标题变化
const handleTitleChange = async (title: string) => {
  if (!currentCode.value?.id) return
  code.value.title = title

  await updateTitle(currentCode.value.id, title)
}

// 处理分类变化
const handleCategoryChange = async (categoryId: number | undefined) => {
  if (!currentCode.value?.id || categoryId === undefined) return

  code.value.category_id = categoryId
  await updateCategory(currentCode.value.id, categoryId)
}

// 处理标签变化
// const handleTagsChange = async (tags: string[]) => {
//   if (!currentCode.value?.id) return

//   // 标签统一转为小写
//   const normalizedTags = tags.map((tag) => tag.toLowerCase())
//   code.value.tags = normalizedTags
//   await updateTags(currentCode.value.id, normalizedTags)
// }
// 处理标签变化
const handleTagsChange = async (tags: string[]) => {
  if (!currentCode.value?.id) return

  // 标签统一转为小写并过滤空值
  const normalizedTags = tags.map((tag) => tag.toLowerCase().trim()).filter((tag) => tag.length > 0)

  // 去重
  const uniqueTags = [...new Set(normalizedTags)]

  console.log('handleTagsChange:', uniqueTags)

  code.value.tags = uniqueTags
  await updateTags(currentCode.value.id, uniqueTags)
}

// 处理内容变化
const handleContentChange = async (content: string) => {
  if (!currentCode.value?.id) return

  code.value.content = content

  // 更新字数统计
  codeStats.value.totalChars = content.length
  await updateContent(currentCode.value.id, content)
}

// 处理语言变化
const handleLanguageChange = async (language: string) => {
  if (!currentCode.value?.id) return

  code.value.language = language
  await updateLanguage(currentCode.value.id, language)
}

// 处理收藏状态变化
const handleToggleFavorite = async () => {
  if (!currentCode.value?.id) return
  const result = await toggleFavorite(currentCode.value.id)
  if (result) {
    code.value.is_favorited = !code.value.is_favorited
  }
}

// 处理删除
const handleRemoveCode = async () => {
  if (!currentCode.value?.id) return

  const codeItem = currentCode.value
  const isTrash = codeItem.is_deleted
  const currentId = codeItem.id

  // 如果在回收站，则需要确认是否彻底删除
  if (isTrash) {
    confirmDialog.value?.open()
    return
  }

  // 获取当前代码在列表中的索引
  const currentIndex = codes.value.findIndex((c) => c.id === currentId)

  // 删除代码
  await handleRemove()

  //Todo: 删除完成后，如果codeList中还有其他代码，则显示当前删除的代码后一个代码，如果是最后一个代码，则显示上一个代码，如果删除后没有代码，则跳转到空白页面
  // 判断删除后列表状态
  if (codes.value.length === 0) {
    // 没有代码了，跳转到空白页面
    await router.push('/empty')
  } else {
    // 还有代码，决定显示哪一个
    let nextCodeId: number | null = null

    if (currentIndex < codes.value.length) {
      // 显示后一个（删除后原索引位置就是后一个）
      nextCodeId = codes.value[currentIndex]?.id ?? null
    } else if (currentIndex > 0) {
      // 是最后一个，显示前一个
      nextCodeId = codes.value[currentIndex - 1]?.id ?? null
    } else {
      // 只有一条数据且被删除了，显示第一个（如果有的话）
      nextCodeId = codes.value[0]?.id ?? null
    }

    // 如果没有可选的代码，跳转到空白页
    if (nextCodeId === null) {
      await router.push('/empty')
    } else {
      // 选中下一个代码
      selectCode(nextCodeId)
    }
  }

  // 提示
  toast.add({
    title: isTrash ? '删除成功' : '移至回收站成功',
    color: 'success'
  })
}

// 删除代码
const handleRemove = async () => {
  if (!currentCode.value?.id) return
  await removeCode(currentCode.value.id)
}

// 处理光标位置变化
const handleCursorChange = (line: number, column: number) => {
  codeStats.value.line = line
  codeStats.value.column = column
}

// 处理行数变化
const handleLineCountChange = (count: number) => {
  codeStats.value.totalLines = count
}

/**
 * Watchers
 */
// 监听currentCode变化，更新code
watch(
  () => currentCode.value,
  (newCode) => {
    if (newCode) {
      // 更健壮的 tags 解析
      let parsedTags: string[] = []

      if (Array.isArray(newCode.tags)) {
        parsedTags = newCode.tags
      } else if (typeof newCode.tags === 'string' && newCode.tags.trim()) {
        try {
          parsedTags = JSON.parse(newCode.tags)
        } catch (e) {
          console.error('Failed to parse tags:', newCode.tags)
          parsedTags = []
        }
      }

      console.log('Setting tags:', parsedTags) // 添加日志确认

      code.value = {
        title: newCode.title || '',
        category_id: newCode.category_id || 0,
        tags: parsedTags, // 确保这里是数组
        content: newCode.content || '',
        language: newCode.language || 'javascript',
        is_favorited: newCode.is_favorited || false
      }

      codeStats.value.totalChars = newCode.content?.length || 0
    }
  },
  { immediate: true }
)

// watch(
//   () => currentCode.value,
//   (newCode) => {
//     console.log('currentCode changed:', newCode?.id, 'tags:', newCode?.tags)
//     if (newCode) {
//       code.value = {
//         title: newCode.title,
//         category_id: newCode.category_id,
//         // tags: typeof newCode.tags === 'string' ? JSON.parse(newCode.tags || '[]') || [] : newCode.tags || [],
//         tags: Array.isArray(newCode.tags)
//           ? newCode.tags
//           : typeof newCode.tags === 'string' && newCode.tags.trim() !== ''
//             ? JSON.parse(newCode.tags)
//             : [],
//         content: newCode.content,
//         language: newCode.language,
//         is_favorited: newCode.is_favorited
//       }
//       codeStats.value.totalChars = newCode.content.length
//     }
//   },
//   { immediate: true }
// )
</script>

<template>
  <div class="col-span-15 manager-panel flex-y">
    <!-- Topbar -->
    <div class="flex-x-2 justify-between px-2 h-12 border-b border-border">
      <!-- Snippet Title -->
      <UInput v-model="code.title" class="flex-1" @update:model-value="handleTitleChange" />

      <USeparator orientation="vertical" />

      <!-- Snippet Category -->
      <USelect
        v-model="code.category_id"
        :items="categoryItems"
        @update:model-value="(val) => handleCategoryChange(val as number)"
      />
    </div>

    <!-- Tags -->
    <div class="flex-x-2 justify-between px-2 h-10 border-b border-border">
      <UInputTags v-model="code.tags" class="flex-1" @update:model-value="handleTagsChange" />

      <USeparator orientation="vertical" />

      <div class="flex-x-2">
        <!-- Favorite -->
        <UButton
          :icon="isFavorited ? 'tabler:star-filled' : 'tabler:star'"
          :label="isFavorited ? '已收藏' : '收藏'"
          :color="isFavorited ? 'primary' : 'neutral'"
          variant="ghost"
          size="sm"
          @click="handleToggleFavorite"
        />

        <!-- Remove -->
        <UButton icon="tabler:trash" label="删除" variant="ghost" color="error" size="sm" @click="handleRemoveCode" />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-2">
      <CodeEditor
        ref="codeEditorEL"
        v-model="code.content"
        :language="code.language!"
        @on-cursor-change="handleCursorChange"
        @on-line-count="handleLineCountChange"
        @on-content-change="handleContentChange"
      />
    </div>

    <!-- Bottombar -->
    <div class="flex-x-2 justify-between px-2 h-10 rounded-b-md bg-stone-50 border-t border-border text-sm text-stone-500">
      <!-- Language -->
      <USelect v-model="code.language" :items="languageOptions" @update:model-value="handleLanguageChange" />

      <USeparator orientation="vertical" />

      <div class="flex-1 flex-x-2 justify-center">
        <!-- 统计 -->
        <span>行：{{ codeStats.line }}</span>
        <span>当前：{{ codeStats.line }}:{{ codeStats.column }}</span>
        <div>字数：{{ codeStats.totalChars }}</div>
        <!-- 状态指示器 -->
        <span v-if="isSaving" class="flex-x-1 text-stone-300">
          <UIcon name="tabler:loader-2" class="size-4 animate-spin" />
          保存中...
        </span>
        <span v-else class="flex-x-1 text-emerald-500">
          <UIcon name="tabler:check" class="size-4" />
          已保存
        </span>
      </div>

      <USeparator orientation="vertical" />

      <!-- Share -->
      <div class="flex-end">
        <UButton icon="tabler:share" variant="ghost" color="neutral" size="sm" />
      </div>
    </div>
  </div>

  <ConfirmDialog ref="confirmDialog" title="请确认" content="请确认是否删除该代码片段？" @on-confrim="handleRemove" />
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
