import { IPC_KEYS } from '@shared/constants'

import { ipcMain, IpcMainEvent } from 'electron'
import { getWindowByEvent } from '../windows'

/**
 * 初始化鼠标穿透 IPC 通信
 */
export function initIpcMouse() {
  ipcMain.on(IPC_KEYS.IGNORE_MOUSE_EVENTS, (event: IpcMainEvent, ignore: boolean, options?: { forward: boolean }) => {
    try {
      const win = getWindowByEvent(event)

      if (!win) return false

      win.setIgnoreMouseEvents(ignore, options)

      return true
    } catch (error) {
      console.log('[IPC] 初始化鼠标穿透失败', error)
      return false
    }
  })
}
