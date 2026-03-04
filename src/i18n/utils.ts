import { LanguageType } from '../shared/types'
import { LANGUAGE_DISPLAY_NAME, LANGUAGE_PRIORITY } from '../shared/constants'

// 自动导入所有语言的翻译文件
const allLanguageModules = import.meta.glob('./lang/**/*.ts', { eager: true })

// 构建语言消息对象
export function buildLanguageMessages() {
  const messages: Record<string, Record<string, any>> = {}

  Object.entries(allLanguageModules).forEach(([path, module]) => {
    // 解析路径, './lang/zh-CN/common.ts' -> { lang: 'zh-CN', module: 'common' }
    const match = path.match(/\.\/lang\/([^/]+)\/([^/]+)\.ts$/)

    if (match) {
      const [, langCode, moduleName] = match

      // 跳过index 文件
      if (moduleName !== 'index') {
        if (!messages[langCode]) {
          messages[langCode] = {}
        }
        messages[langCode][moduleName] = (module as any).default
      }
    }
  })

  return messages
}

// 获取所有支持的语言
export function getSupportLanguages() {
  const messages = buildLanguageMessages()
  return Object.keys(messages)
}

// 是否是支持的语言
export function isSupportLanguage(lang: string) {
  return getSupportLanguages().includes(lang)
}

// 获取语言显示名称映射
export function getLanguageDisplayName() {
  return LANGUAGE_DISPLAY_NAME
}

// 生成语言选项（用于下拉框）
export function getLanguageOptions() {
  const supportLanguages = getSupportLanguages() as LanguageType[]
  const displayNames = getLanguageDisplayName()

  // 按优先级排序
  const sortedLanguages = supportLanguages.sort((a, b) => {
    const priorityA = LANGUAGE_PRIORITY[a] || 999
    const priorityB = LANGUAGE_PRIORITY[b] || 999
    return priorityA - priorityB
  })

  return sortedLanguages.map((lang) => ({
    label: displayNames[lang] || lang,
    value: lang
  }))
}
