import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { backgroundAPI } from './modules/background'
import { categoryAPI } from './modules/category'
import { codeAPI } from './modules/code'
import { databaseAPI } from './modules/database'
import { mouseAPI } from './modules/mouse'
import { shortcutAPI } from './modules/shortcut'
import { storeAPI } from './modules/store'
import { windowAPI } from './modules/window'
import { fontAPI } from './modules/font'

// Custom APIs for renderer
const api = {
  window: windowAPI,
  database: databaseAPI,
  category: categoryAPI,
  code: codeAPI,
  shortcut: shortcutAPI,
  store: storeAPI,
  background: backgroundAPI,
  mouse: mouseAPI,
  font: fontAPI
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
