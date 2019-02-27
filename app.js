const electron = require('electron')
const contextMenu = require('electron-context-menu');
const path = require('path')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const isDev = (process.env.NODE_ENV === 'DEV');

let url = `file://${path.join(__dirname, '/dist/index.html')}`

app.on('ready', () => {
  let window = new BrowserWindow({
    width: 1124, 
    height: 800,
    icon: path.join(__dirname, '/src/assets/icons/png/64x64.png')
  })

  window.setMenu(null);

  contextMenu({
    showCopyImageAddress: true,
    showSaveImageAs: true,
    showInspectElement: isDev,
  });

  window.loadURL(url)
})