import { createI18n } from 'vue-i18n'

import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from '../shared/constants'
import { buildLanguageMessages } from './utils'

// 构建语言消息对象
const messages = buildLanguageMessages()

// 给渲染进程提供的 i18n 实例
export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LANGUAGE,
  fallbackLocale: FALLBACK_LANGUAGE,
  messages,
  globalInjection: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true
})
