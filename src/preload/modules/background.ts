import type { WindowType } from '@shared/types'
import { IPC_KEYS } from '@shared/constants'

import { ipcRenderer } from 'electron'

/**
 * 背景图片管理模块
 */
export const backgroundAPI = {
  // 选择背景图片
  select: (type: WindowType) => ipcRenderer.invoke(IPC_KEYS.BACKGROUND_SELECT_IMAGE, type),

  // 删除背景图片
  remove: (type: WindowType) => ipcRenderer.invoke(IPC_KEYS.BACKGROUND_DELETE_IMAGE, type),

  // 获取背景图路径
  get: (type: WindowType) => ipcRenderer.invoke(IPC_KEYS.BACKGROUND_GET_IMAGE, type)
}
