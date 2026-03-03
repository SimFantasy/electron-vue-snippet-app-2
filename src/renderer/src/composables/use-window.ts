import { WindowType } from '@shared/types'

export function useWindow() {
  /**
   * States
   */
  // 是否最大化
  const isMaximized = ref(false)
  // 是否置顶
  const isAlwaysOnTop = ref(false)

  /**
   * Actions
   */
  // 最小化窗口
  const minimizeWindow = () => {
    window.api.window.minimize()
  }

  // 最大化/还原窗口
  const toggleMaximizeWindow = () => {
    if (isMaximized.value) {
      window.api.window.restore()
    } else {
      window.api.window.maximize()
    }
  }

  // 关闭当前窗口
  const closeCurrentWindow = () => {
    window.api.window.closeCurrent()
  }

  // 关闭指定窗口
  const closeWindow = (type: WindowType) => {
    return window.api.window.close(type)
  }

  // 打开指定窗口
  const openWindow = (type: WindowType) => {
    return window.api.window.open(type)
  }

  // 切换窗口置顶状态
  const toggleAlwaysOnTop = async () => {
    const newValue = !isAlwaysOnTop.value
    const result = await window.api.window.setAlwaysOnTop(newValue)

    if (result) {
      isAlwaysOnTop.value = newValue
    }
    return result
  }

  // 设置窗口置顶状态
  const setAlwaysOnTop = async (enabled: boolean) => {
    const result = await window.api.window.setAlwaysOnTop(enabled)
    if (result) {
      isAlwaysOnTop.value = enabled
    }
    return result
  }

  return {
    // States
    isMaximized,
    isAlwaysOnTop,

    // Actions
    minimizeWindow,
    toggleMaximizeWindow,
    closeCurrentWindow,
    closeWindow,
    openWindow,
    toggleAlwaysOnTop,
    setAlwaysOnTop
  }
}
