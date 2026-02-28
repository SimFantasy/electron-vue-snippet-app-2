import type { WindowOptions } from '@shared/types'

import { join } from 'node:path'
import url from 'node:url'

import { BrowserWindow, shell } from 'electron'
import { is } from '@electron-toolkit/utils'

import icon from '../../../resources/icon.png?asset'

// 默认窗口选项
const defaultOptions: WindowOptions = {
  width: 560,
  height: 480,
  center: true,
  show: false,
  transparent: true,
  frame: false,
  alwaysOnTop: false,
  autoHideMenuBar: true,
  ...(process.platform === 'linux' ? { icon } : {}),
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false
  }
}

// 创建窗口
export function createWindow(options: WindowOptions = {}): BrowserWindow {
  // 创建窗口实例
  const win = new BrowserWindow({ ...defaultOptions, ...options })

  // 是否显示调试工具
  if (is.dev && options?.openDevTools) {
    win.webContents.openDevTools()
  }

  // 是否初始化显示窗口
  win.on('ready-to-show', () => {
    options?.initShow && win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  win.webContents.on('did-fail-load', (_, code, desc) => {
    console.log('Failed to load:', code, desc)
  })

  // 加载页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'] + (options?.hash || ''))
  } else {
    win.loadURL(
      url.format({
        pathname: join(__dirname, '../renderer/index.html'),
        protocol: 'file',
        slashes: true,
        hash: options?.hash?.substring(1) // hash值，去掉第一个字符的斜杠
      })
    )
  }

  return win
}
