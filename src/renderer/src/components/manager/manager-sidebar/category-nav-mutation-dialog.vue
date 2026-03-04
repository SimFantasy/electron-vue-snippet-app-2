<script lang="ts" setup name="CategoryNavMutationDialog">
/**
 * Defines
 */
// Props

// Models
const visiable = defineModel<boolean>('open')

/**
 * States
 */
const UModal = resolveComponent('UModal')
</script>

<template>
  <UModal v-model:open="visiable">
    <template #content> form </template>
  </UModal>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
