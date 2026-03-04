<script lang="ts" setup name="TagNavs">
import { useTag } from '@/composables'

/**
 * Hooks
 */
const { tags, currentTag } = useTag()
</script>

<template>
  <div class="flex-1 flex-y-1 p-2">
    <!-- Tag Navigation Topbar -->
    <div class="flex-start">
      <span class="text-xs text-(--layout-text-secondary)">标签</span>
    </div>
    <!-- Tag Navigation List -->
    <div class="flex-y-2">
      <TagNavItem v-for="tag in tags" :key="tag" :tag="tag" :is-active="tag === currentTag" />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
