const convertToWindowsStore = require('electron-windows-store')
const path = require('path')

convertToWindowsStore({
   containerVirtualization: false,
   inputDirectory: path.join(__dirname, '../release-builds/openflexure-microscope-js-win32-x64'),
   outputDirectory: path.join(__dirname, '../release-builds/installers'),
   assets: path.join(__dirname, '/appx/assets'),
   manifest: path.join(__dirname, '/appx/AppXManifest.xml'),
   packageName: 'OpenFlexureMicroscopeJS',
   deploy: false,
   publisher: 'CN=bath-open-instrumentation-group',
   publisherDisplayName: "Bath Open Instrumentation Group",
   devCert: "C:\\Users\\jtc92\\AppData\\Roaming\\electron-windows-store\\bath-open-instrumentation-group\\bath-open-instrumentation-group.pfx",
   windowsKit: 'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.17763.0\\x64'
})