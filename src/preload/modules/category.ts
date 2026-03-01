import type { CreateCategoryInput, UpdateCategoryInput } from '@shared/types'
import { IPC_KEYS } from '@shared/constants'

import { ipcRenderer } from 'electron'

/**
 * 分类管理模块
 */
export const categoryAPI = {
  // 获取所有分类
  getCategories: () => ipcRenderer.invoke(IPC_KEYS.CATEGORY_GET_ALL),

  // 创建分类
  create: (data: CreateCategoryInput) => ipcRenderer.invoke(IPC_KEYS.CATEGORY_CREATE, data),

  // 批量更新分类排序
  UpdateSortOrder: (sortedIds: number[]) => ipcRenderer.invoke(IPC_KEYS.CATEGOR_UPDATE_SORT_ORDER, sortedIds),

  // 更新分类
  update: (id: number, data: UpdateCategoryInput) => ipcRenderer.invoke(IPC_KEYS.CATEGORY_UPDATE, id, data),

  // 删除分类
  remove: (id: number) => ipcRenderer.invoke(IPC_KEYS.CATEGORY_DELETE, id)
}
