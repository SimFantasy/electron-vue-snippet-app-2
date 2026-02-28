import { initWindowIpc } from './ipc-window'
import { initShortcutIpc } from './ipc-shortcut'
import { initStoreIpc } from './ipc-store'
import { initDatabaseIpc } from './ipc-database'
import { initCategoryIpc } from './ipc-category'
import { initCodeIpc } from './ipc-code'
import { initBackgroundIpc } from './ipc-background'
import { initIpcMouse } from './ipc-mouse'

/**
 * 初始化全部IPC通信
 */
export const initIpc = () => {
  initDatabaseIpc()
  initWindowIpc()
  initStoreIpc()
  initShortcutIpc()
  initCategoryIpc()
  initCodeIpc()
  initBackgroundIpc()
  initIpcMouse()
}
