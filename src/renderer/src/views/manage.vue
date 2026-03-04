<script lang="ts" setup name="Manage">
import { useWindow, useSettings } from '@/composables'
import { cn } from '@/uitls'

/**
 * Hooks
 */
const { isMaximized } = useWindow()
const { appearanceSettings } = useSettings()
</script>

<template>
  <div
    :class="
      cn('w-full h-screen drop-shadow-lg', {
        'p-2 rounded-lg': !isMaximized,
        'p-0 rounded-none': isMaximized
      })
    "
  >
    <!-- Overlay -->
    <div
      class="flex-y size-full bg-(--layout-bg-secondary) rounded-lg overflow-hidden"
      :style="{
        opacity: appearanceSettings?.manager.opacity,
        backdropFilter: `blur(${appearanceSettings?.searchbar.blur}px)`
      }"
    >
      <!-- Manager Header -->
      <ManagerHeader />

      <!-- Manager Main -->
      <div class="grid grid-cols-24 gap-2 p-2 pt-0 h-[calc(100vh-var(--spacing)*12)]">
        <ManagerSidebar />

        <ManagerList />

        <ManagerDetail />
      </div>
    </div>

    <!-- Background Image -->
    <img
      v-if="appearanceSettings?.manager.backgroundImage"
      :src="appearanceSettings.manager.backgroundImage"
      class="size-full object-cover"
    />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
