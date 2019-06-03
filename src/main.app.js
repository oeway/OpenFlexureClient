import { Titlebar, Color } from 'custom-electron-titlebar'

// Only show custom menubar for Windows or Linux
if ((process.platform !== 'darwin')) {
    new Titlebar({
        backgroundColor: Color.fromHex('#c5247f')
    });
}

console.log("Loaded main.app.js for electron-renderer functionality")