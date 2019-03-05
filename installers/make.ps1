echo "Setting up..."
$here = $PSScriptRoot
$root = "$here/.."

$package = Get-Content "$root/package.json" | Out-String | ConvertFrom-Json
$version = $package.version
$name = $package.name

$wslhere = (wsl wslpath -a ("$here" -Replace '\\','\\'))
$wslroot = (wsl wslpath -a ("$root" -Replace '\\','\\'))

mkdir "$root/release-builds/dist/$version/"

echo "Gzipping PWA..."
wsl tar -czvf "$wslroot/release-builds/dist/$version/${name}_${version}_pwa.tar.gz" -C "$wslroot/dist" .

echo "Building deb packages..."
wsl node "$wslhere/create-deb-x64.js"
wsl node "$wslhere/create-deb-arm.js"

echo "Building Windows installer..."
node "$here\create-exe.js"

echo "Building Windows appx package..."
node "$here\create-appx.js"