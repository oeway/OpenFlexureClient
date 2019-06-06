const Store = require('electron-store');
const store = new Store();

if (store.has('drawCustomTitleBar') !== true) {
  // Default to false if on MacOS, otherwise true
  store.set('drawCustomTitleBar', (process.platform !== 'darwin') ? true : false)
}

module.exports.store = store