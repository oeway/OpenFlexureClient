// Load settings store from main process
const { store } = require('electron').remote.require('./store')

// Load extra modules we'll be using
const { Titlebar, Color } = require('custom-electron-titlebar');

// Only show custom menubar if current window has no frame
if (store.get('drawCustomTitleBar') == true) {
    new Titlebar({
        backgroundColor: Color.fromHex('#c5247f'),
        icon: './titleicon.svg'
    });
}

console.log("Loaded main.app.js for electron-renderer functionality")