 //handle setupevents as quickly as possible
 const setupEvents = require('./installers/setupEvents')
 if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
 }

// Required packages
const electron = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')

// Set up the app
const app = electron.app
const BrowserWindow = electron.BrowserWindow

// Set the window content
let url = `file://${path.join(__dirname, '/dist/index.html')}`
let mainWindow

// Set the application menu
require('./menu.js')

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1124, 
    height: 800,
    icon: path.join(__dirname, '/icons/png/64x64.png')
  })

  contextMenu({
    showCopyImageAddress: true,
    showSaveImageAs: true,
    showInspectElement: false,
  });

  mainWindow.loadURL(url)

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})