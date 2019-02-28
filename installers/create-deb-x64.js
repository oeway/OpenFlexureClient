const installer = require('electron-installer-debian')
const path = require('path')

const options = {
  src: path.join(__dirname, '../release-builds/openflexure-microscope-js-linux-x64/'),
  dest: path.join(__dirname, '../release-builds/installers'),
  arch: 'amd64',
  icon: path.join(__dirname, '../icons/png/1024x1024.png'),
  categories: [
    "Science"
  ],
  lintianOverrides: [
    "changelog-file-missing-in-native-package"
  ]
}

console.log('Creating package (this may take a while)')

installer(options)
  .then(() => console.log(`Successfully created package at ${options.dest}`))
  .catch(err => {
    console.error(err, err.stack)
    process.exit(1)
  })