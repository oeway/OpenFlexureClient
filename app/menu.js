const { app, Menu } = require('electron')
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;
const path = require('path')

const openAboutWindow = require('about-window').default

const template = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About',
        click () {
          openAboutWindow({
            package_json_dir: path.join(__dirname, '..'),
            icon_path: path.join(__dirname, '/icons/png/512x512.png'),
            bug_report_url: "https://gitlab.com/openflexure/openflexure-microscope-jsclient/issues",
            homepage: "https://gitlab.com/openflexure/openflexure-microscope-jsclient",
          })
        }
      },
      {
        label: 'Check for Updates',
        click () {
          autoUpdater.checkForUpdates();
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })

  // Edit menu
  template[1].submenu.push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startspeaking' },
        { role: 'stopspeaking' }
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  ]
}
else {
  template.unshift({
    label: 'File',
    submenu: [
      { role: 'quit' }
    ]
  })
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)