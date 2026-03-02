import type { Code, QueryOptions } from '@shared/types'

export const useSearchStore = defineStore('search', () => {
  /**
   * States
   */
  // 搜索关键字
  const keyword = ref('')
  // 搜索结果
  const results = ref<Code[]>([])
  // 当前搜索结果的索引
  const selectedIndex = ref<number>(0)
  // 是否正在搜索
  const isSearching = ref(false)

  /**
   * Getters
   */
  // 当前选中的代码片段
  const selectedCode = computed(() => results.value[selectedIndex.value])
  // 是否有搜索结果
  const hasResults = computed(() => results.value.length > 0)
  // 搜索结果总数
  const totalResults = computed(() => results.value.length)

  /**
   * Actions
   */

  //  执行搜索
  const search = async (searchKeyword: string) => {
    keyword.value = searchKeyword
    isSearching.value = true
    try {
      // 查询选项
      const options: QueryOptions = {
        search: searchKeyword,
        isDeleted: false,
        limit: 20
      }

      // 搜索代码片段
      results.value = await window.api.code.getCodes(options)
      // 重复选中索引为第一个
      selectedIndex.value = 0
    } catch (error) {
      console.log('[Store] 搜索失败: ', error)
      results.value = []
    } finally {
      isSearching.value = false
    }
  }

  // 选择下一个搜索结果
  const selectNext = () => {
    if (selectedIndex.value < totalResults.value - 1) {
      selectedIndex.value++
    }
  }

  // 选择上一个结果
  const selectPrev = () => {
    if (selectedIndex.value > 0) {
      selectedIndex.value--
    }
  }

  // 选择是定索引的结果
  const selectByIndex = (index: number) => {
    if (index >= 0 && index < results.value.length) {
      selectedIndex.value = index
    }
  }

  // 确认选择并复制到剪切板
  const confirmSelection = async () => {
    const code = results.value[selectedIndex.value]
    if (!code) return
    try {
      // 复制
      await navigator.clipboard.writeText(code.content)

      // 复制成功后隐藏搜索框
      window.api.window.close('searchbar')
    } catch (error) {
      console.log('[Store] 复制失败', error)
    }
  }

  // 清空搜索
  const clearSearch = () => {
    keyword.value = ''
    results.value = []
    selectedIndex.value = 0
  }

  // 打开管理页面
  const openManagePage = () => {
    window.api.window.open('manager')
  }

  return {
    // States
    keyword,
    results,
    selectedIndex,
    isSearching,

    // Getters
    selectedCode,
    hasResults,
    totalResults,

    // Actions
    search,
    selectNext,
    selectPrev,
    selectByIndex,
    confirmSelection,
    clearSearch,
    openManagePage
  }
})
