<script lang="ts" setup name="SearchbarResult">
import { useSearch } from '@/composables'
import { useI18n } from 'vue-i18n'

/**
 * Hooks
 */
const { results, selectedIndex, hasResults, selectedByIndex, confirmSelection } = useSearch()
const { t } = useI18n()

/**
 * Actions
 */
// 处理结果项点击
const handleItemClick = (index: number) => {
  selectedByIndex(index)
  confirmSelection()
}
</script>

<template>
  <div class="w-full h-[calc(100vh-var(--searchbar-height))] overflow-hidden">
    <div class="w-full h-full overflow-y-auto">
      <div v-if="hasResults" class="p-2 h-fit bg-(--layout-bg-secondary) rounded-b-lg nodrag">
        <!-- 结果列表 -->
        <div v-if="hasResults">
          <SearchbarResultItem
            v-for="(code, index) in results"
            :key="code.id"
            :code="code"
            :index="index"
            :is-selected="selectedIndex === index"
            @click="handleItemClick"
          />
        </div>

        <!-- 快捷键提示 -->
        <div class="text-center text-xs text-(--layout-secondary-text)">
          <span>{{ t('searchbar.result.shortcutHint') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
