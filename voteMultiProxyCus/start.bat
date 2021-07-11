echo off
:Restart
taskkill /f /im Network_game.exe
color 0a

cls
ECHO.
ECHO.                     Program is Running .....                           
ECHO.  

:call
start "" "Network_game.exe"

:timeout
TIMEOUT 70 /NOBREAK
cls


:end
goto Restart
pause