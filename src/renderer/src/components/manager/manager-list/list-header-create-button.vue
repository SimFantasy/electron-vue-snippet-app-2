<script lang="ts" setup name="ListSearchCreateButton">
import { useCode, useCategory } from '@/composables'

/**
 * Hooks
 */
const { createCode } = useCode()
const { currentCategoryId } = useCategory()

/**
 * Getters
 */
// 根据当前分类ID判断是否显示添加代码片段按钮
const showCreateButton = computed(() => {
  if (currentCategoryId.value === -1 || currentCategoryId.value === -2) {
    return false
  }
  return true
})

/**
 * Actions
 */
// 创建代码片段
const handleCreateCode = async () => {
  await createCode()
}
</script>

<template>
  <UTooltip text="新建代码片段" v-if="showCreateButton">
    <UButton icon="tabler:plus" variant="outline" size="sm" color="neutral" @click="handleCreateCode" />
  </UTooltip>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
