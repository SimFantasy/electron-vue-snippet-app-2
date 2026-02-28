import type { CreateCodeInput, UpdateCodeInput, QueryOptions } from '@shared/types'
import { IPC_KEYS } from '@shared/constants'

import { ipcRenderer } from 'electron'

/**
 * 代码片段管理模块
 */
export const codeAPI = {
  // 获取所有代码片段
  getCodes: (options?: QueryOptions) => ipcRenderer.invoke(IPC_KEYS.CODE_GET_ALL, options),

  // 根据ID获取代码片段
  getCodeById: (id: number) => ipcRenderer.invoke(IPC_KEYS.CODE_GET_BY_ID, id),

  // 创建代码片段
  create: (data: CreateCodeInput) => ipcRenderer.invoke(IPC_KEYS.CODE_CREATE, data),

  // 更新代码片段
  update: (id: number, data: UpdateCodeInput) => ipcRenderer.invoke(IPC_KEYS.CODE_UPDATE, id, data),

  // 硬删除代码片段
  remove: (id: number) => ipcRenderer.invoke(IPC_KEYS.CODE_DELETE, id),

  // 软删除代码片段
  softRemove: (id: number) => ipcRenderer.invoke(IPC_KEYS.CODE_SOFT_DELETE, id),

  // 恢复软删除的代码片段
  restore: (id: number) => ipcRenderer.invoke(IPC_KEYS.CODE_RESTORE, id),

  // 获取回收站所有代码片段
  getTrashCodes: () => ipcRenderer.invoke(IPC_KEYS.CODE_GET_TRASH),

  // 获取收藏夹所有代码片段
  getFavoriteCodes: () => ipcRenderer.invoke(IPC_KEYS.CODE_GET_FAVORITE),

  // 切换收藏状态
  toggleFavorite: (id: number) => ipcRenderer.invoke(IPC_KEYS.CODE_TOGGLE_FAVORITE, id),

  // 搜索代码片段
  search: (keyword: string, categoryId?: number, isDeleted?: boolean) =>
    ipcRenderer.invoke(IPC_KEYS.CODE_SEARCH, keyword, categoryId, isDeleted),

  // 获取代码片段数量
  count: (categoryId?: number, isDeleted?: boolean) => ipcRenderer.invoke(IPC_KEYS.CODE_GET_COUNT, categoryId, isDeleted),

  // 根据标签获取代码片段
  getCodesByTag: (tag: string) => ipcRenderer.invoke(IPC_KEYS.CODE_GET_BY_TAG, tag)
}
