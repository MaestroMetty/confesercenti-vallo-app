@echo off

docker context use default
if errorlevel 1 (
    echo Error: Failed to switch to Docker context 'default'
    exit /b 1
)
docker-compose -f compose.dev.yaml --env-file docker.local.env up -d --build