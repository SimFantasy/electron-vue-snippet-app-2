import { IPC_KEYS } from '@shared/constants'

import { ipcMain } from 'electron'
import {
  isShortcutRegistered,
  registerShortcut,
  unregisterAllShortcuts,
  registerSearchbarShortcut,
  handleActionShortcutTGriggered
} from '../shortcut'

/**
 * 存储已注册的带动作的快捷键
 * key: 快捷键字符串: 如 'ctrl+shift+a'
 * value: 动作标识 如：'manager:add-category'
 */
const actionShortcuts = new Map<string, string>()

/**
 * 初始化快捷键 IPC 通信
 */
export function initShortcutIpc() {
  // 快捷键是否注册
  ipcMain.handle(IPC_KEYS.SHORTCUT_IS_REGISTERED, (_, shortcut: string) => {
    try {
      return isShortcutRegistered(shortcut)
    } catch (error) {
      console.log('[IPC] 获取快捷键是否注册失败:', error)
      return false
    }
  })

  // 注册快捷键
  ipcMain.handle(IPC_KEYS.SHORTCUT_REGISTER, (_, shortcut: string, action: string) => {
    try {
      // 如果已注册过，先注销原有快捷键
      if (actionShortcuts.has(shortcut)) {
        console.log(`[IPC] 重新注册快捷键 ${shortcut}: ${action}`)
      }

      // 注册新的快捷键
      const success = registerShortcut(shortcut, () => {
        handleActionShortcutTGriggered(shortcut, action)
      })

      if (success) {
        actionShortcuts.set(shortcut, action)
        console.log(`[IPC] 注册快捷键成功: ${shortcut}: ${action}`)
      }

      return success
    } catch (error) {
      console.log('[IPC] 注册快捷键失败:', error)
      return false
    }
  })

  // 注销所有快捷键
  ipcMain.on(IPC_KEYS.SHORTCUT_ALL_UNREGISTER, () => {
    try {
      unregisterAllShortcuts()
      actionShortcuts.clear()
      console.log('[IPC] 卸载所有快捷键成功')
    } catch (error) {
      console.log('[IPC] 卸载所有快捷键失败:', error)
    }
  })

  // 注册搜索框快捷键
  ipcMain.handle(IPC_KEYS.SHORTCUT_REGISTER_SEARCHBAR, (_, shortcut: string) => {
    try {
      return registerSearchbarShortcut(shortcut)
    } catch (error) {
      console.log('[IPC] 注册搜索框快捷键失败:', error)
      return false
    }
  })

  // 获取已注册动作快捷键列表
  ipcMain.handle(IPC_KEYS.SHORTCUT_REGISTER_ACTION, () => {
    try {
      return Array.from(actionShortcuts.entries())
    } catch (error) {
      console.log('[IPC] 获取已注册动作快捷键列表失败:', error)
      return []
    }
  })
}
