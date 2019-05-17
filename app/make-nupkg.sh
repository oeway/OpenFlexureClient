#!/bin/bash

packageName='openflexure-ev'

scriptPath=$(dirname "$0")
packagePath="$(dirname "$scriptPath")"
packageJson="$packagePath/package.json"

installerPath="$packagePath/openflexure-ev-win.exe"
installerMd5=`md5sum ${installerPath} | awk '{ print $1 }'`
echo "$installerMd5"

outpath="$packagePath/release-builds/choco"
toolspath="$outpath/tools"
mkdir -p "$toolspath"

echo "$scriptPath"
echo "$packageJson"
echo "$outpath"

# Get package version from package.json
packageVersion=$(grep version < "$packageJson" | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d ':space:')

echo "Package version: $packageVersion"

# Convert into a nupkg-safe version string
majVer="$(echo "$packageVersion" | cut -d'-' -f1)"
minVer="$(echo "$packageVersion" | cut -d'-' -f2)"

if [ "$majVer" = "$minVer" ]; then
  version="$majVer"
else
  minVer="${minVer//.}"
  version="$majVer-$minVer"  
fi

echo "Nupkg version: $version"

# Build installer URL
pipelineURL="$CI_PROJECT_URL/-/jobs/artifacts/$CI_COMMIT_REF_NAME/raw"
instURL="$pipelineURL/openflexure-ev-win.exe?job=package:win32"
nuspecURL="$CI_JOB_URL/artifacts/browse"

echo "$instURL"

# Build nuspec
cat > "$outpath/openflexure-ev.nuspec" <<- EOL
<?xml version="1.0"?>
<package xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <metadata>
    <id>$packageName</id>
    <title>OpenFlexure eV</title>
    <version>$version</version>
    <authors>OpenFlexure</authors>
    <owners>Joel Collins</owners>
    <summary>OpenFlexure Microscope client</summary>
    <description>An electron-based user client for the OpenFlexure Microscope Server</description>

    <projectUrl>https://www.openflexure.org/</projectUrl>
    <docsUrl>https://www.openflexure.org/projects/microscope/</docsUrl>
    <bugTrackerUrl>https://gitlab.com/openflexure/openflexure-microscope-jsclient/issues</bugTrackerUrl>

    <projectSourceUrl>https://gitlab.com/openflexure/openflexure-microscope-jsclient/</projectSourceUrl>
    <packageSourceUrl>$nuspecURL</packageSourceUrl>
    
    <tags>openflexure microscope ev</tags>
    <licenseUrl>https://gitlab.com/openflexure/openflexure-microscope-jsclient/raw/master/LICENSE</licenseUrl>
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
    <iconUrl>https://build.openflexure.org/openflexure_ev/512x512.png</iconUrl>
  </metadata>
  <files>
    <file src="tools/**" target="tools" />
  </files>
</package>
EOL

# Build installer PS1 content
cat > "$toolspath/chocolateyInstall.ps1" <<- EOL
\$ErrorActionPreference = "Stop";
\$toolsDir   = "\$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
\$url        = "$instURL"

\$packageArgs = @{
  packageName   = "openflexure-ev"
  unzipLocation = \$toolsDir
  fileType      = "exe"
  url           = \$url
  url64bit      = \$url

  softwareName  = "OpenFlexure eV"

  checksum      = "${installerMd5}"
  checksumType  = "md5"

  silentArgs   = "/S"
}

Install-ChocolateyPackage @packageArgs

EOL