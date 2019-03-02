const convertToWindowsStore = require('electron-windows-store')
const path = require('path')
const package = require('../package.json');

convertToWindowsStore({
   containerVirtualization: false,
   inputDirectory: path.join(__dirname, '../release-builds/openflexure-ev-win32-x64'),
   outputDirectory: path.join(__dirname, '../release-builds/installers'),
   assets: path.join(__dirname, '/appx/assets'),
   identityName: '60425J.T.Collins.OpenFlexureeV',
   packageExecutable: 'app/openflexure-ev.exe',
   packageName: 'OpenFlexureEV',
   packageVersion: `${package.version}.0`,
   packageDisplayName: package.productName,
   packageDescription: package.description,
   packageBackgroundColor: '#9C1561',
   publisherDisplayName: 'J. T. Collins',
   deploy: false,
   publisher: 'CN=CC867BEF-0715-4D48-8035-8881993DBB68',
   devCert: "C:\\Certs\\CC867BEF-0715-4D48-8035-8881993DBB68.pfx",
   windowsKit: 'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.17763.0\\x64'
})