import { useAsyncState } from '@vueuse/core'

export const useTagStore = defineStore('tag', () => {
  /**
   * States
   */
  // 所有标签列表
  const tags = ref<string[]>([])

  /**
   * Getters
   */
  // 获取标签总数
  const tagCount = computed(() => tags.value.length)

  /**
   * Actions
   */
  // 加载所有标签
  const { isLoading, execute: loadTags } = useAsyncState(() => window.api.code.getTags(), [], {
    immediate: false,
    onSuccess: (res) => {
      if (res) {
        tags.value = res
      }
    }
  })

  // 刷新标签列表
  const refreshTags = async () => {
    await loadTags()
  }

  return {
    // States
    tags,
    isLoading,
    // Getters
    tagCount,
    // Actions
    loadTags,
    refreshTags
  }
})
