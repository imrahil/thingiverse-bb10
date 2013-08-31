call package_settings.bat

cd app
..\assets\zip.exe -r ..\bin-release\%TVIEWER_FILENAME%.zip *
cd ..
call "%WEBWORKS_DIR%\bbwp.bat" bin-release\%TVIEWER_FILENAME%.zip -o bin-release -g %KEYSTORE_PASS% -buildId 1

timeout /t -1

