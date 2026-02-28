import type { AppStore } from '@shared/types'
import { IPC_KEYS } from '@shared/constants'

import { ipcMain, IpcMainEvent } from 'electron'
import { store, getStore, setStore, defaultStore, onStoreChange } from '../store'
import { getWindowByEvent } from '../windows'

/**
 * 初始化Store IPC通信
 */
export function initStoreIpc() {
  // 获取Store配置
  ipcMain.handle(IPC_KEYS.STORE_GET, <K extends keyof AppStore, SK extends keyof AppStore[K]>(_, key?: K, subKey?: SK) => {
    if (key && subKey) {
      // 获取嵌套配置 getStore('general', 'language')
      return getStore(key, subKey)
    } else if (key) {
      // 获取某个配置 getStore('general')
      return getStore(key)
    } else {
      // 返回整个Store配置，深拷贝防止外部修改
      return JSON.parse(JSON.stringify(store.store))
    }
  })

  // 设置Store配置
  ipcMain.handle(
    IPC_KEYS.STORE_SET,
    <K extends keyof AppStore, SK extends keyof AppStore[K]>(
      _,
      key: K,
      subKeyOrValue: SK | AppStore[K],
      value?: AppStore[K][SK]
    ) => {
      if (value !== undefined && subKeyOrValue) {
        // 设置嵌套值
        setStore(key, subKeyOrValue as SK, value)
      } else {
        // 设置整个section
        setStore(key, subKeyOrValue as AppStore[K])
      }
      return true
    }
  )

  // 获取默认配置
  ipcMain.handle(IPC_KEYS.STORE_GET_DEFAULT, () => {
    return defaultStore
  })

  // 监听Store变化
  ipcMain.on(IPC_KEYS.STORE_ON_CHANGE, (event: IpcMainEvent, key: keyof AppStore) => {
    const win = getWindowByEvent(event)
    if (!win) return

    // 监听配置变化，并通过IPC推送给渲染进程
    const unsubscribe = onStoreChange(key, (newValue, oldValue) => {
      win.webContents.send('store-change', {
        key,
        newValue,
        oldValue
      })
    })

    // 当窗口关闭时，取消监听
    win.on('closed', unsubscribe)
  })
}
