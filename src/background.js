'use strict'

import { app, protocol, BrowserWindow, ipcMain, Tray, Menu, MenuItem } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'

// 主窗口
let win

// 托盘
let tray

// 是否关闭
let isQuit = false

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 600,
    focusable: true, // 聚焦
    frame: false, // 无外框架
    transparent: true, // 透明
    backgroundColor: '#00ffffff', // 防止开发者工具关闭会出现白边
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false, // 跨域
      enableRemoteModule: true // 可以使用remote
    },
    // eslint-disable-next-line no-undef
    icon: path.resolve(__static, 'logo.png')
  })
  // win.setAlwaysOnTop(true)
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  // 窗口关闭触发
  // 若isQuit为false, 则不退出, 只是缩小到托盘
  win.on('close', e => {
    if (isQuit) {
      win = null
    } else {
      e.preventDefault()
      win.hide()
    }
  })
}

/**
 * 创建托盘
 */
// eslint-disable-next-line no-unused-vars
let isLeaveTray = null
function createTray () {
  // eslint-disable-next-line no-undef
  tray = new Tray(path.resolve(__static, 'logo.png'))
  const contextMenu = Menu.buildFromTemplate([
    new MenuItem({
      label: '显示主程序',
      click: () => {
        if (win.isVisible()) {
          win.focus()
        } else {
          win.show()
        }
      }
    }),
    new MenuItem({
      label: '退出程序',
      click: () => {
        isQuit = true
        app.exit()
      }
    })
  ])
  tray.setToolTip('ZSpider')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (win.isVisible()) {
      win.focus()
    } else {
      win.show()
    }
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // 处理透明背景后, 出现黑边问题, 加个延时
  // https://github.com/electron/electron/issues/15947#issuecomment-571136404
  setTimeout(() => {
    createWindow()
    createTray()
  }, 400)
})

// 只允许单个实例
// https://www.electronjs.org/docs/api/app#apprequestsingleinstancelock
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (process.platform === 'win32') {
      console.log('window 准备执行网页端调起客户端逻辑')
      if (win) {
        if (win.isMinimized()) {
          win.restore()
        }
        if (win.isVisible()) {
          win.focus()
        } else {
          win.show()
        }
      }
    }
  })
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// 关闭窗口
ipcMain.on('close', (e, arg) => {
  app.quit()
})

// 最小化
ipcMain.on('min', (e, arg) => {
  win.minimize()
})

// 最大化
ipcMain.on('max', (e, arg) => {
  win.maximize()
})
