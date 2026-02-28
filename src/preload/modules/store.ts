import type { AppStore } from '@shared/types'
import { IPC_KEYS } from '@shared/constants'

import { ipcRenderer } from 'electron'

/**
 * Store配置模块
 */
export const storeAPI = {
  // 获取配置项
  get: <K extends keyof AppStore, SK extends keyof AppStore[K]>(key?: K, subKey?: SK) =>
    ipcRenderer.invoke(IPC_KEYS.STORE_GET, key, subKey),

  // 设置配置项
  set: <K extends keyof AppStore, SK extends keyof AppStore[K]>(
    key: K,
    subKeyOrValue: SK | AppStore[K][SK],
    value?: AppStore[K][SK]
  ) => ipcRenderer.invoke(IPC_KEYS.STORE_SET, key, subKeyOrValue, value),

  // 获取默认配置项
  getDefault: () => ipcRenderer.invoke(IPC_KEYS.STORE_GET_DEFAULT),

  // 监听配置项变化
  onChange: <K extends keyof AppStore>(key: K, callback: (newValue: AppStore[K], oldValue: AppStore[K]) => void) => {
    const channel = `${IPC_KEYS.STORE_ON_CHANGE}-${String(key)}`
    const wrapper = (_, newValue: AppStore[K], oldValue: AppStore[K]) => callback(newValue, oldValue)

    ;(callback as any)._wrapper = wrapper
    ;(callback as any)._channel = channel

    ipcRenderer.on(channel, wrapper)
  },

  // 取消监听配置项变化
  offChange: <K extends keyof AppStore>(key: K, callback: (newValue: AppStore[K], oldValue: AppStore[K]) => void) => {
    const channel = (callback as any)._channel || `${IPC_KEYS.STORE_ON_CHANGE}-${String(key)}`
    const wrapper = (callback as any)._wrapper

    if (wrapper) {
      ipcRenderer.off(channel, wrapper)
    }
  }
}
