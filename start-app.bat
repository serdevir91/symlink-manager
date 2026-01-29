@echo off
cd /d "%~dp0"
start /b "" cmd /c "npm run electron:dev"
exit
