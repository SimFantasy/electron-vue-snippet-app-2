<script lang="ts" setup name="CategoryNavMutationDialog">
import type { Category } from '@shared/types'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CategoryFormType } from '@/schemas'

import { categorySchema as schema } from '@/schemas'
import { useCategory } from '@/composables'

/**
 * Defines
 */
// Props
const { category } = defineProps<{
  category?: Category | null
}>()

// Models
const visiable = defineModel<boolean>('open')

// Emits
const emit = defineEmits<{
  onCreate: [event: FormSubmitEvent<CategoryFormType>]
  onUpdate: [event: FormSubmitEvent<CategoryFormType>]
}>()

/**
 * Hooks
 */
const { generateKey } = useCategory()

/**
 * States
 */
const UModal = resolveComponent('UModal')

// 表单数据
const formData = ref<Partial<CategoryFormType>>({
  name: '',
  key: ''
})

/**
 * Getters
 */
// 是否编辑模式
const isUpdateMode = computed(() => !!category)

/**
 * Actions
 */
const handleSubmit = async (event: FormSubmitEvent<CategoryFormType>) => {
  if (isUpdateMode.value) {
    emit('onUpdate', event)
  } else {
    emit('onCreate', event)
  }
}

// 打开弹窗
const handleOpenDialog = () => {
  visiable.value = true
}

// 关闭弹窗
const handleCloseDialog = () => {
  visiable.value = false
}

/**
 * Watchers
 */
// 监听弹窗打卡状态，初始化表单数据
watch(
  () => [visiable.value, category],
  ([isVisable, category]) => {
    if (isVisable) {
      if (category) {
        formData.value.name = (category as Category).name
        formData.value.key = (category as Category).key
      }
    }
  }
)

// 监听名称变化，自动更新key
watch(
  () => formData.value.name,
  (newName) => {
    if (!isUpdateMode.value && newName) {
      formData.value.key = generateKey(newName)
    }
  }
)

/**
 * Exposes
 */
defineExpose({
  open: handleOpenDialog,
  close: handleCloseDialog
})
</script>

<template>
  <UModal
    v-model:open="visiable"
    :title="isUpdateMode ? '更新分类' : '新建分类'"
    description="请填写分类名称和标识，用于搜索分类关键字，快速查询分类下数据。"
    :modal="false"
  >
    <template #body>
      <UForm ref="form" :schema="schema" :state="formData" @submit="handleSubmit">
        <UFormField label="分类名称" name="name">
          <UInput v-model="formData.name" placeholder="请输入分类名称" class="w-full" />
        </UFormField>

        <UFormField label="分类标识" name="key" description="用于搜索分类关键字，快速查询分类下数据，默认根据分类名称自动生成">
          <UInput v-model="formData.key" placeholder="自动生成分类标识" class="w-full" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex-end gap-2 w-full">
        <UButton label="取消" @click="handleCloseDialog" />
        <UButton type="submit" :label="isUpdateMode ? '更新' : '提交'" />
      </div>
    </template>
  </UModal>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
