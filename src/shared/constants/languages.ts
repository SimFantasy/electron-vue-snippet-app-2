// 语言显示名称映射
export const LANGUAGE_DISPLAY_NAME = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English'
} as const

// 模拟语言
export const DEFAULT_LANGUAGE = 'zh-CN'

// 回退语言
export const FALLBACK_LANGUAGE = 'en-US'

// 语言排序优先级
export const LANGUAGE_PRIORITY = {
  'zh-CN': 1,
  'zh-TW': 2,
  'en-US': 3
}
