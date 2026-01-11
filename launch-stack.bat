@echo off
setlocal EnableDelayedExpansion

if "%~1"=="" (
    echo Error: Docker context is required
    echo Usage: launch-stack.bat ^<docker-context^> [full-stack]
    exit /b 1
)

docker context use %1
if errorlevel 1 (
    echo Error: Failed to switch to Docker context '%1'
    exit /b 1
)

echo Ensuring overlay networks exist...

:: Loop through required overlay networks
for %%N in (confesercenti-vallo-pwa-db) do call :ensure_network %%N

goto :deploy

:ensure_network
docker network inspect %1 >nul 2>&1
if errorlevel 1 (
    echo Creating network %1...
    docker network create --driver overlay %1 >nul 2>&1
    if errorlevel 1 (
        echo [Warning] Could not create network %1 (might already exist)
    )
) else (
    echo Network %1 already exists.
)
exit /b

:deploy
if "%~2"=="full-stack" (
    echo Deploying full stack including database...
    docker stack deploy -c ./compose.prod.yaml confesercenti-vallo-pwa --with-registry-auth
) else (
    echo Redeploying app service...
    for /f "tokens=* delims=" %%a in ('findstr /C:"image: ghcr.io/" compose.prod.yaml') do (
        set "FULL_LINE_APP=%%a"
    )
    set "APP_IMAGE=!FULL_LINE_APP:image: =!"
    set "APP_IMAGE=!APP_IMAGE: =!"
    for /f "tokens=2 delims=:" %%v in ("!APP_IMAGE!") do (
        set "APP_VERSION=%%v"
    )

    echo Using app image: !APP_IMAGE!
    echo App version: !APP_VERSION!

    echo Pulling latest app image...
    docker pull !APP_IMAGE!

    echo Updating confesercenti-vallo-pwa_app service...
    docker service update --image !APP_IMAGE! --force confesercenti-vallo-pwa_app
)

endlocal

