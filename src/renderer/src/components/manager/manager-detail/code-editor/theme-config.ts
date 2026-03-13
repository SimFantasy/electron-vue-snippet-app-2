import type { Extension } from '@codemirror/state'

// 主题选项
export const themeOptions = [
  { label: 'Material Light', value: 'material-light' },
  { label: 'GitHub Light', value: 'github-light' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'Solarized Light', value: 'solarized-light' },
  { label: 'Material Dark', value: 'material-dark' },
  { label: 'GitHub Dark', value: 'github-dark' },
  { label: 'Tomorrow Night', value: 'tomorrow-night' },
  { label: 'Solarized Dark', value: 'solarized-dark' },
  { label: 'One Dark', value: 'one-dark' },
  { label: 'Dracula', value: 'dracula' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Tokyo Night', value: 'tokyo-night' }
]

// 字体选项
export const fontOptions = [
  { label: 'Fira Code', value: 'Fira Code' },
  { label: 'JetBrains Mono', value: 'JetBrains Mono' },
  { label: 'Source Code Pro', value: 'Source Code Pro' }
]

// 字号选项
export const fontSizeOptions = Array.from({ length: 13 }, (_, i) => {
  const size = 12 + i
  return { label: `${size}px`, value: size }
})

// 主题加载器映射
export const themeLoaders: Record<string, () => Promise<Extension>> = {
  'one-dark': async () => {
    const { oneDark } = await import('@codemirror/theme-one-dark')
    return oneDark
  },
  'github-dark': async () => {
    const { githubDark } = await import('@ddietr/codemirror-themes/theme/github-dark')
    return githubDark
  },
  'github-light': async () => {
    const { githubLight } = await import('@ddietr/codemirror-themes/theme/github-light')
    return githubLight
  },
  dracula: async () => {
    const { dracula } = await import('@ddietr/codemirror-themes/theme/dracula')
    return dracula
  },
  'material-dark': async () => {
    const { materialDark } = await import('@ddietr/codemirror-themes/theme/material-dark')
    return materialDark
  },
  'material-light': async () => {
    const { materialLight } = await import('@ddietr/codemirror-themes/theme/material-light')
    return materialLight
  },
  'vscode-light': async () => {
    const { vsCodeLight } = await import('@fsegurai/codemirror-theme-vscode-light')
    return vsCodeLight
  },
  'vscode-dark': async () => {
    const { vsCodeDark } = await import('@fsegurai/codemirror-theme-vscode-dark')
    return vsCodeDark
  },
  'solarized-light': async () => {
    const { solarizedLight } = await import('@ddietr/codemirror-themes/theme/solarized-light')
    return solarizedLight
  },
  'solarized-dark': async () => {
    const { solarizedDark } = await import('@ddietr/codemirror-themes/theme/solarized-dark')
    return solarizedDark
  },
  monokai: async () => {
    const { monokai } = await import('@fsegurai/codemirror-theme-monokai')
    return monokai
  },
  'tokyo-night': async () => {
    const { tokyoNight } = await import('@ddietr/codemirror-themes/theme/tokyo-night')
    return tokyoNight
  }
}

// 加载主题
export async function loadTheme(theme: string): Promise<Extension | null> {
  const loader = themeLoaders[theme]

  if (!loader) {
    console.log(`[CodeEditor] 主题 ${theme} 不存在，恢复成默认主题`)
    return null
  }

  try {
    return await loader()
  } catch (error) {
    console.log(`[CodeEditor] 主题 ${theme} 加载错误`, error)
    return null
  }
}

// 默认值
export const defaultTheme = 'github-light'
export const defaultFont = 'Fira Code'
export const defaultFontSize = 14

// 获取字体样式
export function getFontCSS(fontFamily: string, fontSize: number) {
  return {
    '&': {
      height: '100%',
      fontFamily: `'${fontFamily}', 'Consolas', 'Monaco', 'Courier New', monospace`,
      fontSize: `${fontSize}px`
    },
    '.cm-scroller': {
      overflow: 'auto'
    },
    '.cm-content': {
      fontFamily: `'${fontFamily}', 'Consolas', 'Monaco', 'Courier New', monospace`
    }
  }
}
