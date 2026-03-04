<script lang="ts" setup name="TagNavItem">
/**
 * Defines
 */
// Props
defineProps<{
  tag: string
  isActive: boolean
}>()

// Emits
const emit = defineEmits<{
  onSelect: [tag: string]
}>()
</script>

<template>
  <UBadge :label="tag" :variant="isActive ? 'subtle' : 'outline'" :color="isActive ? 'primary' : 'neutral'" />
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
