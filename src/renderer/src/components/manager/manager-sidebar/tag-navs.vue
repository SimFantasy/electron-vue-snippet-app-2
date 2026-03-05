<script lang="ts" setup name="TagNavs">
import { useTag } from '@/composables'

/**
 * Hooks
 */
const { tags, currentTag, selectTag } = useTag()
</script>

<template>
  <div class="flex-y-1 h-40 overflow-hidden">
    <!-- Tag Navigation Topbar -->
    <div class="flex-start p-2 pb-0">
      <span class="text-xs text-(--layout-text-secondary)">标签</span>
    </div>
    <!-- Tag Navigation List -->
    <div class="flex gap-2 flex-wrap p-2 pt-0 size-full overflow-y-auto">
      <TagNavItem v-for="tag in tags" :key="tag" :tag="tag" :is-active="tag === currentTag" @on-select="selectTag" />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
