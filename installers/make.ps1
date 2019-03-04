$here = $PSScriptRoot

echo "Building deb packages..."
$wslhere = (wsl wslpath -a ("$here" -Replace '\\','\\'))

wsl node "$wslhere/create-deb-x64.js"
wsl node "$wslhere/create-deb-arm.js"

echo "Building Windows installer..."
node "$here\create-exe.js"

echo "Building Windows appx package..."
node "$here\create-appx.js"