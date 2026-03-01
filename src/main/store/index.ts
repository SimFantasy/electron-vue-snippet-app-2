/**
 * Electron Store 配置
 */

import type { AppStore } from '@shared/types'

import { join } from 'node:path'

import { app } from 'electron'
import Store from 'electron-store'
import { z } from 'zod'

import { StoreSchema } from './schemas'

/**
 * Store 默认值
 */
export const defaultStore: AppStore = {
  general: {
    autoLaunch: false,
    hideOnStartup: true,
    autoHideOnBlur: true,
    searchbarAlwaysOnTop: false,
    showSystemTray: true,
    searchbarPosition: 'center',
    customSearchbarPosition: { x: 0, y: 0 },
    language: 'zh-CN'
  },
  storage: {
    databasePath: join(app.getPath('userData'), 'data.db')
  },
  editor: {
    fontFamily: 'Fira Code',
    customFontFamilyPath: '',
    fontSize: 16,
    tabSize: 2,
    wordWrap: true,
    hightlightActiveLine: true,
    showLineNumbers: true,
    defaultLanguage: 'javascript'
  },
  appearance: {
    themeMode: 'system',
    theme: 'github-light',
    searchbar: {
      backgroundImage: '',
      opacity: 1,
      blur: 0
    },
    manager: {
      backgroundImage: '',
      opacity: 1,
      blur: 0
    }
  },
  shortcut: {
    searchbarShortcut: 'CmdOrCtrl+Shift+Space',
    // 管理器快捷键
    managerAddCategory: 'CmdOrCtrl+Shift+N',
    managerRenameCategory: 'F2',
    managerRemoveCategory: 'Delete',
    managerAddCode: 'CmdOrCtrl+N',
    managerRemoveCode: 'Delete',
    managerToggleFavorite: 'CmdOrCtrl+D'
  }
}

// Store实例
export const store = new Store({
  // 默认值
  defaults: defaultStore,
  // 配置文件名
  name: 'sim-snippet-config',
  // 开发环境下，配置格式错误时清空配置，生产环境下设置为false
  clearInvalidConfig: process.env.NODE_ENV === 'development'
})

// 验证整个Store配置
export function validateStore(): { valid: boolean; errors?: string[] } {
  try {
    // 获取当前配置
    const currentStore = store.store

    // 使用Zod验证
    StoreSchema.parse(currentStore)

    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`)

      return { valid: false, errors }
    }

    return { valid: false, errors: ['Unknown validation error'] }
  }
}

// 重置配置到默认值
export function resetStore(section?: keyof AppStore) {
  if (section) {
    // 重置指定section
    store.set(section, defaultStore[section])
  } else {
    // 重置所有配置
    store.clear()
    store.set(defaultStore)
  }
}

// 获取配置项
export function getStore<K extends keyof AppStore>(key: K): AppStore[K]
export function getStore<K extends keyof AppStore, SK extends keyof AppStore[K]>(key: K, subKey: SK): AppStore[K][SK]
export function getStore(key: string, subKey?: string): unknown {
  if (subKey) {
    return store.get(`${key}.${subKey}`)
  }
  return store.get(key)
}

// 设置配置项
export function setStore<K extends keyof AppStore>(key: K, value: AppStore[K]): void
export function setStore<K extends keyof AppStore, SK extends keyof AppStore[K]>(key: K, subKey: SK, value: AppStore[K][SK]): void
export function setStore(key: string, subKeyOrValue: unknown, value?: unknown): void {
  if (value !== undefined) {
    store.set(`${key}.${subKeyOrValue}`, value)
  } else {
    store.set(key, subKeyOrValue)
  }
}

// 监听配置变化
export function onStoreChange<K extends keyof AppStore>(
  key: K,
  callback: (newValue: AppStore[K], oldValue: AppStore[K]) => void
): () => void {
  return store.onDidChange(key, callback as (newValue: unknown, oldValue: unknown) => void)
}

export { StoreSchema } from './schemas'
export { initStoreWatcher } from './watcher'
