import type { WindowType } from '@shared/types'
import { IPC_KEYS } from '@shared/constants'

import { ipcRenderer } from 'electron'

/**
 * 窗口控制模块
 */
export const windowAPI = {
  // 打开指定窗口
  open: (type: WindowType) => ipcRenderer.invoke(IPC_KEYS.WINDOW_OPEN, type),

  // 关闭指定窗口
  close: (type: WindowType) => ipcRenderer.invoke(IPC_KEYS.WINDOW_CLOSE, type),

  // 最小化当前窗口
  minimize: () => ipcRenderer.send(IPC_KEYS.WINDOW_MINIMIZE),

  // 最大化当前窗口
  maximize: () => ipcRenderer.send(IPC_KEYS.WINDOW_MAXIMIZE),

  // 还原当前窗口
  restore: () => ipcRenderer.send(IPC_KEYS.WINDOW_RESTORE),

  // 关闭当前窗口
  closeCurrent: () => ipcRenderer.send(IPC_KEYS.WINDOW_CLOSE_CURRENT),

  // 设置窗口置顶
  setAlwaysOnTop: (enabled: boolean) => ipcRenderer.invoke(IPC_KEYS.WINDOW_SET_ALWAYS_ON_TOP, enabled)
}
