import { IPC_KEYS } from '@shared/constants'

import { ipcRenderer, IpcRendererEvent } from 'electron'

/**
 * 快捷键管理模块
 */
export const shortcutAPI = {
  // 检查快捷键是否已注册
  isRegistered: (shortcut: string) => ipcRenderer.invoke(IPC_KEYS.SHORTCUT_IS_REGISTERED, shortcut),

  // 注册全局快捷键
  register: (shortcut: string, action: string) => ipcRenderer.invoke(IPC_KEYS.SHORTCUT_REGISTER, shortcut, action),

  // 注销全局快捷键
  unregisterAll: () => ipcRenderer.send(IPC_KEYS.SHORTCUT_ALL_UNREGISTER),

  // 注册搜索框快捷键
  registerSearchbar: (shortcut: string) => ipcRenderer.invoke(IPC_KEYS.SHORTCUT_REGISTER_SEARCHBAR, shortcut),

  // 注册操作快捷键
  registerAction: () => ipcRenderer.invoke(IPC_KEYS.SHORTCUT_REGISTER_ACTION),

  // 监听快捷键触发事件
  onTrigger: (callback: (action: string) => void) => {
    // 包装函数
    const wrapper = (_event: IpcRendererEvent, action: string) => callback(action)

    // 将包装函数绑定到callback
    ;(callback as any)._wrapper = wrapper
    ipcRenderer.on(IPC_KEYS.SHORTCUT_TRIGGER, wrapper)
  },

  // 取消监听快捷键触发事件
  offTrigger: (callback: (action: string) => void) => {
    // 解绑包装函数
    const wrapper = (callback as any)._wrapper
    if (wrapper) {
      ipcRenderer.off(IPC_KEYS.SHORTCUT_TRIGGER, wrapper)
    }
  }
}
