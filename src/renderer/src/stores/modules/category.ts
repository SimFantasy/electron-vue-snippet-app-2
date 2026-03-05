import { Category, CreateCategoryInput, UpdateCategoryInput } from '@shared/types'
import { useAsyncState } from '@vueuse/core'

export const useCategoryStore = defineStore('category', () => {
  /**
   * States
   */
  // 所有分类
  const categories = ref<Category[]>([])
  // 当前选中分类ID
  const currentCategoryId = ref<number>(0)

  /**
   * Getters
   */
  // 获取当前选中分类信息
  const currentCategory = computed<Category | undefined>(() => categories.value.find((c) => c.id === currentCategoryId.value))

  // 获取分类总数
  const categoryCount = computed(() => categories.value.length)

  /**
   * Actions
   */

  // 加载分类
  const { isLoading, execute: loadCategories } = useAsyncState(() => window.api.category.getCategories(), [], {
    immediate: true,
    onSuccess: (res) => {
      if (res) {
        categories.value = res
      }
    }
  })

  // 创建分类
  const createCategory = async (name: string, key: string = ''): Promise<number> => {
    const data: CreateCategoryInput = {
      name: name.trim(),
      key: key.trim(),
      sort_order: categories.value.length
    }

    // 创建分类
    const id = await window.api.category.create(data)

    // 重新加载分类
    await loadCategories()

    return id
  }

  // 更新分类
  const updateCategory = async (id: number, data: UpdateCategoryInput): Promise<number> => {
    // 更新分类
    const categoryId = await window.api.category.update(id, data)
    // 重新加载分类
    await loadCategories()

    return categoryId
  }

  // 删除分类
  const removeCategory = async (id: number): Promise<number> => {
    // 删除分类
    const categoryId = await window.api.category.remove(id)
    // 重新加载分类
    await loadCategories()

    return categoryId
  }

  // 重新排序分类
  const reorderCategories = async (sortedIds: number[]): Promise<void> => {
    // 重新排序分类
    console.log('[Store] 调用 API 更新排序:', sortedIds)
    await window.api.category.updateSortOrder(sortedIds)
    console.log('[Store] API 调用成功')
    // 重新加载分类
    await loadCategories()
  }

  // 设置当前选中分类
  const setCurrentCategory = (id: number) => {
    currentCategoryId.value = id
  }

  return {
    // States
    categories,
    currentCategoryId,
    isLoading,
    // Getters
    currentCategory,
    categoryCount,
    // Actions
    loadCategories,
    createCategory,
    updateCategory,
    removeCategory,
    reorderCategories,
    setCurrentCategory
  }
})
