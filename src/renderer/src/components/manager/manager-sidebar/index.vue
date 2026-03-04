<script lang="ts" setup name="ManagerSidebar"></script>

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
