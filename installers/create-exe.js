const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')

  return Promise.resolve({
    appDirectory: path.join(__dirname, '../release-builds/openflexure-ev-win32-x64'),
    authors: 'OpenFlexure',
    noMsi: true,
    outputDirectory: path.join(__dirname, '../release-builds/installers'),
    exe: 'openflexure-ev.exe',
    setupExe: 'OpenFlexureEvInstaller.exe',
    setupIcon: path.join(__dirname, '../icons/win/icon.ico'),
    certificateFile: "C:\\Certs\\BATH-OPEN-INSTRUMENTATION-GROUP.pfx"
  })
}