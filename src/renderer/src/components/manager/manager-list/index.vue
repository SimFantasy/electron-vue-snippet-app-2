<script lang="ts" setup name="ManagerList">
import { useCategory } from '@/composables'

/**
 * Hooks
 */
const { currentCategoryId } = useCategory()
</script>

<template>
  <div class="col-span-5 manager-panel">
    <ListHeader />

    <CodeList :key="currentCategoryId" />
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
