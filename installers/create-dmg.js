const createDMG = require('electron-installer-dmg')
const path = require('path')
const package = require('../package.json');

var opts = {
  appPath: path.join(__dirname, '../release-builds/openflexure-ev-darwin-x64/openflexure-ev.app'),
  name: package.productName,
  icon: path.join(__dirname, '../icons/mac/icon.icns'),
  out: path.join(__dirname, '../release-builds/installers', package.version)
}

createDMG(opts, function done (err) {
  if (err) {
    console.log(`Error creating dmg: ${err}`)
  }
  else {
    console.log("Done")
  }
 })