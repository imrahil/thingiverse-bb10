call package_settings.bat

cd app
..\assets\zip.exe -r ..\bin-release\%TVIEWER_FILENAME%.zip *
cd ..
call "%WEBWORKS_DIR%\bbwp.bat" bin-release\%TVIEWER_FILENAME%.zip -o bin-release

call "%WEBWORKS_DIR%\dependencies\tools\bin\blackberry-deploy.bat" -installApp -launchApp -device %TVIEWER_DEVICE% -password %TVIEWER_DEVICE_PASS% bin-release/device/%TVIEWER_FILENAME%.bar

timeout /t -1

