import { IPC_KEYS } from '@shared/constants'

import { ipcMain } from 'electron'
import { getFonts } from 'font-list'

/**
 *  初始化字体 IPC 通信
 */
export function initFontIpc() {
  ipcMain.handle(IPC_KEYS.FONT_GET_SYSTEM_FONTS, async () => {
    try {
      // 获取系统字体列表
      const fonts = await getFonts({ disableQuoting: true })
      // 去重并排序
      return [...new Set(fonts)].sort()
    } catch (error) {
      console.log('[IPC] 获取系统字体失败:', error)
      return []
    }
  })
}
