import type { LanguageSupport } from '@codemirror/language'

// 语言选项（用于 UI 选择器）
export const languageOptions = [
  { label: 'Bash', value: 'bash' },
  { label: 'CSS', value: 'css' },
  { label: 'Dart', value: 'dart' },
  { label: 'Go', value: 'go' },
  { label: 'HTML', value: 'html' },
  { label: 'Java', value: 'java' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'JSON', value: 'json' },
  { label: 'JSX', value: 'jsx' },
  { label: 'Less', value: 'less' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Python', value: 'python' },
  { label: 'Rust', value: 'rust' },
  { label: 'SCSS', value: 'scss' },
  { label: 'SQL', value: 'sql' },
  { label: 'TOML', value: 'toml' },
  { label: 'TSX', value: 'tsx' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'YAML', value: 'yaml' }
]

// 语言加载器映射（动态导入）
export const languageLoaders: Record<string, () => Promise<LanguageSupport>> = {
  bash: async () => {
    // Bash 使用 legacy-modes 或 stream-parser
    const { javascript } = await import('@codemirror/lang-javascript')
    return javascript()
  },
  css: async () => {
    const { css } = await import('@codemirror/lang-css')
    return css()
  },
  dart: async () => {
    // Dart 使用 JavaScript 高亮作为替代
    const { javascript } = await import('@codemirror/lang-javascript')
    return javascript()
  },
  go: async () => {
    const { go } = await import('@codemirror/lang-go')
    return go()
  },
  html: async () => {
    const { html } = await import('@codemirror/lang-html')
    return html()
  },
  java: async () => {
    const { java } = await import('@codemirror/lang-java')
    return java()
  },
  javascript: async () => {
    const { javascript } = await import('@codemirror/lang-javascript')
    return javascript()
  },
  json: async () => {
    const { json } = await import('@codemirror/lang-json')
    return json()
  },
  jsx: async () => {
    const { javascript } = await import('@codemirror/lang-javascript')
    return javascript({ jsx: true })
  },
  less: async () => {
    // Less 使用 CSS 高亮
    const { css } = await import('@codemirror/lang-css')
    return css()
  },
  markdown: async () => {
    const { markdown } = await import('@codemirror/lang-markdown')
    return markdown()
  },
  python: async () => {
    const { python } = await import('@codemirror/lang-python')
    return python()
  },
  rust: async () => {
    const { rust } = await import('@codemirror/lang-rust')
    return rust()
  },
  scss: async () => {
    // SCSS 使用 CSS 高亮
    const { css } = await import('@codemirror/lang-css')
    return css()
  },
  sql: async () => {
    const { sql } = await import('@codemirror/lang-sql')
    return sql()
  },
  toml: async () => {
    // TOML 使用 YAML 高亮作为近似
    const { yaml } = await import('@codemirror/lang-yaml')
    return yaml()
  },
  tsx: async () => {
    const { javascript } = await import('@codemirror/lang-javascript')
    return javascript({ typescript: true, jsx: true })
  },
  typescript: async () => {
    const { javascript } = await import('@codemirror/lang-javascript')
    return javascript({ typescript: true })
  },
  yaml: async () => {
    const { yaml } = await import('@codemirror/lang-yaml')
    return yaml()
  }
}

// 加载语言支持
export async function loadLanguage(language: string): Promise<LanguageSupport | null> {
  const loader = languageLoaders[language]
  if (!loader) {
    console.warn(`Language "${language}" not supported, falling back to plain text`)
    return null
  }
  try {
    return await loader()
  } catch (error) {
    console.error(`Failed to load language "${language}":`, error)
    return null
  }
}

// 获取默认语言
export const defaultLanguage = 'javascript'
