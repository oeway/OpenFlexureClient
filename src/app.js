const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const contextMenu = require('electron-context-menu');

const isDev = process.env.NODE_ENV === 'DEV';
var isWin = process.platform === "win32";


let url
console.log(process.env.NODE_ENV)
if (isDev) {
  console.log("Loading from localhost")
  url = 'http://localhost:8080/'
} else {
  console.log("Loading from dist")
  url = `file://${process.cwd()}/dist/index.html`
}

app.on('ready', () => {
  let window = new BrowserWindow({width: 1124, height: 800})
  window.setMenu(null);

  contextMenu({
    showCopyImageAddress: true,
    showSaveImageAs: true,
    showInspectElement: isDev,
  });

  window.loadURL(url)
})