const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let url
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'DEV') {
  console.log("Loading from localhost")
  url = 'http://localhost:8080/'
} else {
  console.log("Loading from dist")
  url = `file://${process.cwd()}/dist/index.html`
}

app.on('ready', () => {
  let window = new BrowserWindow({width: 1124, height: 800})
  window.loadURL(url)
})