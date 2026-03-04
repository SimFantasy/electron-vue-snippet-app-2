<script lang="ts" setup name="SearchbarMain">
import { useSettings, useSearch } from '@/composables'
import { useI18n } from 'vue-i18n'
import { cn } from '@/uitls'

/**
 * Hooks
 */
const { appearanceSettings } = useSettings()
const { keyword, hasResults, debouncedSearch, handleKeyNavigation, clearSearch, openManagePage } = useSearch()
const { t } = useI18n()

/**
 * States
 */
const UInput = resolveComponent('UInput')
const UButton = resolveComponent('UButton')

/**
 * Lifecycles
 */
onMounted(() => {
  // 处理键盘事件
  window.addEventListener('keydown', handleKeyNavigation)
})

onUnmounted(() => {
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeyNavigation)
})
</script>

<template>
  <div
    :class="
      cn('relative w-full h-(--searchbar-height) rounded-lg overflow-hidden', {
        'rounded-b-none': hasResults
      })
    "
  >
    <!-- OverLay -->
    <div
      class="absolute inset-0 z-10 flex-x-2 px-2 size-full bg-(--layout-bg-secondary)"
      :style="{
        opacity: appearanceSettings?.searchbar.opacity,
        backdropFilter: `blur(${appearanceSettings?.searchbar.blur}px)`
      }"
    >
      <div class="flex-start h-full">
        <UIcon name="tabler:grip-vertical" class="size-5 text-stone-800/10" />
      </div>

      <UInput
        autofocus
        :model-value="keyword"
        size="lg"
        icon="tabler:search"
        :placeholder="t('searchbar.search.placeholder')"
        @update:model-value="debouncedSearch"
        class="w-full"
        :ui="{
          base: 'focus:ring-(--layout-border)! text-(--layout-text-primary)!',
          variants: {
            variant: {
              outline: 'bg-(--layout-bg-primary)'
            }
          }
        }"
      >
        <template #tralling>
          <UButton if="keyword" icon="tabler:x" variant="ghost" color="neutral" size="xs" @click="clearSearch" />
        </template>
      </UInput>

      <UButton
        icon="tabler:settings-2"
        variant="ghost"
        color="neutral"
        :title="t('searchbar.button.manager')"
        :ui="{
          base: 'cursor-pointer'
        }"
        @click="openManagePage"
      />
    </div>

    <!-- Background Image -->
    <img
      v-if="appearanceSettings?.searchbar.backgroundImage"
      :src="appearanceSettings.searchbar.backgroundImage"
      class="absolute inset-0 z-0 size-full object-cover"
    />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
