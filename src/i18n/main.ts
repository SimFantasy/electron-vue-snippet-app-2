import { LanguageType } from '../shared/types'
import { DEFAULT_LANGUAGE } from '../shared/constants'
import { buildLanguageMessages } from './utils'

import { getStore } from '../main/store'

// 构建语言消息对象
const messages = buildLanguageMessages()

// 为主进程提供i18n
export const mainI18n = {
  global: {
    currentLocale: DEFAULT_LANGUAGE as LanguageType,
    get locale() {
      return this.currentLocale
    },
    set locale(value: LanguageType) {
      this.currentLocale = value
    },
    t(key: string) {
      const keys = key.split('.')
      let current: any = messages[this.currentLocale]
      for (const k of keys) {
        // 如果找不到键名，则返回原始的key
        if (current[k] === undefined) {
          return key
        }
        current = current[k]
      }
      return current
    },
    messages
  }
}

// 初始化语言
export function initLanguage() {
  const savedLanguage = getStore('general', 'language') as LanguageType
  if (savedLanguage) {
    mainI18n.global.locale = savedLanguage
  }
}
