<script lang="ts" setup>
const toaster = {
  position: 'top-right',
  duration: 3000,
  progress: false
}
</script>

<template>
  <UApp :toaster="toaster">
    <RouterView />
  </UApp>
</template>
