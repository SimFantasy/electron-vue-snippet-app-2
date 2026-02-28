import type { Code } from '@shared/types'

export const useSearchStore = defineStore('search', () => {
  /**
   * States
   */
  // 搜索关键字
  const searchKeyword = ref('')
  // 搜索结果
  const searchResult = ref<Code[]>([])
  // 当前搜索结果的id
  const searchResultId = ref<number>(0)

  /**
   * Actions
   */

  // 设置搜索结果
  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword
  }

  // 设置搜索结果
  const setSearchResult = (result: Code[]) => {
    searchResult.value = result
  }

  // 设置当前搜索结果的id
  const setSearchResultId = (id: number) => {
    searchResultId.value = id
  }

  return {
    // States
    searchKeyword,
    searchResult,
    searchResultId,

    // Actions
    setSearchKeyword,
    setSearchResult,
    setSearchResultId
  }
})
