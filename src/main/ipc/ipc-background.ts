import type { WindowType } from '@shared/types'
import { IPC_KEYS } from '@shared/constants'

import { join } from 'node:path'
import { mkdir, copyFile, unlink } from 'fs/promises'
import { ipcMain, app, dialog } from 'electron'

import { getStore, setStore } from '../store'

// 背景图片存储目录
const BACKGROUND_DIR = join(app.getPath('userData'), 'images')

/**
 * 初始化 背景图 IPC 通信
 */
export function initBackgroundIpc() {
  // 选择并保存背景图片
  ipcMain.handle(IPC_KEYS.BACKGROUND_SELECT_IMAGE, async (_, type: WindowType): Promise<string | null> => {
    // 弹出文件选择对话框
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }],
      title: '选择背景图片'
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    const originalPath = result.filePaths[0]

    try {
      // 生成唯一的文件名
      const ext = originalPath.split('.').pop()
      const filename = `bg_${type}_${Date.now()}.${ext}`
      const destPath = join(BACKGROUND_DIR, filename)

      // 确保图片目录存在
      await mkdir(BACKGROUND_DIR, { recursive: true })

      // 复制图片到目标目录
      await copyFile(originalPath, destPath)

      // 更新Store中的配置
      const currentBackground = getStore('appearance', type)
      setStore('appearance', type, { ...currentBackground, backgroundImage: destPath })

      return destPath
    } catch (error) {
      console.log('保存背景图片失败：', error)
      return null
    }
  })

  // 删除背景图片
  ipcMain.handle(IPC_KEYS.BACKGROUND_DELETE_IMAGE, async (_, type: WindowType): Promise<boolean> => {
    try {
      // 获取当前图片路径
      const currentBackground = getStore('appearance', type)
      const currentPath = currentBackground.backgroundImage

      if (currentPath) {
        // 删除图片文件
        await unlink(currentPath as string)
      }

      // 清空Store中的配置
      setStore('appearance', type, { ...currentBackground, backgroundImage: '' })

      return true
    } catch (error) {
      console.log('删除背景图片失败：', error)
      return false
    }
  })

  // 获取当前背景图片路径
  ipcMain.handle(IPC_KEYS.BACKGROUND_GET_IMAGE, async (_, type: WindowType): Promise<string> => {
    try {
      const currentBackground = getStore('appearance', type)
      return currentBackground.backgroundImage || ''
    } catch (error) {
      console.log('[IPC] 获取当前背景图片路径失败:', error)
      return ''
    }
  })
}
