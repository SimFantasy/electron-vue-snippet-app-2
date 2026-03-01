import { BrowserWindow, dialog, globalShortcut } from 'electron'
import { getWindowByType } from '../windows'
import { getStore, setStore } from '../store'
import { IPC_KEYS } from '@shared/constants'

// 注册快捷键并检查
export function registerShortcut(shortcut: string, callback: () => void): boolean {
  try {
    const success = globalShortcut.register(shortcut, callback)
    if (!success) {
      dialog.showErrorBox('快捷键注册失败', `快捷键 "${shortcut}" 已被其他应用程序占用，请更换其他快捷键`)
      return false
    } else {
      return true
    }
  } catch (error: any) {
    dialog.showErrorBox('快捷键错误', `注册快捷键 "${shortcut}" 时出错：${error.message}`)
    return false
  }
}

// 检查快捷键是否注册
export function isShortcutRegistered(shortcut: string): boolean {
  try {
    return globalShortcut.isRegistered(shortcut)
  } catch (error) {
    console.log('[Shortcut] 检查快捷键是否注册失败:', error)
    return false
  }
}

// 卸载所有快捷键
export function unregisterAllShortcuts() {
  try {
    globalShortcut.unregisterAll()
  } catch (error) {
    console.log('[Shortcut] 卸载所有快捷键失败:', error)
  }
}

// 注册搜索框快捷键
export function registerSearchbarShortcut(shortcut: string) {
  try {
    // 注销全局快捷键
    unregisterAllShortcuts()

    // 如果快捷键为空，直接返回
    if (!shortcut || shortcut.trim() === '') return true

    // 注册搜索框快捷键
    return registerShortcut(shortcut, () => {
      const win = getWindowByType('searchbar')

      if (win.isVisible()) {
        win.hide()
      } else {
        win.show()
      }
    })
  } catch (error) {
    console.log('[Shortcut] 注册搜索框快捷键失败:', error)
    return false
  }
}

// 初始化搜索框快捷键
export function initSearchbarShortcut() {
  try {
    const shortcut = getStore('shortcut', 'searchbarShortcut')
    if (shortcut) {
      const success = registerSearchbarShortcut(shortcut)

      if (!success) {
        console.log(`[Shortcut] 初始化快捷键 "${shortcut}" 失败，已重置为默认`)
        setStore('shortcut', 'searchbarShortcut', 'CmdOrCtrl+Shift+Space')
      }
    }
  } catch (error) {
    console.log('[Shortcut] 初始化搜索框快捷键失败:', error)
  }
}

/**
 * 处理带动作的快捷键触发
 * 向所有窗口广播事件，让渲染进程自己决定是否处理或只向特定的窗口发送
 */
export function handleActionShortcutTGriggered(shortcut: string, action: string) {
  console.log(`[IPC] 动作快捷键触发: ${shortcut}: ${action}`)

  // 解析动作类型
  const [context, operation] = action.split(':')

  // 向所有窗口广播事件
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    // 只向已加载完成的窗口发送事件
    if (!win.isDestroyed() && win.webContents.isLoading() === false) {
      win.webContents.send(IPC_KEYS.SHORTCUT_TRIGGER, {
        shortcut, // 触发快捷键
        action, // 动作标识 如：'manager:add-category'
        context, // 动作上下文 如： 'manager'
        operation, // 动作操作 如： 'add-category'
        timestamp: Date.now() // 触发时间戳
      })
    }
  })
}

// 初始化管理界面快捷键
export function initManagerShortcut() {
  const store = getStore('shortcut')

  // 新建分类
  registerShortcut(store.managerAddCategory, () => {
    handleActionShortcutTGriggered(store.managerAddCategory, 'manager:add-category')
  })

  // 重命名分类
  registerShortcut(store.managerRenameCategory, () => {
    handleActionShortcutTGriggered(store.managerRenameCategory, 'manager:rename-category')
  })

  // 删除分类
  registerShortcut(store.managerRemoveCategory, () => {
    handleActionShortcutTGriggered(store.managerRemoveCategory, 'manager:remove-category')
  })

  // 新建代码片段
  registerShortcut(store.managerAddCode, () => {
    handleActionShortcutTGriggered(store.managerAddCode, 'manager:add-code')
  })

  // 删除代码片段
  registerShortcut(store.managerRemoveCode, () => {
    handleActionShortcutTGriggered(store.managerRemoveCode, 'manager:remove-code')
  })

  // 切换收藏状态
  registerShortcut(store.managerToggleFavorite, () => {
    handleActionShortcutTGriggered(store.managerToggleFavorite, 'manager:toggle-favorite')
  })
}
