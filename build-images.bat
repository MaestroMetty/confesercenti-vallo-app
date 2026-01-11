@echo off

docker context use default
if errorlevel 1 (
    echo Error: Failed to switch to Docker context 'default'
    exit /b 1
)

set version=%1

if "%version%"=="" (
    echo "Version is not set"
    echo "Usage: build-images.bat <app_version>"
    exit 1
)

echo "Building confesercenti-vallo-pwa image"
docker build -f Dockerfile.prod -t ghcr.io/maestrometty/confesercenti-vallo-pwa:%version% .
echo "Pushing confesercenti-vallo-pwa image"
docker push ghcr.io/maestrometty/confesercenti-vallo-pwa:%version%

echo "Done"
