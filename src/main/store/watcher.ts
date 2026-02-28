/**
 * Store 配置监听器
 */
import type { GeneralSettings, ShortcutSettings } from '@shared/types'

import { app, screen } from 'electron'
import { onStoreChange, getStore } from './index'
import { createTray, destroyTray } from '../tray'
import { getWindowByType } from '../windows'
import { registerSearchbarShortcut } from '../shortcut'

// 初始化所有配置监听器
export function initStoreWatcher() {
  // 监听通用设置
  watchGeneralSettings()

  // 监听快捷键设置
  watchShortcutSettings()
}

// 监听通用设置
function watchGeneralSettings() {
  // 监听整个general 配置对象变化
  onStoreChange('general', (newValue: GeneralSettings, oldValue: GeneralSettings) => {
    // 开机启动配置变化
    if (newValue.autoLaunch !== oldValue.autoLaunch) {
      updateAutoLaunch(newValue.autoLaunch)
    }

    // 系统托盘显示配置变化
    if (newValue.showSystemTray !== oldValue.showSystemTray) {
      updateTrayVisibility(newValue.showSystemTray)
    }

    // 搜索框置顶配置变化
    if (newValue.searchbarAlwaysOnTop !== oldValue.searchbarAlwaysOnTop) {
      updateAlwaysOnTop(newValue.searchbarAlwaysOnTop)
    }

    // 搜索框位置配置变化
    if (
      newValue.searchbarPosition !== oldValue.searchbarPosition ||
      JSON.stringify(newValue.customSearchbarPosition) !== JSON.stringify(oldValue.customSearchbarPosition)
    ) {
      updateSearchbarPosition(newValue.searchbarPosition, newValue.customSearchbarPosition)
    }

    // 失焦自动隐藏配置变化
    if (newValue.autoHideOnBlur !== oldValue.autoHideOnBlur) {
      updateAutoHideOnBlur(newValue.autoHideOnBlur)
    }
  })
}

// 监听快捷键设置变化
function watchShortcutSettings() {
  onStoreChange('shortcut', (newvalue: ShortcutSettings, oldvalue: ShortcutSettings) => {
    // 监听搜索框快捷键配置变化
    if (newvalue.searchbarShortcut !== oldvalue.searchbarShortcut) {
      updateSearchbarShortcut(newvalue.searchbarShortcut)
    }
  })
}

// 更新开机启动设置
function updateAutoLaunch(enabled: boolean) {
  console.log(`[StoreWatcher] 更新开机启动：`, enabled)

  app.setLoginItemSettings({
    openAtLogin: enabled,
    openAsHidden: enabled && getStore('general', 'hideOnStartup')
  })
}

// 更新系统托盘显示状态
function updateTrayVisibility(visible: boolean) {
  console.log('[StoreWatcher] 更新系统托盘显示：', visible)

  if (visible) {
    createTray()
  } else {
    destroyTray()
  }
}

// 更新窗口置顶状态
function updateAlwaysOnTop(enabled: boolean) {
  console.log('[StoreWatcher] 更新置顶状态:', enabled)

  const searchbar = getWindowByType('searchbar')
  searchbar.setAlwaysOnTop(enabled)
}

// 更新搜索框位置
function updateSearchbarPosition(
  position: GeneralSettings['searchbarPosition'],
  customPosition: GeneralSettings['customSearchbarPosition']
) {
  console.log('[StoreWatcher] 更新搜索框位置:', position)

  const searchbar = getWindowByType('searchbar')
  const { width, height } = searchbar.getBounds()

  // 获取主显示器的工作区域（排除任务栏）
  const { workArea } = screen.getPrimaryDisplay()

  let x = 0
  let y = 0

  // 根据位置类型计算坐标
  switch (position) {
    case 'center':
      // 屏幕正中间
      x = Math.round((workArea.width - width) / 2) + workArea.x
      y = Math.round((workArea.height - height) / 2) + workArea.y
      break

    case 'top-left':
      // 左上角，留一些边距
      x = workArea.x + 20
      y = workArea.y + 20
      break

    case 'top-right':
      // 右上角
      x = workArea.x + workArea.width - width - 20
      y = workArea.y + 20
      break

    case 'top-center':
      // 顶部居中
      x = Math.round((workArea.width - width) / 2) + workArea.x
      y = workArea.y + 20
      break

    case 'custom':
      // 使用用户自定义坐标
      x = customPosition.x
      y = customPosition.y
      break

    default:
      // 默认居中
      x = Math.round((workArea.width - width) / 2) + workArea.x
      y = Math.round((workArea.height - height) / 2) + workArea.y
  }

  // 设置窗口位置
  searchbar.setPosition(x, y)
}

// 搜索框失焦处理方法
function handleSearchbarBlur() {
  const searchbar = getWindowByType('searchbar')

  // 如果窗口可见且没有置顶时，隐藏窗口
  if (searchbar.isVisible() && !searchbar.isAlwaysOnTop()) {
    searchbar.hide()
  }
}

// 更新失焦自动隐藏
function updateAutoHideOnBlur(enabled: boolean) {
  console.log('[StoreWatcher] 更新失焦自动隐藏：', enabled)

  const searchbar = getWindowByType('searchbar')

  if (enabled) {
    // 失焦事件监听
    searchbar.on('blur', handleSearchbarBlur)
  } else {
    searchbar.off('blur', handleSearchbarBlur)
  }
}

// 更新搜索框快捷键
function updateSearchbarShortcut(shortcut: string) {
  console.log('[StoreWatcher] 更新搜索框快捷键:', shortcut)

  // 导入快捷键注册函数
  registerSearchbarShortcut(shortcut)
}
