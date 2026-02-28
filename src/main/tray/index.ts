import { Tray, nativeImage, app, Menu } from 'electron'
import { getWindowByType } from '../windows'
import { getStore } from '../store'
import icon from '../../../resources/icon.png?asset'

let tray: Tray | null = null

export function createTray() {
  // 防止重复创建
  if (tray) return

  // 创建图标
  const iconImage = nativeImage.createFromPath(icon)
  const trayIcon = iconImage.resize({ width: 16, height: 16 })

  tray = new Tray(trayIcon)

  // 设置工具提示
  tray.setToolTip('Sim Snippet App')

  // 创建右键菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '搜索',
      click: () => {
        const win = getWindowByType('searchbar')
        win.show()
        win.focus()
      }
    },
    {
      label: '代码片段管理',
      click: () => {
        const win = getWindowByType('manager')
        win.show()
        win.focus()
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  // 左键点击显示搜索框
  tray.on('click', () => {
    const win = getWindowByType('searchbar')
    win.show()
    win.focus()
  })
}

// 销毁系统托盘
export function destroyTray() {
  if (tray) {
    tray.destroy()
    tray = null
  }
}

// 获取系统托盘
export function getTray() {
  return tray
}

// 初始化系统托盘
export function initTray() {
  // 获取配置中是否显示托盘
  const showSystemTray = getStore('general', 'showSystemTray')
  if (showSystemTray) {
    createTray()
  }
}
