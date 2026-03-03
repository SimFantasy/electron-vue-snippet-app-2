import { app } from 'electron'
import { z } from 'zod'

import { join } from 'node:path'

// 搜索框位置验证
export const SearchbarPositionSchema = z.enum(['center', 'top-left', 'top-right', 'top-center', 'custom'])

// 自定义搜索框位置验证
export const CustomSearchbarPositionSchema = z.object({
  x: z.number(),
  y: z.number()
})

// 语言验证
export const LanguageSchema = z.enum(['zh-CN', 'zh-TW', 'en-US'])

// 主题模式验证
export const ThemeModeSchema = z.enum(['system', 'light', 'dark'])

// 编辑器字段验证
export const EditorFontFamilySchema = z.string().default('Fira Code')

// 背景设置验证
export const BackgroundSettingsSchema = z.object({
  // 背景图片路径
  backgroundImage: z.string().default(''),
  // 透明度范围
  opacity: z.number().min(0).max(1).default(1),
  // 模糊度范围
  blur: z.number().min(0).max(10).default(0)
})

// 通用设置验证
export const GeneralSettingsSchema = z.object({
  // 开机启动
  autoLaunch: z.boolean().default(false),
  // 系统启动时不显示搜索框
  hideOnStartup: z.boolean().default(true),
  // 搜索框失去焦点时隐藏
  autoHideOnBlur: z.boolean().default(false),
  // 显示系统托盘图标
  showSystemTray: z.boolean().default(true),
  // 搜索框置顶
  searchbarAlwaysOnTop: z.boolean().default(false),
  // 搜索框位置居中
  searchbarPosition: SearchbarPositionSchema.default('center'),
  // 自定义搜索框位置
  customSearchbarPosition: CustomSearchbarPositionSchema.default({ x: 0, y: 0 }),
  // 应用语言
  language: LanguageSchema.default('zh-CN')
})

// 存储设置验证
export const StorageSettingsSchema = z.object({
  // 数据库存储路径
  databasePath: z.string().default(join(app.getPath('userData'), 'data.db'))
})

// 编辑器设置验证
export const EditorSettingsSchema = z.object({
  // 字体
  fontFamily: EditorFontFamilySchema,
  // 是否使用系统字体
  useSystemFont: z.boolean().default(false),
  // 字号
  fontSize: z.number().min(12).max(24).default(16),
  // 缩进空格数
  tabSize: z.number().min(1).max(4).default(2),
  // 自动换行
  wordWrap: z.boolean().default(true),
  // 是否高亮当前行
  hightlightActiveLine: z.boolean().default(true),
  // 是否显示行号
  showLineNumbers: z.boolean().default(true),
  // 代码片段默认语言
  defaultLanguage: z.string().default('javascript')
})

// 外观设置验证
export const AppearanceSettingsSchema = z.object({
  // 主题模式
  themeMode: ThemeModeSchema.default('system'),
  // 当前主题
  theme: z.string().default('github-light'),
  // 搜索框背景
  searchbar: BackgroundSettingsSchema.default({
    backgroundImage: '',
    opacity: 1,
    blur: 0
  }),
  // 管理界面背景
  manager: BackgroundSettingsSchema.default({
    backgroundImage: '',
    opacity: 1,
    blur: 0
  })
})

// 快捷键设置验证
export const ShortcutSettingsSchema = z.object({
  // 搜索框快捷键
  searchbarShortcut: z.string().default('CmdOrCtrl+Shift+Space'),

  // 管理界快捷键
  managerAddCategory: z.string().default('CmdOrCtrl+Shift+N'),
  managerRenameCategory: z.string().default('F2'),
  managerRemoveCategory: z.string().default('CmdOrCtrl+Shift+Delete'),
  managerAddCode: z.string().default('CmdOrCtrl+N'),
  managerRemoveCode: z.string().default('CmdOrCtrl+Delete'),
  managerToggleFavorite: z.string().default('CmdOrCtrl+D')
})

// 完整Store Schema
export const StoreSchema = z.object({
  general: GeneralSettingsSchema,
  storage: StorageSettingsSchema,
  editor: EditorSettingsSchema,
  appearance: AppearanceSettingsSchema,
  shortcut: ShortcutSettingsSchema
})
