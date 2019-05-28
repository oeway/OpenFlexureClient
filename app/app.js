// Required packages
const electron = require('electron')
const { dialog } = require('electron')
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;
const contextMenu = require('electron-context-menu')
const path = require('path')

// Auto upadater 
autoUpdater.autoDownload = false;

autoUpdater.setFeedURL({
    provider: "generic",
    url: "https://gitlab.com/openflexure/openflexure-microscope-jsclient/-/jobs/artifacts/master/raw?job=package"
});

autoUpdater.on('checking-for-update', function () {
    sendStatusToWindow('Checking for update...');
});

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
let url = `file://${path.join(__dirname, '../dist/index.html')}`
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
  autoUpdater.checkForUpdates();

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