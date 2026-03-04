<script lang="ts" setup name="ManagerHeader">
import logoImage from '@/assets/logo.svg'

/**
 * States
 */
const USeperator = resolveComponent('USeparator')
</script>

<template>
  <div class="flex-x-4 justify-between px-2 h-12 drag">
    <!-- Header Start -->
    <div class="flex-x-2">
      <img :src="logoImage" class="size-6" />
      <span class="text-sm text-(--layout-text-secondary) font-semibold">SimSnippet 代码片段管理</span>
    </div>

    <!-- Header End -->
    <div class="flex-x-2">
      <SettingsButton />

      <div class="h-full">
        <USeperator orientation="vertical" size="sm" class="w-px! h-4" />
      </div>

      <WindowControls />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
