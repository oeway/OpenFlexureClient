$silentArgs = '/S'
$packageName = 'openflexure-ev'
$fileType = 'exe'

$packagepath = Join-Path -Path $PSScriptRoot -ChildPath '..\'
$packageJson = Join-Path -Path $packagepath -ChildPath '\package.json'
$outpath = Join-Path -Path $packagepath -ChildPath 'release-builds\choco'

echo $packagepath
echo $outpath

If(!(test-path $outpath))
{
  New-Item -ItemType Directory -Force -Path $outpath
}

# Get version from package.json
$FullVersion = (Get-Content $packageJson) -join "`n" | ConvertFrom-Json | Select -ExpandProperty "version"
$MajVer, $MinVer = $FullVersion.Split("-")  # Split version number from beta string
$MinVer = $MinVer.Replace(".",  "")  # Convert symver into nuspec ver
$version = $MajVer + "-" + $MinVer

$InstURL = "$Env:CI_JOB_URL/artifacts/browse/release-builds/openflexure-ev-win.exe"

$NuSpec = @"
<?xml version="1.0"?>
<package xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <metadata>
    <id>$packageName</id>
    <title>OpenFlexure eV</title>
    <version>$Version</version>
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
"@

echo $NuSpec | Out-File -force -FilePath "$outpath\openflexure-ev.nuspec"

$InstPS1 = "Install-ChocolateyPackage '$packageName' '$fileType' '$silentArgs' '$InstURL'"

$toolspath = "$outpath\tools"
If(!(test-path $toolspath))
{
  New-Item -ItemType Directory -Force -Path $toolspath
}
echo $InstPS1 | Out-File -force -FilePath "$toolspath\chocolateyInstall.ps1"

choco pack --outputdirectory $outpath "$outpath\openflexure-ev.nuspec"