const electron = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let url = 'http://127.0.0.1:8080/'

// Set the application menu
require('./menu.js')

app.on('ready', () => {
  let window = new BrowserWindow({
    width: 1124,
    height: 800,
    icon: path.join(__dirname, '/icons/png/64x64.png')
  })

  contextMenu({
    showCopyImageAddress: true,
    showSaveImageAs: true,
    showInspectElement: true,
  });

  window.loadURL(url)
})
