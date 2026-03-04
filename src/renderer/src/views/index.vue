<script lang="ts" setup name="Search">
import { useSettings, useSearch } from '@/composables'

/**
 * Hooks
 */
const { loadSettings } = useSettings()
const { updateMouseThrough } = useSearch()

/**
 * States
 */
const mouseThroughContainer = useTemplateRef<HTMLElement>('mouseThroughContainer')

/**
 * Lifecycles
 */
onMounted(() => {
  // 加载应用设置
  loadSettings()
  // 加载鼠标穿透
  updateMouseThrough(mouseThroughContainer as ShallowRef<HTMLElement>)
})
</script>

<template>
  <div ref="mouseThroughContainer" class="p-1.5 w-full h-fit rounded-lg drop-shadow-lg drag">
    <SearchbarMain />

    <SearchbarResult />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
