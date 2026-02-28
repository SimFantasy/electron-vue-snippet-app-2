// 搜索框位置
export type SearchbarPosition = 'center' | 'top-left' | 'top-right' | 'top-center' | 'custom'

// 自定义搜索框位置坐标
export interface CustomSearchbarPosition {
  x: number
  y: number
}

// 应用语言
export type AppLanguage = 'zh-CN' | 'zh-TW' | 'en-US'

// 主题颜色模式
export type ColorMode = 'system' | 'light' | 'dark'

// 编辑器字体
export type EditorFontFamily = 'Fira Code' | 'Source Code Pro' | 'JetBrains Mono' | 'custom'

/**
 * 通用设置
 */
export interface GeneralSettings {
  // 开机自动启动应用
  autoLaunch: boolean
  // 系统启动时不显示搜索框
  hideOnStartup: boolean
  // 搜索框失去焦点时自动隐藏
  autoHideOnBlur: boolean
  // 搜索框置顶
  searchbarAlwaysOnTop: boolean
  // 显示系统托盘图标
  showSystemTray: boolean
  // 搜索框位置
  searchbarPosition: SearchbarPosition
  // 自定义搜索框位置坐标（仅在 searchbarPosition 为 custom 时生效）
  customSearchbarPosition: CustomSearchbarPosition
  // 应用语言
  language: AppLanguage
}

/**
 * 存储设置
 */
export interface StorageSettings {
  // 数据库文件保存路径
  databasePath: string
}

/**
 * 编辑器设置
 */
export interface EditorSettings {
  // 编辑器字体
  fontFamily: EditorFontFamily
  // 自定义编辑器字体文件路径（仅在 fontFamily 为 custom 时生效）
  customFontFamilyPath: string
  // 字号
  fontSize: number
  // 缩进空格数
  tabSize: number
  // 自动换行
  wordWrap: boolean
  // 是否高亮当前行
  hightlightActiveLine: boolean
  // 是否显示行号
  showLineNumbers: boolean
  // 代码片段默认语言
  defaultLanguage: string
}

// 背景设置
export interface BackgroundSettings {
  // 背景图片路径
  backgroundImage: string
  // 背景透明度：0.1-1
  opacity: number
  // 背景模糊度：0-10
  blur: number
}

/**
 * 外观设置
 */
export interface AppearanceSettings {
  // 主题模式
  themeMode: ColorMode
  // 当前主题名称
  theme: string
  // 搜索框背景设置
  searchbar: BackgroundSettings
  // 管理界面背景设置
  manager: BackgroundSettings
}

/**
 * 快捷键设置
 */
export interface ShortcutSettings {
  // 搜索框快捷键
  searchbarShortcut: string
}

/**
 * 完整的应用配置
 */
export interface AppStore {
  general: GeneralSettings
  storage: StorageSettings
  editor: EditorSettings
  appearance: AppearanceSettings
  shortcut: ShortcutSettings
}

// 数据库统计信息
export interface DatabaseStatistics {
  // 总条目数
  total: number
  // 收藏数量
  favorites: number
  // 回收站数量
  trash: number
}
