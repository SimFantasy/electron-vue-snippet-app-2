import type { RouteRecordRaw } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'Searchbar',
    component: () => import('@/views/index.vue'),
    meta: { title: '搜索' }
  },
  {
    path: '/manager',
    name: 'Manager',
    component: () => import('@/views/manage.vue'),
    meta: { title: '代码片段管理' }
  }
] satisfies RouteRecordRaw[]
