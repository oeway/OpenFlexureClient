silentArgs='/S'
packageName='openflexure-ev'
fileType='exe'

scriptPath=`dirname $0`
packagePath="$(dirname "$scriptPath")"
packageJson="$packagePath/package.json"
outpath="$packagePath/release-builds/choco"
toolspath="$outpath/tools"
mkdir -p $toolspath

echo $scriptPath
echo $packageJson
echo $outpath

# Get package version from package.json
packageVersion=$(cat $packageJson \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Convert into a nupkg-safe version string
majVer="$(echo $packageVersion | cut -d'-' -f1)"
minVer="$(echo $packageVersion | cut -d'-' -f2)"
minVer="${minVer//.}"
version="$majVer-$minVer"

echo $version

# Build installer URL
instURL="$CI_JOB_URL/artifacts/browse/release-builds/openflexure-ev-win.exe"
echo $instURL

# Build nuspec
cat > "$outpath/openflexure-ev.nuspec" <<- EOL
<?xml version="1.0"?>
<package xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <metadata>
    <id>$packageName</id>
    <title>OpenFlexure eV</title>
    <version>$version</version>
    <authors>OpenFlexure</authors>
    <owners>Bath Open Instrumentation Group</owners>
    <summary>OpenFlexure Microscope client</summary>
    <description>An electron-based user client for the OpenFlexure Microscope Server</description>
    <projectUrl>https://www.openflexure.org/</projectUrl>
    <docsUrl>https://www.openflexure.org/projects/microscope/</docsUrl>
    <bugTrackerUrl>https://gitlab.com/openflexure/openflexure-microscope-jsclient/issues</bugTrackerUrl>
    <projectSourceUrl>https://gitlab.com/openflexure/openflexure-microscope-jsclient/</projectSourceUrl>
    
    <packageSourceUrl>https://gitlab.com/openflexure/openflexure-microscope-jsclient/</packageSourceUrl>
    
    <tags>openflexure microscope ev</tags>
    <licenseUrl>https://gitlab.com/openflexure/openflexure-microscope-jsclient/raw/master/LICENSE</licenseUrl>
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
    <iconUrl>https://gitlab.com/openflexure/openflexure-microscope-jsclient/raw/master/app/icons/png/512x512.png</iconUrl>
  </metadata>
  <files>
    <file src="tools\**" target="tools" />
  </files>
</package>
EOL

# Build installer PS1 content
instPS1="Install-ChocolateyPackage $packageName $fileType $silentArgs $instURL"
echo $instPS1 > "$toolspath/chocolateyInstall.ps1"

# Build nupkg
# choco pack --allow-unofficial --outputdirectory $outpath "$outpath/openflexure-ev.nuspec"