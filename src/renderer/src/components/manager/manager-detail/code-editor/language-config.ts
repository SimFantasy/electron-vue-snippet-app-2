import type { LanguageSupport } from '@codemirror/language'

// 语言选项
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
  { lable: 'Markdown', value: 'markdown' },
  { label: 'Python', value: 'python' },
  { label: 'Rust', value: 'rust' },
  { label: 'SCSS', value: 'scss' },
  { label: 'SQL', value: 'sql' },
  { label: 'TOML', value: 'toml' },
  { label: 'TSX', value: 'tsx' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'YAML', value: 'yaml' }
]

// 语言加载映射
export const languageLoaders: Record<string, () => Promise<LanguageSupport>> = {
  bash: async () => {
    const { javascript } = await import('@codemirror/lang-javascript')
    return javascript()
  },
  css: async () => {
    const { css } = await import('@codemirror/lang-css')
    return css()
  },
  dart: async () => {
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
    const { css } = await import('@codemirror/lang-css')
    return css()
  },
  sql: async () => {
    const { sql } = await import('@codemirror/lang-sql')
    return sql()
  },
  toml: async () => {
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
    console.log(`[CodeEditor] 语言 ${language} 不支持`)
    return null
  }
  try {
    return await loader()
  } catch (error) {
    console.log(`[CodeEditor] 加载语言 ${language} 失败`, error)
    return null
  }
}

// 默认语言
export const defaultLanguage = 'javascript'
