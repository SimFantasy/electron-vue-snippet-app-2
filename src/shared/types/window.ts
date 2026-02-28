import { BrowserWindowConstructorOptions } from 'electron'

// 窗口选项
export interface WindowOptions extends BrowserWindowConstructorOptions {
  openDevTools?: boolean
  hash?: string
  initShow?: boolean
}

// 窗口类型
export type WindowType = 'searchbar' | 'manager'

// 自定义窗口选项
export type CustomWindowOptions = Record<WindowType, { id: number; options: WindowOptions; settingsApplied?: boolean }>
