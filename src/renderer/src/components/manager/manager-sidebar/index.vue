<script lang="ts" setup name="ManagerSidebar">
import { useCode } from '@/composables'

/**
 * Hooks
 */
const { getAllCodesCount } = useCode()

/**
 * Lifecycles
 */
onMounted(() => {
  // 获取全部代码片段数量
  getAllCodesCount()
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
