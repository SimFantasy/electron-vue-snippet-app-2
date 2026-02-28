import { IPC_KEYS } from '@shared/constants'

import { join } from 'node:path'
import { ipcMain, dialog } from 'electron'

import { closeConnection, getCurrentDbPath, createConnection } from '../db/connect'
import { initTables, setupCategoryDeleteTrigger } from '../db/table'

/**
 * 初始化数据库 IPC 通信
 */
export function initDatabaseIpc() {
  // 获取当前数据库文件路径
  ipcMain.handle(IPC_KEYS.DB_GET_PATH, () => {
    try {
      return getCurrentDbPath()
    } catch (error) {
      console.log('获取当前数据库路径失败', error)
      return null
    }
  })

  // 选择数据库文件路径
  ipcMain.handle(IPC_KEYS.DB_SELECT_DIRECTORY, async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: '选择数据库文件目录'
      })

      if (result.canceled || result.filePaths.length === 0) {
        return null
      }

      return result.filePaths[0]
    } catch (error) {
      console.log('选择数据库文件目录失败', error)
      return null
    }
  })

  // 设置数据库文件路径并重新连接
  ipcMain.handle(IPC_KEYS.DB_SET_PATH, async (_, dbPath: string) => {
    try {
      // 如果传入的是目录路径，则自动拼接数据库文件名
      let finalDbPath = dbPath
      const ext = '.db'

      if (!dbPath.endsWith(ext)) {
        finalDbPath = join(dbPath, 'data.db')
      }

      // 关闭当前数据库连接
      await closeConnection()

      // 创建新连接
      await createConnection(finalDbPath)

      // 初始化表结构
      await initTables()

      // 设置触发器
      await setupCategoryDeleteTrigger()

      return { success: true, path: dbPath }
    } catch (error) {
      console.log('设置数据库路径失败', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // 初始化数据库
  ipcMain.handle(IPC_KEYS.DB_INIT, async () => {
    try {
      // 初始化表结构
      await initTables()

      // 设置触发器
      await setupCategoryDeleteTrigger()

      return { success: true }
    } catch (error) {
      console.log('初始化数据库失败', error)
      return { success: false, error: (error as Error).message }
    }
  })
}
