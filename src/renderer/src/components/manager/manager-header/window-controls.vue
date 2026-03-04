<script lang="ts" setup name="WindowControls">
import { useWindow } from '@/composables'

/**
 * Hooks
 */
const { isMaximized, minimizeWindow, toggleMaximizeWindow, closeCurrentWindow } = useWindow()
</script>

<template>
  <div class="flex-x-2">
    <UButton icon="tabler:minus" variant="ghost" color="neutral" @click="minimizeWindow" />
    <UButton
      :icon="isMaximized ? 'tabler:squares' : 'tabler:crop-5-4'"
      variant="ghost"
      color="neutral"
      @click="toggleMaximizeWindow"
    />
    <UButton icon="tabler:x" variant="ghost" color="neutral" @click="closeCurrentWindow" />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
