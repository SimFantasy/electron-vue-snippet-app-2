<script lang="ts" setup name="ConfirmDialog">
/**
 * Defines
 */

// Props
const {
  hasCancelButton = true,
  hasConfirmButton = true,
  confirmText = '确定',
  cancelText = '取消'
} = defineProps<{
  title: string
  content: string
  hasCancelButton?: boolean
  hasConfirmButton?: boolean
  confirmText?: string
  cancelText?: string
}>()

// Emits
const emit = defineEmits<{
  onConfrim: []
  onCancel: []
}>()

/**
 * States
 */
// 弹窗显示状态
const dialogVisible = ref(false)

/**
 * Actions
 */
// 显示弹窗
const openDialog = () => {
  dialogVisible.value = true
}

// 关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false
}

// 确认
const handleConfirm = () => {
  emit('onConfrim')
  closeDialog()
}

// 取消
const handleCancel = () => {
  emit('onCancel')
  closeDialog()
}

/**
 * Exposes
 */
defineExpose({
  visible: dialogVisible,
  open: openDialog,
  close: closeDialog,
  onConfirm: handleConfirm,
  conCancel: handleCancel
})
</script>

<template>
  <UModal
    v-model:open="dialogVisible"
    :title="title"
    :close="{
      color: 'neutral',
      variant: 'ghost'
    }"
    :description="content"
    :modal="false"
  >
    <template #body>
      <div class="py-4 text-sm text-(--layout-text-primary)">{{ content }}</div>
    </template>

    <template v-if="hasConfirmButton || hasCancelButton" #footer>
      <div class="flex-end gap-2 w-full">
        <UButton v-if="hasCancelButton" :label="cancelText" variant="subtle" color="neutral" @click="handleCancel" />
        <UButton v-if="hasConfirmButton" :label="confirmText" @click="handleConfirm" />
      </div>
    </template>
  </UModal>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
