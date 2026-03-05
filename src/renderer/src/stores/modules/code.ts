import type { Code, CreateCodeInput, UpdateCodeInput, QueryOptions } from '@shared/types'

export const useCodeStore = defineStore('code', () => {
  /**
   * States
   */
  // 代码片段列表
  const codes = ref<Code[]>([])

  // 全部代码总数（不随筛选变化）
  const allCodesCount = ref(0)

  // 当前选中的代码片段ID
  const currentCodeId = ref<number | null>(null)

  // 分页信息
  const pagination = ref({
    page: 1,
    pageSize: 50,
    total: 0,
    hasMore: true
  })

  // 加载状态
  const isLoading = ref(false)

  //  当前筛选条件
  const filter = ref({
    categoryId: undefined as number | undefined,
    isDeleted: false,
    isFavorited: undefined as boolean | undefined,
    tag: undefined as string | undefined
  })

  /**
   * Getters
   */
  // 获取当前选中的代码片段
  const currentCode = computed(() => {
    if (!currentCodeId.value) return null

    return codes.value.find((c) => c.id === currentCodeId.value)
  })

  // 获取回收站中的代码片段
  const trashCodes = computed(() => codes.value.filter((c) => c.is_deleted))

  // 获取收藏夹中的代码片段
  const favoriteCodes = computed(() => codes.value.filter((c) => c.is_favorited && !c.is_deleted))

  // 获取未分类的代码片段
  const uncategorizedCodes = computed(() => codes.value.filter((c) => c.category_id === 0 && !c.is_deleted))

  /**
   * Actions
   */

  // 加载代码片段
  const loadCodes = async (options: QueryOptions = {}, reset = false): Promise<void> => {
    isLoading.value = true

    try {
      // 如果是重置则清空列表和分页
      if (reset) {
        codes.value = []
        pagination.value.page = 1
        pagination.value.hasMore = true
      }

      // 如果有标签筛选条件，使用专门的标签查询API
      if (filter.value.tag) {
        // 根据标签获取代码片段列表
        const result = await window.api.code.getCodesByTag(filter.value.tag)

        // 标签查询结果直接赋值
        codes.value = result
        pagination.value.hasMore = false
        isLoading.value = false
        return
      }

      // 查询参数
      const queryOptions: QueryOptions = {
        ...options,
        limit: pagination.value.pageSize,
        offset: (pagination.value.page - 1) * pagination.value.pageSize,
        orderBy: 'updated_at',
        order: 'desc',
        ...filter.value
      }

      // 查询代码片段列表
      const result = await window.api.code.getCodes(queryOptions)

      // 合并数据
      if (reset) {
        codes.value = result
      } else {
        codes.value.push(...result)
      }

      // 更新全部代码片段总数
      if (reset && !filter.value.tag && !filter.value.isDeleted && !filter.value.isFavorited && !filter.value.categoryId) {
        allCodesCount.value = result.length
      }

      // 判断是否还有更多
      pagination.value.hasMore = result.length === pagination.value.pageSize

      // 增加页码，
      if (result.length > 0) {
        pagination.value.page++
      }
    } catch (error) {
      console.log('[Store] 获取代码片段列表数据失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 获取全部代码片段总数
  const getAllCodesCount = async () => {
    try {
      const result = await window.api.code.getCodes({
        isDeleted: false,
        limit: 10000 //获取最多的数据
      })
      allCodesCount.value = result.length
    } catch (error) {
      console.log('[Store] 获取全部代码片段数量失败:', error)
    }
  }

  // 加载更多代码片段
  const loadMoreCodes = async () => {
    if (!pagination.value.hasMore || isLoading.value) return
    await loadCodes({}, false)
  }

  // 创建代码片段
  const createCode = async (data: CreateCodeInput): Promise<number> => {
    const id = await window.api.code.create(data)

    // 创建成功后，如果是创建在当前筛选分类下，刷新列表
    if (!filter.value.categoryId || filter.value.categoryId === data.category_id) {
      await loadCodes({ categoryId: data.category_id }, true)
    }

    // 设置创建的新代码为当前选中
    currentCodeId.value = id

    return id
  }

  // 更新代码片段
  const updateCode = async (id: number, data: UpdateCodeInput) => {
    await window.api.code.update(id, data)

    // 更新本地数据
    const index = codes.value.findIndex((c) => c.id === id)

    if (index !== -1) {
      const updateCode: Partial<Code> = {
        ...data,
        tags: data.tags && Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags
      }

      codes.value[index] = { ...codes.value[index], ...updateCode }
    }
  }

  // 删除代码片段
  const removeCode = async (id: number, isSoft = true) => {
    // 如果是软删除，则只移动到回收站，否则彻底删除
    if (isSoft) {
      await window.api.code.softRemove(id)
    } else {
      await window.api.code.remove(id)
    }

    // 从本地列表中移除
    codes.value = codes.value.filter((c) => c.id !== id)

    // 如果删除的是当前选中的，则清空当前选中的
    if (currentCodeId.value === id) {
      currentCodeId.value = null
    }
  }

  // 从回收站中恢复
  const restoreCode = async (id: number) => {
    await window.api.code.restore(id)

    // 从本地列表中删除，此时在回收站中，从回收站代码片段列表中移除
    codes.value = codes.value.filter((c) => c.id !== id)
  }

  // 清空回收站
  const clearTrash = async () => {
    const count = await window.api.code.clearTrash()

    // 清空本地回收站列表
    if (filter.value.isDeleted) {
      codes.value = []
      pagination.value.hasMore = false
    }

    return count
  }

  // 切换代码片段收藏状态
  const toggleFavorite = async (id: number): Promise<boolean> => {
    const result = await window.api.code.toggleFavorite(id)

    // 更新本地数据
    const code = codes.value.find((c) => c.id === id)
    if (code) {
      code.is_favorited = result
    }

    return result
  }

  // 批量修改代码片段分类
  const batchUpdateCategory = async (codeIds: number[], categoryId: number) => {
    await window.api.code.batchUpdateCategory(codeIds, categoryId)

    // 更新本地数据
    codes.value = codes.value.map((code) => {
      if (codeIds.includes(code.id)) {
        return { ...code, category_id: categoryId }
      }
      return code
    })
  }

  // 设置当前选中的代码片段
  const setCurrentCode = (id: number | null) => {
    currentCodeId.value = id
  }

  // 设置筛选条件
  const setFilter = (newFiler: Partial<typeof filter.value>) => {
    filter.value = { ...filter.value, ...newFiler }
    // 重新加载代码片段列表
    loadCodes({}, true)
  }

  // 清空分类筛选
  const clearCategoryFilter = () => {
    filter.value.categoryId = undefined
    filter.value.isFavorited = undefined
  }

  // 清空标签筛选
  const clearTagFilter = () => {
    filter.value.tag = undefined
  }

  return {
    // States
    codes,
    allCodesCount,
    currentCodeId,
    pagination,
    isLoading,
    filter,

    // Getters
    currentCode,
    trashCodes,
    favoriteCodes,
    uncategorizedCodes,

    // Actions
    loadCodes,
    loadMoreCodes,
    getAllCodesCount,
    createCode,
    updateCode,
    removeCode,
    restoreCode,
    clearTrash,
    toggleFavorite,
    batchUpdateCategory,
    setCurrentCode,
    setFilter,
    clearCategoryFilter,
    clearTagFilter
  }
})
