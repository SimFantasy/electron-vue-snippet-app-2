import type { WindowType } from '@shared/types'
import { IPC_KEYS } from '@shared/constants'
import { ipcMain, IpcMainInvokeEvent, type IpcMainEvent } from 'electron'
import { getWindowByType, getWindowByEvent } from '../windows'

/**
 * 初始化窗口 IPC通信
 */
export function initWindowIpc() {
  // 打开指定窗口
  ipcMain.handle(IPC_KEYS.WINDOW_OPEN, async (_, type: WindowType) => {
    try {
      const win = getWindowByType(type)
      win.show()
      // 如果窗口最小化，则恢复窗口
      if (win.isMinimized()) {
        win.restore()
      }
      win.focus()

      return { success: true }
    } catch (error) {
      console.log('[IPC] 打开窗口失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  })

  // 关闭指定窗口
  ipcMain.handle(IPC_KEYS.WINDOW_CLOSE, async (_, type: WindowType) => {
    try {
      const win = getWindowByType(type)
      win.hide()

      return { success: true }
    } catch (error) {
      console.log('[IPC] 关闭窗口失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  })

  // 最小化当前窗口
  ipcMain.on(IPC_KEYS.WINDOW_MINIMIZE, (event: IpcMainEvent) => {
    try {
      const win = getWindowByEvent(event)
      if (win) win.minimize()

      return { success: true }
    } catch (error) {
      console.log('[IPC] 最小化窗口失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  })

  // 最大化当前窗口
  ipcMain.on(IPC_KEYS.WINDOW_MAXIMIZE, (event: IpcMainEvent) => {
    try {
      const win = getWindowByEvent(event)
      if (win) win.maximize()

      return { success: true }
    } catch (error) {
      console.log('[IPC] 最大化窗口失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  })

  // 恢复当前窗口
  ipcMain.on(IPC_KEYS.WINDOW_RESTORE, (event: IpcMainEvent) => {
    try {
      const win = getWindowByEvent(event)
      if (win) win.restore()
      return { success: true }
    } catch (error) {
      console.log('[IPC] 恢复窗口失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  })

  // 关闭当前窗口
  ipcMain.on(IPC_KEYS.WINDOW_CLOSE_CURRENT, (event: IpcMainEvent) => {
    try {
      const win = getWindowByEvent(event)
      if (win) win.hide()
      return { success: true }
    } catch (error) {
      console.log('[IPC] 关闭当前窗口失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  })

  // 设置当前窗口置顶
  ipcMain.handle(IPC_KEYS.WINDOW_SET_ALWAYS_ON_TOP, (event: IpcMainInvokeEvent, isAlwaysOnTop: boolean) => {
    try {
      const win = getWindowByEvent(event)
      if (win) {
        win.setAlwaysOnTop(isAlwaysOnTop)
      }
      return isAlwaysOnTop
    } catch (error) {
      console.log('[IPC] 设置窗口置顶失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  })
}
