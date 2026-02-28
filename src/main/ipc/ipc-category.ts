import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@shared/types'
import { IPC_KEYS } from '@shared/constants'

import { ipcMain } from 'electron'
import { getCategories, createCategory, updateCategory, removeCategory } from '../db/query'

/**
 * 初始化 分类 ipc 通信
 */
export function initCategoryIpc() {
  // 获取所有分类
  ipcMain.handle(IPC_KEYS.CATEGORY_GET_ALL, async (): Promise<Category[]> => {
    try {
      return await getCategories()
    } catch (error) {
      console.log('[IPC] 获取所有分类错误:', error)
      return []
    }
  })

  // 创建分类
  ipcMain.handle(IPC_KEYS.CATEGORY_CREATE, async (_, data: CreateCategoryInput): Promise<number> => {
    try {
      return await createCategory(data)
    } catch (error) {
      console.log('[IPC] 创建分类错误:', error)
      return -1
    }
  })

  // 更新分类
  ipcMain.handle(IPC_KEYS.CATEGORY_UPDATE, async (_, id: number, data: UpdateCategoryInput): Promise<number> => {
    try {
      return await updateCategory(id, data)
    } catch (error) {
      console.log('[IPC] 更新分类错误:', error)
      return -1
    }
  })

  // 删除分类
  ipcMain.handle(IPC_KEYS.CATEGORY_DELETE, async (_, id: number): Promise<number> => {
    try {
      return await removeCategory(id)
    } catch (error) {
      console.log('[IPC] 删除分类错误:', error)
      return -1
    }
  })
}
