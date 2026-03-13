import type { CreateCodeInput, QueryOptions, UpdateCodeInput } from '@shared/types'

import { useDebounceFn } from '@vueuse/core'
import { useCategoryStore, useCodeStore, useTagStore } from '@/stores'

export function useCode() {
  /**
   * Hooks
   */
  const categoryStore = useCategoryStore()
  const codeStore = useCodeStore()
  const tagStore = useTagStore()
  const toast = useToast()

  /**
   * States
   */
  // 结构CodeStore中的状态
  const {
    codes,
    allCodes,
    allCodesCount,
    currentCodeId,
    currentCode,
    pagination,
    isLoading,
    filter,
    trashCodes,
    favoriteCodes,
    uncategorizedCodes
  } = storeToRefs(codeStore)
  const { currentCategoryId } = storeToRefs(categoryStore)

  // 搜索关键字
  const searchKeyword = ref('')
  // 是否正在保存
  const isSaving = ref(false)

  /**
   * Actions
   */

  // 加载全部代码片段（用于统计）
  const loadAllCodes = async () => {
    await codeStore.loadAllCodes()
  }

  // 加载更多
  const loadMore = async () => {
    await codeStore.loadMoreCodes()
  }

  // 加载代码片段列表
  const loadCodes = async (reset = true) => {
    const options: QueryOptions = {}
    // 如果有搜索关键字，则添加到查询条件中
    if (searchKeyword.value.trim()) {
      options.search = searchKeyword.value.trim()
    }
    // 加载代码片段列表
    await codeStore.loadCodes(options, reset)
  }

  // 搜索代码
  const searchCodes = async (keyword: string) => {
    searchKeyword.value = keyword
    await loadCodes(true)
  }

  // 清空搜索关键字
  const clearSearch = () => {
    searchKeyword.value = ''
    loadCodes(true)
  }

  // 选择代码片段（显示详情）
  const selectCode = (id: number | null) => {
    codeStore.setCurrentCode(id)
  }

  // 实时保存（防抖）
  const debouncedSave = useDebounceFn(async (id: number, data: UpdateCodeInput) => {
    isSaving.value = true
    try {
      await codeStore.updateCode(id, data)
    } catch (error) {
      console.log('[Hooks] 自动保存失败:', error)

      toast.add({
        title: '自动保存失败',
        description: JSON.stringify((error as Error).message),
        color: 'error'
      })
    } finally {
      isSaving.value = false
    }
  }, 500)

  // 更新代码片段
  const updateCode = async (id: number, data: UpdateCodeInput) => {
    // 立即更新本地数据（乐观更新）
    const index = codes.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      Object.assign(codes.value[index], data)
    }

    // 防抖保存到后端
    await debouncedSave(id, data)
  }

  // 更细标题
  const updateTitle = async (id: number, title: string) => {
    await updateCode(id, { title })
  }

  // 更新分类
  const updateCategory = async (id: number, categoryId: number) => {
    await updateCode(id, { category_id: categoryId })
  }

  // 更新标签
  const updateTags = async (id: number, tags: string[]) => {
    console.log('updateTags called:', id, tags) // 添加日志
    await updateCode(id, { tags })
    // 刷新标签列表
    await tagStore.refreshTags()

    console.log('#### updateTags called:', id, tags) // 添加日志
  }

  // 更新代码片段内容
  const updateContent = async (id: number, content: string) => {
    await updateCode(id, { content })
  }

  // 更新代码语言
  const updateLanguage = async (id: number, language: string) => {
    await updateCode(id, { language })
  }

  // 创建代码片段
  const createCode = async (): Promise<number | null> => {
    try {
      // 根据当前选中的导航分类确定分类ID
      let categoryId: number
      const currentId = currentCategoryId.value

      if (currentId > 0) {
        // 选中了具体分类，使用当前分类
        categoryId = currentId
      } else {
        // 其他快捷导航（-99 全部代码片段，0 未分类， -1 收藏夹 -2 回收站），默认创建到未分类
        categoryId = 0
      }

      const data: CreateCodeInput = {
        title: '未命名代码片段',
        content: '',
        category_id: categoryId,
        language: 'javascript',
        tags: []
      }

      const id = await codeStore.createCode(data)

      if (id) {
        // 选中新创建的代码片段
        selectCode(id)
      }

      return id
    } catch (error) {
      console.log('[Hooks] 创建代码片段失败:', error)

      toast.add({
        title: '创建代码片段失败',
        description: JSON.stringify((error as Error).message),
        color: 'error'
      })

      return null
    }
  }

  // 删除代码片段
  const removeCode = async (id: number): Promise<boolean> => {
    try {
      const code = allCodes.value.find((c) => c.id === id)

      if (code?.is_deleted) {
        // 在回收站，硬删除
        await codeStore.removeCode(id, false)

        toast.add({
          title: '删除代码片段成功',
          color: 'success'
        })
      } else {
        // 软删除
        await codeStore.removeCode(id, true)

        // 如果删除的是当前选中的，清空选中
        if (currentCodeId.value === id) {
          selectCode(null)
        }

        toast.add({
          title: '已移入回收站',
          color: 'success'
        })
      }

      return true
    } catch (error) {
      console.log('[Hooks] 删除失败:', error)
      toast.add({
        title: '删除失败',
        description: JSON.stringify((error as Error).message),
        color: 'error'
      })
      return false
    }
  }

  // 恢复代码片段（软删除恢复）
  const restoreCode = async (id: number): Promise<boolean> => {
    try {
      // 恢复
      await codeStore.restoreCode(id)

      toast.add({
        title: '恢复成功',
        color: 'success'
      })

      return true
    } catch (error) {
      console.log('[Hooks] 恢复失败:', error)
      toast.add({
        title: '恢复失败',
        description: JSON.stringify((error as Error).message),
        color: 'error'
      })
      return false
    }
  }

  // 清空回收站
  const clearTrash = async (): Promise<number> => {
    try {
      // 清空回收站
      const count = await codeStore.clearTrash()

      toast.add({
        title: `已清除回收站中 ${count} 个代码片段`,
        color: 'success'
      })

      return count
    } catch (error) {
      console.log('[Hooks] 清空回收站失败:', error)
      toast.add({
        title: '清空回收站失败',
        description: JSON.stringify((error as Error).message),
        color: 'error'
      })
      return 0
    }
  }

  // 切换收藏状态
  const toggleFavorite = async (id: number): Promise<boolean> => {
    try {
      // 切换收藏
      const result = await codeStore.toggleFavorite(id)

      toast.add({
        title: result ? '收藏成功' : '取消收藏成功',
        color: 'success'
      })

      return result
    } catch (error) {
      console.log('[Hooks] 收藏操作失败:', error)

      toast.add({
        title: '收藏操作失败',
        description: JSON.stringify((error as Error).message),
        color: 'error'
      })

      return false
    }
  }

  // 批量修改分类
  const batchUpdateCategories = async (ids: number | number[], categoryId: number): Promise<boolean> => {
    try {
      const codeIds = Array.isArray(ids) ? ids : [ids]

      // 批量修改分类
      await codeStore.batchUpdateCategory(codeIds, categoryId)

      toast.add({
        title: '批量修改分类成功',
        color: 'success'
      })

      return true
    } catch (error) {
      console.log('[Hooks] 修改分类失败:', error)

      toast.add({
        title: '修改分类失败',
        description: JSON.stringify((error as Error).message),
        color: 'error'
      })

      return false
    }
  }

  return {
    // States
    searchKeyword,
    isSaving,

    // Getters
    codes,
    allCodes,
    allCodesCount,
    currentCodeId,
    currentCode,
    pagination,
    isLoading,
    filter,
    trashCodes,
    favoriteCodes,
    uncategorizedCodes,

    // Actions
    loadAllCodes,
    loadMore,
    loadCodes,
    searchCodes,
    clearSearch,
    selectCode,
    updateTitle,
    updateCategory,
    updateTags,
    updateContent,
    updateLanguage,
    createCode,
    removeCode,
    restoreCode,
    clearTrash,
    toggleFavorite,
    batchUpdateCategories
  }
}
