const convertToWindowsStore = require('electron-windows-store')
const path = require('path')
const package = require('../package.json');

convertToWindowsStore({
   containerVirtualization: false,
   inputDirectory: path.join(__dirname, '../release-builds/openflexure-microscope-js-win32-x64'),
   outputDirectory: path.join(__dirname, '../release-builds/installers'),
   assets: path.join(__dirname, '/appx/assets'),
   packageExecutable: 'app/openflexure-microscope-js.exe',
   packageName: 'OpenFlexureMicroscopeJS',
   packageVersion: `${package.version}.0`,
   packageDisplayName: package.productName,
   packageDescription: package.description,
   packageBackgroundColor: '#9C1561',
   publisherDisplayName: package.publisher,
   deploy: false,
   publisher: 'CN=bath-open-instrumentation-group',
   publisherDisplayName: "Bath Open Instrumentation Group",
   devCert: "C:\\Certs\\openflexure-microscope-js-appx\\openflexure-microscope-js-appx.pfx",
   windowsKit: 'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.17763.0\\x64'
})