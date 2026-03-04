import { useTagStore, useCodeStore } from '@/stores'

export function useTag() {
  /**
   * Hooks
   */
  const tagStore = useTagStore()
  const codeStore = useCodeStore()

  /**
   * States
   */
  // 当前选中的标签
  const currentTag = ref('')

  /**
   * Getters
   */
  // 获取所有标签，并按字母排序
  const tags = computed(() => [...tagStore.tags].sort((a, b) => a.localeCompare(b, 'zh-CN')))

  // 标签的总数
  const tagCount = computed(() => tagStore.tagCount)

  // 当前是否有窜中的标签
  const hasSelectedTag = computed(() => currentTag.value !== null)

  /**
   * Actions
   */

  // 加载所有标签
  const loadTags = async () => {
    await tagStore.loadTags()
  }

  // 筛选标签列表
  const refreshTags = async () => {
    await tagStore.refreshTags()
  }

  // 清除标签选择
  const clearTag = async () => {
    // 清空当前选中的标签
    currentTag.value = ''

    // 清除codeStore中的标签筛选条件
    codeStore.setFilter({ tag: undefined })
  }

  // 选择标签并筛选代码片段
  const selectTag = async (tag: string) => {
    // 如果点击的是已选中的标签，则取消选择
    if (currentTag.value === tag) {
      await clearTag()
      return
    }

    // 设置当前选中的标签
    currentTag.value = tag

    // 清空分类相关的筛选状态
    codeStore.clearCategoryFilter()

    // 在codeStore中设置标签筛选条件并重新加载代码片段
    codeStore.setFilter({ tag })
  }

  // 根据标签获取代码片段数量
  const getCodeCountByTag = (tag: string) => {
    // 从codeStore中统计包含改标签的代码片段数量
    return codeStore.codes.filter((code) => {
      try {
        const codeTags = JSON.parse(code.tags || '[]')
        return codeTags.includes(tag)
      } catch (error) {
        return false
      }
    }).length
  }

  return {
    // States
    currentTag,

    // Getters
    tags,
    tagCount,
    hasSelectedTag,

    // Actions
    loadTags,
    refreshTags,
    clearTag,
    selectTag,
    getCodeCountByTag
  }
}
