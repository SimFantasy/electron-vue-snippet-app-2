<script lang="ts" setup name="ListHeaderSearch">
import { useCode } from '@/composables'

/**
 * Hooks
 */
const { searchKeyword, searchCodes, clearSearch } = useCode()

/**
 * Actions
 */
// 处理搜索输入
const handleSearchInput = () => {
  searchCodes(searchKeyword.value)
}

// 清空搜索
const handleClearSearch = () => {
  clearSearch()
}
</script>

<template>
  <div class="flex-1 flex-x-2">
    <UIcon name="tabler:search" class="size-5 text-stone-400" />
    <input
      type="text"
      v-model="searchKeyword"
      placeholder="搜索..."
      @input="handleSearchInput"
      class="w-full border-none outline-none text-stone-600 bg-transparent"
    />

    <UIcon
      v-if="searchKeyword"
      name="tabler:circle-x-filled"
      @click="handleClearSearch"
      class="size-5 text-stone-300 cursor-pointer hover:text-stone-500"
    />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
