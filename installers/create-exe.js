const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const package = require('../package.json');

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')

  return Promise.resolve({
    setupExe: `${package.name}_${package.version}.exe`,
    appDirectory: path.join(__dirname, '../release-builds/openflexure-ev-win32-x64'),
    authors: 'OpenFlexure',
    noMsi: true,
    outputDirectory: path.join(__dirname, '../release-builds/installers', package.version),
    exe: 'openflexure-ev.exe',
    setupIcon: path.join(__dirname, '../icons/win/icon.ico'),
    certificateFile: "C:\\Certs\\BATH-OPEN-INSTRUMENTATION-GROUP.pfx"
  })
}