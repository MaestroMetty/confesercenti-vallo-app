# Production Secrets (Docker Swarm)

This project uses Docker Swarm external secrets for production deployment.

## How It Works

1. Secrets are created in Docker Swarm and mounted to `/run/secrets/` in the container
2. The entrypoint script (`docker-entrypoint.sh`) reads these files
3. Environment variables are set from the secret values
4. The application reads from `process.env` as usual

## Prerequisites

Initialize Docker Swarm if not already done:
```bash
docker swarm init
```

## Create Secrets

Create the following Docker secrets using the commands below:

### 1. Database User
```bash
echo "your_db_username" | docker secret create confesercenti_vallo_db_user -
```

### 2. Database Password
```bash
echo "your_secure_db_password" | docker secret create confesercenti_vallo_db_password -
```

### 3. Database Name
```bash
echo "confesercenti_vallo_db" | docker secret create confesercenti_vallo_db_name -
```

### 4. JWT Secret
```bash
# Generate a secure random secret
openssl rand -base64 32 | docker secret create confesercenti_vallo_jwt_secret -
```

### 5. App URL
```bash
echo "https://your-domain.com" | docker secret create confesercenti_vallo_app_url -
```

## Create External Networks

```bash
docker network create --driver overlay traefik-public
docker network create --driver overlay app-db
```

## Generate Secure Secrets

You can generate secure random secrets using:

**Linux/macOS:**
```bash
openssl rand -base64 32
```

**PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

## Deploy the Stack

Once secrets are created, use the launch script:

### Windows
```batch
launch-stack.bat <docker-context> [full-stack]
```

**Examples:**
```batch
:: Deploy full stack (app + database)
launch-stack.bat production full-stack

:: Update only the app service
launch-stack.bat production
```

### Manual Deployment
```bash
docker stack deploy -c compose.prod.yaml confesercenti-vallo-pwa --with-registry-auth
```

## Managing Secrets

### List all secrets
```bash
docker secret ls
```

### Inspect a secret (shows metadata, not the actual value)
```bash
docker secret inspect confesercenti_vallo_db_user
```

### Remove a secret (stop services first)
```bash
docker secret rm confesercenti_vallo_db_user
```

### Update a secret
Secrets are immutable. To update:
1. Remove the old secret: `docker secret rm confesercenti_vallo_db_user`
2. Create new secret: `echo "new_value" | docker secret create confesercenti_vallo_db_user -`
3. Update the service: `docker service update --secret-rm old --secret-add new <service_name>`

## Managing the Stack

### View stack status
```bash
docker stack ps confesercenti-vallo-app
```

### View service logs
```bash
docker service logs confesercenti-vallo-app_app
docker service logs confesercenti-vallo-app_db
```

### Update the stack
```bash
docker stack deploy -c compose.prod.yaml confesercenti-vallo-app
```

### Remove the stack
```bash
docker stack rm confesercenti-vallo-app
```

## Security Notes

- ✅ Secrets are encrypted at rest in Docker Swarm
- ✅ Secrets are only accessible to services that explicitly request them
- ✅ Secrets are mounted in-memory only (not written to disk)
- ⚠️ Use different secrets for development and production
- ⚠️ Rotate secrets regularly
- ⚠️ Never log or expose secret values

