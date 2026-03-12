import type { Category } from '@shared/types'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CategoryFormType } from '@/schemas'

import { useCategoryStore, useCodeStore } from '@/stores'
import { useTag } from './use-tag'

export function useCategory() {
  /**
   * Hooks
   */
  const categoryStore = useCategoryStore()
  const codeStore = useCodeStore()

  const toast = useToast()
  const { clearTag } = useTag()

  /**
   * States
   */
  // 结构categoryStore中的状态
  const { categories, currentCategoryId, currentCategory, isLoading } = storeToRefs(categoryStore)

  // 分类表单
  const categoryForm = ref({ name: '', key: '' })
  // 当前正在更新的分类
  const updatingCategory = ref<Category | null>(null)

  // 分类弹窗状态
  const isCategoryDialogVisible = ref(false)

  /**
   * Actions
   */
  // 从分类名称生成Key
  const generateKey = (name: string) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // 处理排序后的新顺序保存
  const handleReorder = async (newOrder: Category[]) => {
    try {
      const sortedIds = newOrder.map((c) => c.id)

      await categoryStore.reorderCategories(sortedIds)
    } catch (error) {
      console.log('[Hooks] 排序保存失败:', error)
      await categoryStore.loadCategories()
    }
  }

  // 选择分类并更新代码列表
  const selectCategory = async (id: number) => {
    // 更新分类ID
    categoryStore.setCurrentCategory(id)

    // 清除标签选中
    clearTag()

    // 根据分类ID设置对应的筛选条件: 全部代码片段-99 -1 收藏夹 -2 回收站 0 未分类
    if (id === -99) {
      // 全部代码片段
      codeStore.setFilter({ categoryId: undefined, isDeleted: false, isFavorited: undefined, tag: undefined })
    } else if (id === -1) {
      // 收藏夹
      codeStore.setFilter({ categoryId: undefined, isFavorited: true, isDeleted: false, tag: undefined })
    } else if (id === -2) {
      // 回收站
      codeStore.setFilter({ categoryId: undefined, isDeleted: true, isFavorited: undefined, tag: undefined })
    } else if (id === 0) {
      // 未分类
      codeStore.setFilter({
        categoryId: 0,
        isDeleted: false,
        isFavorited: undefined,
        tag: undefined
      })
    } else {
      codeStore.setFilter({ categoryId: id, isDeleted: false, isFavorited: undefined, tag: undefined })
    }
  }

  //  打开创建分类弹窗
  const openCategoryDialog = (type: 'create' | 'update', category?: Category) => {
    if (type === 'create') {
      // 重置表单
      categoryForm.value = { name: '', key: '' }
    } else if (type === 'update' && category) {
      updatingCategory.value = category
    }
    // 打开弹窗
    isCategoryDialogVisible.value = true
  }

  //  关闭创建分类弹窗
  const closeCategoryDialog = (type: 'create' | 'update') => {
    if (type === 'create') {
      // 重置表单
      categoryForm.value = { name: '', key: '' }
    } else if (type === 'update') {
      updatingCategory.value = null
    }
    // 关闭弹窗
    isCategoryDialogVisible.value = false
  }

  // 提交创建分类表单
  const onCreateCategorySubmit = async (event: FormSubmitEvent<CategoryFormType>) => {
    const { name, key } = event.data

    // 检查名称重复
    const isDuplicate = categories.value.some((c) => c.name.toLocaleLowerCase() === name.toLocaleLowerCase())
    if (isDuplicate) {
      throw new Error('分类名称重复')
    }

    // 检查key是否重复
    const isKeyDuplicate = categories.value.some((c) => c.key.toLocaleLowerCase() === key.toLocaleLowerCase())
    if (isKeyDuplicate) {
      throw new Error('分类标识重复')
    }

    try {
      // 创建分类
      const id = await categoryStore.createCategory(name, key)

      if (id) {
        // 关闭弹窗
        closeCategoryDialog('create')
        // 选择分类
        selectCategory(id)
        // 提示创建成功
        toast.add({
          title: '创建分类成功',
          color: 'success'
        })
      }
    } catch (error) {
      console.log('[Hooks] 创建分类失败:', error)
      toast.add({
        title: '创建分类失败',
        color: 'error'
      })

      throw error
    }
  }

  // 提交更新分类表单
  const onUpdateCategorySubmit = async (event: FormSubmitEvent<CategoryFormType>) => {
    if (!updatingCategory.value) return

    const { name, key } = event.data

    // 检查名称是否重复（排除当前分类）
    const isDuplicate = categories.value.some(
      (c) => c.id !== updatingCategory.value!.id && c.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    )
    if (isDuplicate) {
      throw new Error('分类名称已存在')
    }

    // 检查key是否重复（排除当前分类）
    const isKeyDuplicate = categories.value.some(
      (c) => c.id !== updatingCategory.value!.id && c.key.toLocaleLowerCase() === key.toLocaleLowerCase()
    )
    if (isKeyDuplicate) {
      throw new Error('分类标识已存在')
    }

    try {
      // 更新分类
      const id = await categoryStore.updateCategory(updatingCategory.value!.id, {
        name,
        key
      })

      if (id) {
        // 关闭弹窗
        closeCategoryDialog('update')
        // 提示
        toast.add({
          title: '更新分类成功',
          color: 'success'
        })
      }
    } catch (error) {
      console.log('[Hooks] 更新分类失败:', error)
      toast.add({
        title: '更新分类失败',
        color: 'error'
      })

      throw error
    }
  }

  // 删除分类
  const removeCategory = async (id: number): Promise<boolean> => {
    try {
      // 检查分类下是否有代码片段
      const hasCodes = codeStore.codes.filter((c) => c.category_id === id && !c.is_deleted)

      // 将分类下的代码片段全部转到未分类
      if (hasCodes.length > 0) {
        const codeIds = hasCodes.map((code) => code.id)
        await codeStore.batchUpdateCategory(codeIds, 0)
      }

      // 删除分类
      await categoryStore.removeCategory(id)
      // 如果是删除当前选中的分类，则切换到未分类
      if (currentCategoryId.value === id) {
        selectCategory(0)
      }

      // 提示删除成功
      toast.add({
        title: '删除分类成功',
        color: 'success'
      })

      return true
    } catch (error) {
      console.log('[Hooks] 删除分类失败:', error)
      toast.add({
        title: '删除分类失败',
        color: 'error'
      })

      return false
    }
  }

  return {
    // States
    categoryForm,
    isCategoryDialogVisible,
    updatingCategory,

    // Getters
    categories,
    currentCategoryId,
    currentCategory,
    isLoading,

    // Actions
    generateKey,
    handleReorder,
    selectCategory,
    openCategoryDialog,
    closeCategoryDialog,
    onCreateCategorySubmit,
    onUpdateCategorySubmit,
    removeCategory
  }
}
