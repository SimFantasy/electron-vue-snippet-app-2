import { useDebounceFn } from '@vueuse/core'
import { useSearchStore } from '@/stores'

export function useSearch() {
  /**
   * Hooks
   */
  const searchStore = useSearchStore()

  /**
   * States
   */

  /**
   * Getters
   */
  // 搜索关键字
  const keyword = computed(() => searchStore.keyword)
  // 搜索结果
  const results = computed(() => searchStore.results)
  // 当前搜索结果的索引
  const selectedIndex = computed(() => searchStore.selectedIndex)
  // 是否正在搜索
  const isSearching = computed(() => searchStore.isSearching)
  // 当前选中的代码片段
  const selectedCode = computed(() => searchStore.selectedCode)
  // 是否有搜索结果
  const hasResults = computed(() => searchStore.hasResults)

  /**
   * Actions
   */
  // 防抖搜索
  const debouncedSearch = useDebounceFn((keyword: string) => {
    if (!keyword.trim()) {
      searchStore.clearSearch()
      return
    }

    searchStore.search(keyword)
  }, 300)

  // 键盘导航
  const handleKeyNavigation = (event: KeyboardEvent) => {
    // 如果没有搜索结果，则不处理
    if (!searchStore.hasResults) return

    switch (event.key) {
      case 'ArrowDown': {
        // 向下选择下一个结果
        event.preventDefault()
        searchStore.selectNext()
        break
      }
      case 'ArrowUp': {
        // 向上选择上一个结果
        event.preventDefault()
        searchStore.selectPrev()
        break
      }
      case 'Enter': {
        // 回车确认并复制
        event.preventDefault()
        if (!searchStore.selectedCode) return
        searchStore.confirmSelection()
        break
      }
      case 'Escape': {
        // 清空并隐藏窗口
        event.preventDefault()
        searchStore.clearSearch()
        window.api.window.close('searchbar')
        break
      }
    }
  }

  // 鼠标穿透控制
  const updateMouseThrough = <T extends HTMLElement>(el: ShallowRef<T>) => {
    // 如果没有鼠标穿透容器，则不处理
    if (!el.value) return

    // 在容器上时，不可穿透
    el.value.addEventListener('mouseover', () => {
      window.api.mouse.ignoreMouseEvents(false)
    })

    // 离开容器，可以穿透
    document.body.addEventListener('mouseover', (e: MouseEvent) => {
      if (e.target === document.body) {
        window.api.mouse.ignoreMouseEvents(true, { forward: true })
      }
    })

    // 初始化时， 穿透
    window.api.mouse.ignoreMouseEvents(true, { forward: true })
  }

  return {
    // Getters
    keyword,
    results,
    selectedIndex,
    isSearching,
    selectedCode,
    hasResults,

    // Actions
    debouncedSearch,
    handleKeyNavigation,

    // Hooks
    confirmSelection: searchStore.confirmSelection,
    clearSearch: searchStore.clearSearch,
    openManagePage: searchStore.openManagePage,
    selectedByIndex: searchStore.selectByIndex,
    updateMouseThrough
  }
}
