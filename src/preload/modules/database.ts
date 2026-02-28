import { IPC_KEYS } from '@shared/constants'

import { ipcRenderer } from 'electron'

/**
 * 数据库管理模块
 */
export const databaseAPI = {
  // 获取当前数据库路径
  getPath: () => ipcRenderer.invoke(IPC_KEYS.DB_GET_PATH),

  // 选择数据库保存目录
  selectDirectory: () => ipcRenderer.invoke(IPC_KEYS.DB_SELECT_DIRECTORY),

  // 设置数据库路径
  setPath: (dbPath: string) => ipcRenderer.invoke(IPC_KEYS.DB_SET_PATH, dbPath),

  // 初始化数据库
  init: () => ipcRenderer.invoke(IPC_KEYS.DB_INIT)
}
