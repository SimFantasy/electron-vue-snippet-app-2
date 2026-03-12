<script lang="ts" setup name="ManagerDetail">
import type { CreateCodeInput } from '@shared/types'
import type { SelectItem } from '@nuxt/ui'

import { useCode, useCategory } from '@/composables'
import { languageOptions } from '@/constants'

/**
 * Hooks
 */
const { currentCode } = useCode()
const { categories } = useCategory()

/**
 * States
 */
const UInputTags = resolveComponent('UInputTags')
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

/**
 * Getters
 */
// 分类选项
const categoryItems = computed<SelectItem[]>(() =>
  categories.value.map((category) => {
    if (category.id === 0) {
      return {
        label: '未分类',
        value: 0
      }
    }
    return {
      label: category.name,
      value: category.id
    }
  })
)

/**
 * Watchers
 */
// 监听currentCode变化，更新code
watch(
  () => currentCode.value,
  (newCode) => {
    if (newCode) {
      code.value = {
        title: newCode.title,
        category_id: newCode.category_id,
        tags: typeof newCode.tags === 'string' ? JSON.parse(newCode.tags || '[]') || [] : newCode.tags || [],
        content: newCode.content,
        language: newCode.language,
        is_favorited: newCode.is_favorited
      }
    }
  }
)
</script>

<template>
  <div class="col-span-15 manager-panel flex-y">
    <!-- Topbar -->
    <div class="flex-x-2 justify-between px-2 h-12 border-b border-border">
      <!-- Snippet Title -->
      <UInput v-model="code.title" class="flex-1" />

      <USeparator orientation="vertical" />

      <!-- Snippet Category -->
      <USelect v-model="code.category_id" :items="categoryItems" />
    </div>

    <!-- Tags -->
    <div class="flex-x-2 justify-between px-2 h-10 border-b border-border">
      <UInputTags v-model="code.tags" class="flex-1" />

      <USeparator orientation="vertical" />

      <div class="flex-x-2">
        <!-- Favorite -->
        <UButton icon="tabler:star" label="藏夹" variant="ghost" color="neutral" size="sm" />

        <!-- Remove -->
        <UButton icon="tabler:trash" label="删除" variant="ghost" color="error" size="sm" />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-2">
      <CodeEditor v-model="code.content" />
    </div>

    <!-- Bottombar -->
    <div class="flex-x-2 justify-between px-2 h-10 rounded-b-md bg-stone-50 border-t border-border text-sm text-stone-500">
      <!-- Language -->
      <USelect v-model="code.language" :items="languageOptions" />

      <USeparator orientation="vertical" />

      <div class="flex-1 flex-x-2 justify-center">
        <!-- 统计 -->
        <div>行：</div>
        <div>当前：</div>
        <div>字数：</div>
      </div>

      <USeparator orientation="vertical" />

      <!-- Share -->
      <div class="flex-end">
        <UButton icon="tabler:share" variant="ghost" color="neutral" size="sm" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
