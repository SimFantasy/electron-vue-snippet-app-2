import type { Code, CreateCodeInput, UpdateCodeInput, QueryOptions } from '@shared/types'
import { IPC_KEYS } from '@shared/constants'

import { ipcMain } from 'electron'
import {
  getCodes,
  getCodeById,
  createCode,
  updateCode,
  removeCode,
  softRemoveCode,
  restoreCode,
  getTrashCodes,
  getFavorites,
  toggleFavorite,
  searchCode,
  getCodesCount,
  getCodeByTag,
  getTags,
  clearTrash,
  batchUpdateCategory,
  moveCodesToUncategorized
} from '../db/query'

/**
 * 初始化代码片段 IPC 通信
 */
export function initCodeIpc() {
  // 获取所有代码片段
  ipcMain.handle(IPC_KEYS.CODE_GET_ALL, async (_, options: QueryOptions = {}): Promise<Code[]> => {
    try {
      return await getCodes(options)
    } catch (error) {
      console.log('[IPC] 获取所有代码片段失败:', error)
      return []
    }
  })

  // 根据ID 获取代码片段
  ipcMain.handle(IPC_KEYS.CODE_GET_BY_ID, async (_, id: number): Promise<Code | undefined> => {
    try {
      return await getCodeById(id)
    } catch (error) {
      console.log('[IPC] 根据ID获取代码片段失败:', error)
      return undefined
    }
  })

  // 创建代码片段
  ipcMain.handle(IPC_KEYS.CODE_CREATE, async (_, data: CreateCodeInput): Promise<number> => {
    try {
      return await createCode(data)
    } catch (error) {
      console.log('[IPC] 创建代码片段失败:', error)
      return -1
    }
  })

  // 更新代码片段
  ipcMain.handle(IPC_KEYS.CODE_UPDATE, async (_, id: number, data: UpdateCodeInput): Promise<number> => {
    try {
      return await updateCode(id, data)
    } catch (error) {
      console.log('[IPC] 更新代码片段失败:', error)
      return -1
    }
  })

  // 批量更新代码片段分类
  ipcMain.handle(IPC_KEYS.CODE_BATCH_UPDATE_CATEGORY, async (_, codeIds: number[], categoryId: number): Promise<number> => {
    try {
      return await batchUpdateCategory(codeIds, categoryId)
    } catch (error) {
      console.log('[IPC] 批量更新代码片段失败', error)
      return -1
    }
  })

  // 将分类下代码片段移动到未分类
  ipcMain.handle(IPC_KEYS.CODE_MOVE_TO_UNCATEGORIZED, async (_, categoryId: number): Promise<number> => {
    try {
      return await moveCodesToUncategorized(categoryId)
    } catch (error) {
      console.log('[IPC] 移动代码片段到未分类失败:', error)
      return -1
    }
  })

  // 硬删除代码片段(从数据库中彻底删除)
  ipcMain.handle(IPC_KEYS.CODE_DELETE, async (_, id: number): Promise<number> => {
    try {
      return await removeCode(id)
    } catch (error) {
      console.log('[IPC] 硬删除代码片段失败:', error)
      return -1
    }
  })

  // 软删除代码片段（移入回收站）
  ipcMain.handle(IPC_KEYS.CODE_SOFT_DELETE, async (_, id: number): Promise<number> => {
    try {
      return await softRemoveCode(id)
    } catch (error) {
      console.log('[IPC] 软删除代码片段失败:', error)
      return -1
    }
  })

  // 恢复代码片段（从回收站恢复）
  ipcMain.handle(IPC_KEYS.CODE_RESTORE, async (_, id: number): Promise<number> => {
    try {
      return await restoreCode(id)
    } catch (error) {
      console.log('[IPC] 恢复代码片段失败:', error)
      return -1
    }
  })

  // 获取回收站中的代码片段
  ipcMain.handle(IPC_KEYS.CODE_GET_TRASH, async (): Promise<Code[]> => {
    try {
      return await getTrashCodes()
    } catch (error) {
      console.log('[IPC] 获取回收站中的代码片段失败:', error)
      return []
    }
  })

  // 清空回收站
  ipcMain.handle(IPC_KEYS.CODE_CLEAR_TRASH, async (): Promise<number> => {
    try {
      return await clearTrash()
    } catch (error) {
      console.log('[IPC] 清空回收站:', error)
      return -1
    }
  })

  // 获取收藏的代码片段
  ipcMain.handle(IPC_KEYS.CODE_GET_FAVORITE, async (): Promise<Code[]> => {
    try {
      return await getFavorites()
    } catch (error) {
      console.log('[IPC] 获取收藏的代码片段失败:', error)
      return []
    }
  })

  // 切换收藏状态
  ipcMain.handle(IPC_KEYS.CODE_TOGGLE_FAVORITE, async (_, id: number): Promise<boolean> => {
    try {
      return await toggleFavorite(id)
    } catch (error) {
      console.log('[IPC] 切换收藏状态失败:', error)
      return false
    }
  })

  // 搜索代码片段(搜索分类下的代码片段)
  ipcMain.handle(IPC_KEYS.CODE_SEARCH, async (_, keyword: string, categoryId?: number, isDeleted?: boolean): Promise<Code[]> => {
    try {
      return await searchCode(keyword, categoryId, isDeleted)
    } catch (error) {
      console.log('[IPC] 搜索代码片段失败:', error)
      return []
    }
  })

  // 获取代码片段总数
  ipcMain.handle(IPC_KEYS.CODE_GET_COUNT, async (_, categoryId?: number, isDeleted?: boolean): Promise<number> => {
    try {
      return await getCodesCount(categoryId, isDeleted)
    } catch (error) {
      console.log('[IPC] 获取代码片段总数失败:', error)
      return -1
    }
  })

  // 根据标签获取代码片段
  ipcMain.handle(IPC_KEYS.CODE_GET_BY_TAG, async (_, tag: string): Promise<Code[]> => {
    try {
      return await getCodeByTag(tag)
    } catch (error) {
      console.log('[IPC] 根据标签获取代码片段失败:', error)
      return []
    }
  })

  // 获取所有标签
  ipcMain.handle(IPC_KEYS.CODE_GET_ALL_TAGS, async () => {
    try {
      return await getTags()
    } catch (error) {
      console.log('[IPC] 获取所有标签失败:', error)
      return []
    }
  })
}
