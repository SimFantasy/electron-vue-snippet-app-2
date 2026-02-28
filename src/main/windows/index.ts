import type { CustomSearchbarPosition, CustomWindowOptions, SearchbarPosition, WindowType } from '@shared/types'

import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent, screen } from 'electron'
import { createWindow } from './create-window'
import { getStore } from '../store'

// 自定义窗口配置
export const options: CustomWindowOptions = {
  searchbar: {
    id: 0,
    options: {
      initShow: true,
      openDevTools: false
    },
    settingsApplied: false
  },
  manager: {
    id: 0,
    options: {
      initShow: false,
      openDevTools: false,
      width: 1356,
      height: 960,
      hash: '/#/manage/codes'
    }
  }
}

// 应用窗口配置
function applyWindowSettings(win: BrowserWindow, type: WindowType) {
  // 是否应用窗口配置
  if (type !== 'searchbar' || options[type].settingsApplied) return
  options[type].settingsApplied = true

  // 应用搜索框配置
  if (type === 'searchbar') {
    // 修改ready-to-show事件处理
    win.on('ready-to-show', () => {
      // 是否启动时显示
      const hideOnStartup = getStore('general', 'hideOnStartup')
      if (!hideOnStartup) {
        win.show()
      }
    })

    // 失焦事件处理
    win.on('blur', () => {
      // 是否失焦自动隐藏
      const autoHideOnBlur = getStore('general', 'autoHideOnBlur')
      const alwaysOnTop = getStore('general', 'searchbarAlwaysOnTop')
      // 配置了失焦 并且 窗口可见 并且 没有置顶时 隐藏窗口
      if (autoHideOnBlur && win.isVisible() && !alwaysOnTop) {
        win.hide()
      }
    })

    // 初始置顶状态
    const alwaysOnTop = getStore('general', 'searchbarAlwaysOnTop')
    win.setAlwaysOnTop(alwaysOnTop)

    // 设置窗口位置
    const position = getStore('general', 'searchbarPosition')
    const customPosition = getStore('general', 'customSearchbarPosition')

    setSearchbarPosition(win, position, customPosition)
  }
}

// 设置搜索框窗口位置
function setSearchbarPosition(win: BrowserWindow, position: SearchbarPosition, customPosition: CustomSearchbarPosition) {
  const { width, height } = win.getBounds()
  const { workArea } = screen.getPrimaryDisplay()

  let x = 0
  let y = 0

  switch (position) {
    case 'center':
      x = Math.round((workArea.width - width) / 2) + workArea.x
      y = Math.round((workArea.height - height) / 2) + workArea.y
      break
    case 'top-left':
      x = workArea.x + 20
      y = workArea.y + 20
      break
    case 'top-right':
      x = workArea.x + workArea.width - width - 20
      y = workArea.y + 20
      break
    case 'top-center':
      x = Math.round((workArea.width - width) / 2) + workArea.x
      y = workArea.y + 20
      break
    case 'custom':
      x = customPosition.x
      y = customPosition.y
      break
  }

  // 边界检查
  const minMargin = 20 // 最小边距
  const maxX = workArea.x + workArea.width - width - minMargin
  const maxY = workArea.y + workArea.height - height - minMargin

  // 确保窗口不会完全移出屏幕
  x = Math.max(workArea.x + minMargin, Math.min(x, maxX))
  y = Math.max(workArea.y + minMargin, Math.min(y, maxY))

  win.setPosition(x, y)
}

// 根据窗口名称获取窗口实例
export const getWindowByType = (type: WindowType) => {
  // 根据窗口id获取窗口实例
  let win = BrowserWindow.fromId(options[type].id)

  // 如果窗口实例不存在，则创建窗口
  if (!win) {
    win = createWindow(options[type].options)
    options[type].id = win.id

    // 为新窗口应用配置
    applyWindowSettings(win, type)
  }

  return win
}

// 通过PIC触发事件时，获取与该事件相关的窗口实例
export const getWindowByEvent = (event: IpcMainEvent | IpcMainInvokeEvent) => {
  return BrowserWindow.fromWebContents(event.sender)
}

// 初始化搜索框窗口
export const initSearchbarWindow = () => {
  getWindowByType('searchbar')
}
