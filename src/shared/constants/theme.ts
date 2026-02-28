/**
 * 主题配色映射
 * 每个CodeMirror主题对应一套项目配色方案
 * 用于统一编辑器主题和整个应用的视觉风格
 */

import { ColorMode } from '@shared/types/store'

// 项目配色方案
export interface ThemeColors {
  // 主背景色
  primaryBg: string
  // 次背景色
  secondaryBg: string
  // 主文本颜色
  primaryText: string
  // 次文本颜色
  secondaryText: string
  // 高亮背景色
  activeBg: string
  // 高亮文本颜色
  activeText: string
  // 边框颜色
  border: string
}

// CodeMirror主题分组（根据深浅模式分类）
export const codemirrorThemes = {
  // 浅色主题
  light: ['material-light', 'github-light', 'tomorrow', 'solarized-light'],
  // 深色主题
  dark: [
    'material-dark',
    'github-dark',
    'tomorrow-night',
    'solarized-dark',
    'on-dark',
    'dracula',
    'monokai'
  ]
}

// CodeMirror主题类型
export type CodeMirrorTheme =
  | (typeof codemirrorThemes)['light'][number]
  | (typeof codemirrorThemes)['dark'][number]

/**
 * 主题配色映射表
 * 为每个主题定义对应的配色方案
 * 使用方式
 * 1. 选择主题 ‘monokai’
 * 2. 从themeColorMap['monokai']中获取配色方案
 * 3. 应用到Vue组件的css变量中
 */
export const themeColorMap: Record<CodeMirrorTheme, ThemeColors> = {
  // Material Light
  // Material Light 主题
  'material-light': {
    primaryBg: '#fafafa',
    secondaryBg: '#f0f0f0',
    primaryText: '#263238',
    secondaryText: '#607d8b',
    activeBg: '#e3f2fd',
    activeText: '#1976d2',
    border: '#e0e0e0'
  },

  // Material Dark 主题
  'material-dark': {
    primaryBg: '#263238',
    secondaryBg: '#1e272c',
    primaryText: '#eceff1',
    secondaryText: '#90a4ae',
    activeBg: '#37474f',
    activeText: '#80cbc4',
    border: '#37474f'
  },

  // GitHub Light 主题
  'github-light': {
    primaryBg: '#ffffff',
    secondaryBg: '#f6f8fa',
    primaryText: '#24292f',
    secondaryText: '#57606a',
    activeBg: '#ddf4ff',
    activeText: '#0969da',
    border: '#d0d7de'
  },

  // GitHub Night 主题
  'github-night': {
    primaryBg: '#0d1117',
    secondaryBg: '#161b22',
    primaryText: '#c9d1d9',
    secondaryText: '#8b949e',
    activeBg: '#388bfd26',
    activeText: '#58a6ff',
    border: '#30363d'
  },

  // Tomorrow 主题（浅色）
  tomorrow: {
    primaryBg: '#ffffff',
    secondaryBg: '#f7f7f7',
    primaryText: '#4d4d4c',
    secondaryText: '#8e908c',
    activeBg: '#e0e0e0',
    activeText: '#4271ae',
    border: '#d6d6d6'
  },

  // Tomorrow Night 主题
  'tomorrow-night': {
    primaryBg: '#1d1f21',
    secondaryBg: '#282a2e',
    primaryText: '#c5c8c6',
    secondaryText: '#969896',
    activeBg: '#373b41',
    activeText: '#81a2be',
    border: '#373b41'
  },

  // Solarized Light 主题
  'solarized-light': {
    primaryBg: '#fdf6e3',
    secondaryBg: '#eee8d5',
    primaryText: '#657b83',
    secondaryText: '#93a1a1',
    activeBg: '#e5d7b0',
    activeText: '#268bd2',
    border: '#d5cbb3'
  },

  // Solarized Dark 主题
  'solarized-dark': {
    primaryBg: '#002b36',
    secondaryBg: '#073642',
    primaryText: '#839496',
    secondaryText: '#586e75',
    activeBg: '#094554',
    activeText: '#2aa198',
    border: '#094554'
  },

  // One Dark 主题
  'one-dark': {
    primaryBg: '#282c34',
    secondaryBg: '#21252b',
    primaryText: '#abb2bf',
    secondaryText: '#5c6370',
    activeBg: '#2c313a',
    activeText: '#61afef',
    border: '#3e4451'
  },

  // Dracula 主题
  dracula: {
    primaryBg: '#282a36',
    secondaryBg: '#44475a',
    primaryText: '#f8f8f2',
    secondaryText: '#6272a4',
    activeBg: '#44475a',
    activeText: '#bd93f9',
    border: '#6272a4'
  },

  // Monokai 主题
  monokai: {
    primaryBg: '#272822',
    secondaryBg: '#3e3d32',
    primaryText: '#f8f8f2',
    secondaryText: '#75715e',
    activeBg: '#49483e',
    activeText: '#a6e22e',
    border: '#49483e'
  }
}

/**
 * 根据主题模式获取主题列表
 */
export function getThemeByMode(mode: ColorMode): readonly string[] {
  if (mode === 'light') {
    return codemirrorThemes.light
  } else if (mode === 'dark') {
    return codemirrorThemes.dark
  }

  // system返回所有主题
  return [...codemirrorThemes.light, ...codemirrorThemes.dark]
}

/**
 * 获取主题的配色方案
 */
export function getThemeColors(themeName: string): ThemeColors | undefined {
  return themeColorMap[themeName as CodeMirrorTheme]
}
