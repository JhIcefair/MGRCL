import { app, BrowserWindow } from 'electron'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { registerIpcHandlers } from './ipc'

const DEFAULT_WIDTH = 750
const DEFAULT_HEIGHT = 500
const MIN_WIDTH = 500
const MIN_HEIGHT = 350
const BACKGROUND_COLOR = '#FCE3F7'
const APP_ID = 'com.mgrcl.launcher'

let mainWindow: BrowserWindow | null = null

function resolveIconPath(): string | undefined {
  // out/main/index.js -> mgrcl/build/icon.ico
  const iconPath = join(__dirname, '../../../../build/icon.ico')
  return existsSync(iconPath) ? iconPath : undefined
}

function createWindow(): void {
  const iconPath = resolveIconPath()
  if (!iconPath) {
    console.warn('[mgrcl] build/icon.ico not found; window will use the Electron default icon')
  }

  const win = new BrowserWindow({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    // 不设置 maxWidth / maxHeight，也不调用 setAspectRatio：允许自由缩放。
    resizable: true,
    maximizable: true,
    frame: true,
    title: 'MGRCL',
    backgroundColor: BACKGROUND_COLOR,
    show: false,
    autoHideMenuBar: true,
    ...(iconPath ? { icon: iconPath } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false
    }
  })

  mainWindow = win

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    if (mainWindow === win) {
      mainWindow = null
    }
  })

  // 安全基线：禁止新窗口与页面跳转。
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  win.webContents.on('will-navigate', (event) => {
    event.preventDefault()
  })
  win.webContents.on('will-attach-webview', (event) => {
    event.preventDefault()
  })

  // 开发期按 F12 打开 DevTools；打包后不注册。
  if (!app.isPackaged) {
    win.webContents.on('before-input-event', (event, input) => {
      if (input.type === 'keyDown' && input.key === 'F12') {
        win.webContents.toggleDevTools()
        event.preventDefault()
      }
    })
  }

  const rendererUrl = process.env['ELECTRON_RENDERER_URL']
  if (rendererUrl) {
    void win.loadURL(rendererUrl)
  } else {
    void win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  if (process.platform === 'win32') {
    app.setAppUserModelId(APP_ID)
  }

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
