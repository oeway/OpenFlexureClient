const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const contextMenu = require('electron-context-menu');

let url = 'http://localhost:8080/'

app.on('ready', () => {
  let window = new BrowserWindow({
    width: 1124, 
    height: 800,
    // Remove the window frame from windows applications
    //frame: false,
    // Hide the titlebar from MacOS applications while keeping the stop lights
    //titleBarStyle: 'hidden', // or 'customButtonsOnHover',
  })
  //window.setMenu(null);

  contextMenu({
    showCopyImageAddress: true,
    showSaveImageAs: true,
    showInspectElement: true,
  });

  window.loadURL(url)
})