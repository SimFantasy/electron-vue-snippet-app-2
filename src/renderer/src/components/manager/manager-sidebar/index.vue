<script lang="ts" setup name="ManagerSidebar">
import { useCode } from '@/composables'

/**
 * Hooks
 */
const { loadAllCodes } = useCode()

/**
 * Lifecycles
 */
onMounted(() => {
  // 加载全部代码片段用于统计
  loadAllCodes()
})
</script>

<template>
  <div class="col-span-4 manager-panel flex-y-1">
    <QuickNavs />

    <CategoryNavs />

    <TagNavs />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
