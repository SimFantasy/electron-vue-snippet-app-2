import { IPC_KEYS } from '@shared/constants'

import { ipcRenderer } from 'electron'

/**
 * 鼠标事件管理模块
 */
export const mouseAPI = {
  // 设置是否忽略鼠标事件（用于鼠标穿透）
  ignoreMouseEvents: (enabled: boolean, options?: { forward: boolean }) =>
    ipcRenderer.send(IPC_KEYS.IGNORE_MOUSE_EVENTS, enabled, options)
}
