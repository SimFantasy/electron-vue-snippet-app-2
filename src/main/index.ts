import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import { initIpc } from './ipc'
import { initSearchbarWindow } from './windows'
import { createConnection } from './db/connect'
import { initSearchbarShortcut, unregisterAllShortcuts } from './shortcut'
import { getStore, initStoreWatcher } from './store'
import { initTray, destroyTray } from './tray'

import { initLanguage } from '../i18n'

app.whenReady().then(() => {
  // 设置应用ID
  electronApp.setAppUserModelId('com.sim-snippet.app')

  // 监听窗口创建，优化窗口快捷键
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 初始化ipc
  initIpc()

  // 初始化语言
  initLanguage()

  // 初始化数据库连接
  createConnection()

  // 创建托盘
  initTray()

  // 创建搜索栏窗口
  initSearchbarWindow()

  // 初始化搜索框快捷键
  initSearchbarShortcut()

  // 初始化存储监听
  initStoreWatcher()

  // 设置开机启动
  const autoLaunch = getStore('general', 'autoLaunch')
  app.setLoginItemSettings({
    openAtLogin: autoLaunch,
    openAsHidden: autoLaunch && getStore('general', 'hideOnStartup')
  })

  // MacOS激活事件
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) initSearchbarWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('quit', () => {
  // 销毁系统托盘
  destroyTray()
  // 注销全局快捷键
  unregisterAllShortcuts()
})
