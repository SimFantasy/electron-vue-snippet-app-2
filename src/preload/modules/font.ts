import { IPC_KEYS } from '@shared/constants'
import { ipcRenderer } from 'electron'

/**
 * 字体模块管理
 */
export const fontAPI = {
  getSystemFonts: () => ipcRenderer.invoke(IPC_KEYS.FONT_GET_SYSTEM_FONTS)
}
