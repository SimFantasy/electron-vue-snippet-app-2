import type { Category } from '@shared/types'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CategoryFormType } from '@/schemas'

import { useSortable } from '@vueuse/integrations/useSortable'
import { useCategoryStore, useCodeStore } from '@/stores'

export function useCategory() {
  /**
   * Hooks
   */
  const categoryStore = useCategoryStore()
  const codeStore = useCodeStore()
  const toast = useToast()

  /**
   * States
   */
  // 拖拽排序的容器元素引用
  const sortableCointainerRef = useTemplateRef<HTMLElement | null>('sortableCointainer')
  // 是否正在拖拽排序
  const isSorting = ref(false)
  // 分类表单
  const categoryForm = ref({ name: '', key: '' })
  // 当前正在更新的分类
  const updatingCategory = ref<Category | null>(null)

  // 分类弹窗状态
  const isCategoryDialogVisible = ref(false)

  /**
   * Getters
   */
  // 所有分类
  const categories = computed(() => categoryStore.categories)
  // 当前选中的分类ID
  const currentCategoryId = computed(() => categoryStore.currentCategoryId)
  // 当前选中的分类
  const currentCategory = computed(() => categoryStore.currentCategory)
  // 是否正在加载
  const isLoading = computed(() => categoryStore.isLoading)

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
  const handleReorder = async () => {
    try {
      // 提取当前分类列表的顺序ID
      const sortedIds = categories.value.map((c) => c.id)

      // 保存到后端
      await categoryStore.reorderCategories(sortedIds)
    } catch (error) {
      console.log('[Hooks] 排序保存失败:', error)
      // 重新加载分类列表，恢复原始顺序
      await categoryStore.loadCategories()
    }
  }

  // 初始化排序
  const initSortable = () => {
    // 检查元素是否存在，不存在直接返回
    if (!sortableCointainerRef.value) return

    // 使用useSortable初始化拖拽排序
    const { option } = useSortable(sortableCointainerRef, categories)
    option('animation', 150)
    option('handle', '.sortable-handle')
    option('ghostClass', 'sortable-ghost')
    option('onStart', () => (isSorting.value = true))
    option('onEnd', (evt) => {
      // 结束拖拽排序
      isSorting.value = false
      // 只有顺序发生变化才重新加载分类列表
      if (evt.oldIndex !== evt.newIndex) {
        handleReorder()
      }
    })
  }

  // 选择分类并更新代码列表
  const selectCategory = async (id: number) => {
    // 更新分类ID
    categoryStore.setCurrentCategory(id)

    // 根据分类ID设置对应的筛选条件: 全部代码片段-99 -1 收藏夹 -2 回收站 0 未分类
    if (id === -99) {
      codeStore.setFilter({ isDeleted: false, isFavorited: undefined, tag: undefined })
    } else if (id === -1) {
      codeStore.setFilter({ isFavorited: true, isDeleted: false, tag: undefined })
    } else if (id === -2) {
      codeStore.setFilter({ isDeleted: true, tag: undefined })
    } else {
      codeStore.setFilter({
        categoryId: id === 0 ? undefined : id,
        isDeleted: false,
        isFavorited: undefined,
        tag: undefined
      })
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
    initSortable,
    selectCategory,
    openCategoryDialog,
    closeCategoryDialog,
    onCreateCategorySubmit,
    onUpdateCategorySubmit,
    removeCategory
  }
}
