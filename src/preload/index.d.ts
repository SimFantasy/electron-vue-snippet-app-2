import type { IpcRendererEvent } from 'electron'
import type {
  Category,
  Code,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateCodeInput,
  UpdateCodeInput,
  QueryOptions,
  AppStore,
  GeneralSettings,
  EditorSettings,
  StorageSettings,
  AppearanceSettings,
  ShortcutSettings,
  WindowType
} from '@shared/types'

import { ElectronAPI } from '@electron-toolkit/preload'

/**
 * 窗口控制
 */
export interface WindowAPI {
  // 打开指定窗口
  open: (type: WindowType) => Promise<{ success: boolean; error?: string }>

  // 关闭指定窗口
  close: (type: WindowType) => Promise<{ success: boolean; error?: string }>

  // 最小化当前窗口
  minimize: () => void

  // 最大化当前窗口
  maximize: () => void

  // 还原当前窗口
  restore: () => void

  // 关闭当前窗口
  closeCurrent: () => void

  // 设置窗口是否置顶
  setAlwaysOnTop: (enabled: boolean) => Promise<boolean | { success: boolean; error?: string }>
}

/**
 * 数据库操作
 */
export interface DatabaseAPI {
  // 获取当前数据库文件路径
  getPath: () => Promise<string | null>

  // 选择数据库保存目录
  selectDirectory: () => Promise<string | null>

  // 设置数据库路径
  setPath: (dbPath: string) => Promise<{ success: boolean; path?: string; error?: string }>

  // 初始化数据库
  init: () => Promise<{ success: boolean; error?: string }>
}

/**
 * 分类操作
 */
export interface CategoryAPI {
  // 获取所有分类
  getCategories: () => Promise<Category[]>

  // 创建分类
  create: (data: CreateCategoryInput) => Promise<number>

  // 批量更新分类排序
  updateSortOrder: (sortedIds: number[]) => Promise<number>

  // 更新分类
  update: (id: number, data: UpdateCategoryInput) => Promise<number>

  // 删除分类
  remove: (id: number) => Promise<number>
}

/**
 * 代码片段操作
 */
export interface CodeAPI {
  // 获取所有代码片段
  getCodes: (options?: QueryOptions) => Promise<Code[]>

  // 根据ID获取代码片段
  getCodeById: (id: number) => Promise<Code | undefined>

  // 创建代码片段
  create: (data: CreateCodeInput) => Promise<number>

  // 更新代码片段
  update: (id: number, data: UpdateCodeInput) => Promise<number>

  // 批量更新代码片段分类
  batchUpdateCategory: (codeIds: number[], categoryId: number) => Promise<number>

  // 将分类下所有代码片段移动到未分类
  moveToUncategorized: (categoryId: number) => Promise<number>

  // 硬删除代码片段
  remove: (id: number) => Promise<number>

  // 软删除代码片段
  softRemove: (id: number) => Promise<number>

  // 恢复软删除的代码片段
  restore: (id: number) => Promise<number>

  // 获取回收站所有代码片段
  getTrashCodes: () => Promise<Code[]>

  // 清空回收站
  clearTrash: () => Promise<number>

  // 获取收藏夹所有代码片段
  getFavoriteCodes: () => Promise<Code[]>

  // 切换收藏状态
  toggleFavorite: (id: number) => Promise<boolean>

  // 搜索代码片段
  search: (keyword: string, categoryId?: number, isDeleted?: boolean) => Promise<Code[]>

  // 获取代码片段数量
  count: (categoryId?: number, isDeleted?: boolean) => Promise<number>

  // 根据标签获取代码片段
  getCodesByTag: (tag: string) => Promise<Code[]>

  // 获取所有标签
  getTags: () => Promise<string[]>
}

/**
 * 全局快捷键
 */
export interface ShortcutAPI {
  // 检查快捷键是否已注册
  isRegistered: (shortcut: string) => Promise<boolean>

  // 注册全局快捷键
  register: (shortcut: string, action: string) => Promise<boolean>

  // 注销所有快捷键
  unregisterAll: () => void

  // 注册搜索框快捷键
  registerSearchbar: (shortcut: string) => Promise<boolean>

  // 注册操作快捷键
  registerAction: () => Promise<[string, string][]>

  // 监听快捷键触发事件
  onTrigger: (callback: (action: string) => void) => void

  // 取消监听快捷键触发事件
  offTrigger: (callback: (action: string) => void) => void
}

/**
 * Store操作
 */
export interface StoreAPI {
  // 获取配置项
  get: <K extends keyof AppStore, SK extends keyof AppStore[K]>(key?: K, subKey?: SK) => Promise<any>

  // 设置配置项
  set: <K extends keyof AppStore, SK extends keyof AppStore[K]>(key: K, subKey: SK, value?: AppStore[K][SK]) => Promise<boolean>
  // set: <K extends keyof AppStore>(key: K, value: AppStore[K]) => Promise<boolean>
  // // 单个设置
  // set: <K extends keyof AppStore, SK extends keyof AppStore[K]>(key: K, subKey: SK, value: AppStore[K][SK]) => Promise<boolean>
  // // 实现
  // set: (key: string, subKeyOrValue: unknown, value?: unknown) => Promise<boolean>

  // 获取默认配置项
  getDefault: () => Promise<AppStore>

  // 监听配置项变化
  onChange: <K extends keyof AppStore>(key: K, callback: (newValue: AppStore[K], oldValue: AppStore[K]) => void) => void

  // 取消监听配置项变化
  offChange: <K extends keyof AppStore>(key: K, callback: (newValue: AppStore[K], oldValue: AppStore[K]) => void) => void
}

/**
 * 背景图片操作
 */
export interface BackgroundAPI {
  // 选择背景图片
  select: (type: WindowType) => Promise<string | null>

  // 删除背景图片
  remove: (type: WindowType) => Promise<boolean>

  // 获取背景图片路径
  get: (type: WindowType) => Promise<string>
}

/**
 * 鼠标事件
 */
export interface MouseAPI {
  // 设置是否忽略鼠标事件（用于鼠标穿透）
  ignoreMouseEvents: (enabled: boolean, options?: { forward: boolean }) => void
}

/**
 * 统一接口
 */
export interface API {
  window: WindowAPI
  database: DatabaseAPI
  category: CategoryAPI
  code: CodeAPI
  shortcut: ShortcutAPI
  store: StoreAPI
  background: BackgroundAPI
  mouse: MouseAPI
}

/**
 * 全局 Window 接口配置
 */
declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
