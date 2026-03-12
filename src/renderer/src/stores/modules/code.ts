import type { Code, CreateCodeInput, UpdateCodeInput, QueryOptions } from '@shared/types'

export const useCodeStore = defineStore('code', () => {
  /**
   * States
   */
  // 代码片段列表（当前筛选条件下，用于展示）
  const codes = ref<Code[]>([])

  // 全部代码片段（用于统计计算，不随筛选变化）
  const allCodes = ref<Code[]>([])

  // 当前选中的代码片段ID
  const currentCodeId = ref<number | null>(null)

  // 分页信息
  const pagination = ref({
    page: 1,
    pageSize: 20,
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
  // 全部代码总数（基于 allCodes，不随筛选变化）
  const allCodesCount = computed(() => allCodes.value.filter((c) => !c.is_deleted).length)

  // 回收站代码片段（基于 allCodes）
  const trashCodes = computed(() => allCodes.value.filter((c) => c.is_deleted))

  // 收藏夹代码片段（基于 allCodes）
  const favoriteCodes = computed(() => allCodes.value.filter((c) => c.is_favorited && !c.is_deleted))

  // 未分类代码片段（基于 allCodes）
  const uncategorizedCodes = computed(() => allCodes.value.filter((c) => c.category_id === 0 && !c.is_deleted))

  // 获取当前选中的代码片段
  const currentCode = computed(() => {
    if (!currentCodeId.value) return null
    return codes.value.find((c) => c.id === currentCodeId.value)
  })

  /**
   * Actions
   */

  // 加载全部代码片段（用于统计）
  const loadAllCodes = async (): Promise<void> => {
    try {
      // 获取全部代码片段，用于统计计算
      const result = await window.api.code.getCodes({
        limit: 10000, // 获取足够多的数据
        isDeleted: undefined
      })
      allCodes.value = result
    } catch (error) {
      console.log('[Store] 获取全部代码片段失败:', error)
    }
  }

  let currentLoadId = 0 // 加载 ID 计数器
  let loadCodesLock = false // 保留锁防止翻页并发
  // 加载代码片段
  const loadCodes = async (options: QueryOptions = {}, reset = false): Promise<void> => {
    // 生成新的加载 ID
    const loadId = ++currentLoadId

    // 如果是重置操作，立即重置状态
    if (reset) {
      pagination.value.page = 1
      pagination.value.hasMore = true
      codes.value = []
    }

    // 只有翻页操作需要锁检查
    if (!reset && loadCodesLock) {
      return
    }

    if (!reset) {
      loadCodesLock = true
    }

    try {
      isLoading.value = true

      // 如果有标签筛选条件
      if (filter.value.tag) {
        const result = await window.api.code.getCodesByTag(filter.value.tag)

        // 检查是否过期
        if (loadId !== currentLoadId) {
          return
        }

        codes.value = result
        pagination.value.hasMore = false
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

      // 关键：检查是否过期，只有最新的加载才能更新数据
      if (loadId !== currentLoadId) {
        return
      }

      // 更新数据
      if (reset) {
        codes.value = result
      } else {
        codes.value.push(...result)
      }

      // 判断是否还有更多
      pagination.value.hasMore = result.length === pagination.value.pageSize

      // 增加页码（只有成功的最新加载才能增加）
      if (result.length > 0) {
        pagination.value.page++
      }
    } catch (error) {
      console.log('[Store] 获取代码片段列表数据失败:', error)
    } finally {
      if (!reset) {
        loadCodesLock = false
      }
      isLoading.value = false
    }
  }

  // 加载更多代码片段
  const loadMoreCodes = async () => {
    if (loadCodesLock || !pagination.value.hasMore) return
    await loadCodes({}, false)
  }

  // 创建代码片段
  const createCode = async (data: CreateCodeInput): Promise<number> => {
    const id = await window.api.code.create(data)

    // 同步更新allCodes统计
    const newCode = await window.api.code.getCodeById(id)
    if (newCode) {
      allCodes.value.unshift(newCode)
    }

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

    // 更新本地数据（codes）
    const index = codes.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      const updateCode: Partial<Code> = {
        ...data,
        tags: data.tags && Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags
      }
      codes.value[index] = { ...codes.value[index], ...updateCode }
    }

    // 同步更新 allCodes
    const allIndex = allCodes.value.findIndex((c) => c.id === id)
    if (allIndex !== -1) {
      const updateCode: Partial<Code> = {
        ...data,
        tags: data.tags && Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags
      }
      allCodes.value[allIndex] = { ...allCodes.value[allIndex], ...updateCode }
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

    // 从本地列表中移除（codes）
    codes.value = codes.value.filter((c) => c.id !== id)

    // 同步更新 allCodes
    const index = allCodes.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      if (isSoft) {
        // 软删除：标记为已删除
        allCodes.value[index].is_deleted = true
      } else {
        // 硬删除：从数组中移除
        allCodes.value.splice(index, 1)
      }
    }

    // 如果删除的是当前选中的，则清空当前选中的
    if (currentCodeId.value === id) {
      currentCodeId.value = null
    }
  }

  // 从回收站中恢复
  const restoreCode = async (id: number) => {
    await window.api.code.restore(id)

    // 从本地列表中删除，此时在回收站中，从回收站代码片段列表中移除（codes）
    codes.value = codes.value.filter((c) => c.id !== id)

    // 同步更新 allCodes
    const index = allCodes.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      allCodes.value[index].is_deleted = false
    }
  }

  // 清空回收站
  const clearTrash = async () => {
    const count = await window.api.code.clearTrash()

    // 清空本地回收站列表（codes）
    if (filter.value.isDeleted) {
      codes.value = []
      pagination.value.hasMore = false
    }

    // 同步更新 allCodes，移除所有已删除的代码片段
    allCodes.value = allCodes.value.filter((c) => !c.is_deleted)

    return count
  }

  // 切换代码片段收藏状态
  const toggleFavorite = async (id: number): Promise<boolean> => {
    const result = await window.api.code.toggleFavorite(id)

    // 更新本地数据（codes）
    const code = codes.value.find((c) => c.id === id)
    if (code) {
      code.is_favorited = result
    }

    // 同步更新 allCodes
    const allCode = allCodes.value.find((c) => c.id === id)
    if (allCode) {
      allCode.is_favorited = result
    }

    return result
  }

  // 批量修改代码片段分类
  const batchUpdateCategory = async (codeIds: number[], categoryId: number) => {
    await window.api.code.batchUpdateCategory(codeIds, categoryId)

    // 更新本地数据（codes）
    codes.value = codes.value.map((code) => {
      if (codeIds.includes(code.id)) {
        return { ...code, category_id: categoryId }
      }
      return code
    })

    // 同步更新 allCodes
    allCodes.value = allCodes.value.map((code) => {
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
    allCodes,
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
    loadAllCodes,
    loadCodes,
    loadMoreCodes,
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
