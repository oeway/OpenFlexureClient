// Required packages
const electron = require('electron')
const { dialog } = require('electron')
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;
const contextMenu = require('electron-context-menu')
const path = require('path')

// Attach settings store
const { store } = require('./store')

// Auto upadater 
autoUpdater.autoDownload = false;

autoUpdater.setFeedURL({
    provider: "generic",
    url: "https://gitlab.com/openflexure/openflexure-microscope-jsclient/-/jobs/artifacts/stable/raw?job=package"
});

autoUpdater.on('checking-for-update', function () {});

autoUpdater.on('update-available', function (info) {
  sendStatusToWindow('Update available.' + info)
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update available',
    message: 'A new version of OpenFlexure eV is available.',
    buttons: ['Download', 'Later']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    }
  })
});

autoUpdater.on('update-downloaded', function (info) {
  sendStatusToWindow('Update downloaded.' + info)
  dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: "Update downloaded",
      message: 'Please restart the application to apply the update.',
      buttons: ['Update', 'Later']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.quitAndInstall();
    }
  })
});

autoUpdater.on('update-not-available', function (info) {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', function (err) {
  sendStatusToWindow('Error in auto-updater.');
});

autoUpdater.on('download-progress', function (progressObj) {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

function sendStatusToWindow(message) {
    console.log(message);
}

// Set up the app
const app = electron.app
const BrowserWindow = electron.BrowserWindow

// Set the window content
let url = `file://${path.join(__dirname, '/dist/index.html')}`
let mainWindow

// Set the application menu
require('./menu.js')

// Handle redrawing the mainWindow
let recreatingWindowInProgress = false;

function toggleCustomTitleBar () {
  // Mark window as being recreated, to prevent stopping the application
  recreatingWindowInProgress = true

  // Invert the drawCustomTitleBar setting
  store.set('drawCustomTitleBar', !store.get('drawCustomTitleBar'))

  // Destroy old window
  mainWindow.destroy()
  // Create new window
  createWindow()

  // Mark window as no longer being recreated
  recreatingWindowInProgress = false
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: !store.get('drawCustomTitleBar'),
    width: 1124, 
    height: 800,
    icon: path.join(__dirname, '/icons/png/64x64.png')
  })

  // Make a context menu
  contextMenu({
    showCopyImageAddress: true,
    showSaveImageAs: true,
    showInspectElement: false,
  });

  // Load window contents
  mainWindow.loadURL(url)

  // Check for updates
  autoUpdater.checkForUpdates();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null  // Dereference the window object
  })
}

// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if ((process.platform !== 'darwin') && recreatingWindowInProgress != true) {
    app.quit()
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})

// Export toggleCustomTitleBar for use in ./menu.js
module.exports.toggleCustomTitleBar = toggleCustomTitleBar