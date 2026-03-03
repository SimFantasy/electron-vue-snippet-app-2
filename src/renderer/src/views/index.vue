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
// 设置鼠标穿透容器
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
  <div ref="mouseThroughContainer" class="w-full h-fit drag">
    <SearchbarMain />

    <SearchbarResult />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
