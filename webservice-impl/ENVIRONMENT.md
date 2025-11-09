# Environment Configuration Guide

This document provides comprehensive information about configuring the Anvil Recipes web service through environment variables.

## 📋 Configuration Overview

The web service supports configuration through environment variables, allowing flexible deployment across different environments (development, staging, production).

## 🔧 Core Configuration

### Server Configuration

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `PORT` | `9876` | Server port (unique to avoid conflicts) | No |
| `GIN_MODE` | `debug` | Gin framework mode: `debug`, `release`, `test` | No |
| `APP_NAME` | `webservice` | Application name for identification | No |
| `APP_VERSION` | `1.0.0` | Application version | No |
| `APP_ENV` | `development` | Environment: `development`, `staging`, `production` | No |

### Database Configuration

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `MONGODB_URI` | `mongodb://localhost:27017/anvil_recipes` | Full MongoDB connection string | No |
| `MONGODB_HOST` | `localhost` | MongoDB server hostname | No |
| `MONGODB_PORT` | `27017` | MongoDB server port | No |
| `MONGODB_DATABASE` | `anvil_recipes` | Database name | No |
| `MONGODB_USERNAME` | `anvil_app` | Database username | No |
| `MONGODB_PASSWORD` | `app_password123` | Database password | No |

### MongoDB Initialization (Docker)

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `MONGO_INITDB_ROOT_USERNAME` | `admin` | MongoDB root username | No |
| `MONGO_INITDB_ROOT_PASSWORD` | `password123` | MongoDB root password | No |
| `MONGO_INITDB_DATABASE` | `anvil_recipes` | Default database to create | No |

## 📝 Logging Configuration

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `LOG_LEVEL` | `info` | Log level: `debug`, `info`, `warn`, `error` | No |
| `LOG_FORMAT` | `json` | Log format: `json`, `text` | No |

## 🌐 CORS Configuration

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:8080` | Comma-separated list of allowed origins | No |
| `CORS_ALLOWED_METHODS` | `GET,POST,PUT,DELETE,OPTIONS` | Comma-separated list of allowed HTTP methods | No |
| `CORS_ALLOWED_HEADERS` | `Content-Type,Authorization,X-Requested-With` | Comma-separated list of allowed headers | No |

## 📄 Sample Configuration Files

### Development Environment (.env)

```bash
# Server Configuration
PORT=9876
GIN_MODE=debug
APP_ENV=development

# Database Configuration
MONGODB_URI=mongodb://anvil_app:app_password123@localhost:27017/anvil_recipes?authSource=anvil_recipes
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=anvil_recipes
MONGODB_USERNAME=anvil_app
MONGODB_PASSWORD=app_password123

# MongoDB Docker Initialization
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=anvil_recipes

# Logging
LOG_LEVEL=debug
LOG_FORMAT=text

# CORS (Development)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://localhost:5173
```

### Production Environment (.env)

```bash
# Server Configuration
PORT=9876
GIN_MODE=release
APP_ENV=production
APP_NAME=anvil-recipes-webservice
APP_VERSION=1.0.0

# Database Configuration
MONGODB_URI=mongodb://anvil_app:secure_app_password@mongodb:27017/anvil_recipes?authSource=anvil_recipes&ssl=true
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_DATABASE=anvil_recipes
MONGODB_USERNAME=anvil_app
MONGODB_PASSWORD=secure_app_password

# MongoDB Docker Initialization
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=secure_root_password
MONGO_INITDB_DATABASE=anvil_recipes

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# CORS (Production - restrict to specific domains)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-API-Key
```

### Staging Environment (.env.staging)

```bash
# Server Configuration
PORT=9876
GIN_MODE=release
APP_ENV=staging

# Database Configuration
MONGODB_URI=mongodb://anvil_app:staging_app_password@mongodb:27017/anvil_recipes_staging?authSource=anvil_recipes_staging
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_DATABASE=anvil_recipes_staging
MONGODB_USERNAME=anvil_app
MONGODB_PASSWORD=staging_app_password

# MongoDB Docker Initialization
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=staging_root_password
MONGO_INITDB_DATABASE=anvil_recipes_staging

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# CORS (Staging)
CORS_ALLOWED_ORIGINS=https://staging.yourdomain.com
```

## 🔐 Security Considerations

### Password Management
- Use strong, unique passwords for production
- Store passwords in environment variables, not in code
- Use Docker secrets for highly sensitive data
- Rotate passwords regularly

### Database Security
- Use authentication with MongoDB
- Restrict database user permissions to minimum required
- Use SSL/TLS for production database connections
- Regularly backup database credentials

### Network Security
- Restrict CORS origins to trusted domains
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Monitor for suspicious activity

## 🧪 Testing Configuration

### Configuration Validation
```bash
# Test database connection
docker-compose exec webservice printenv | grep MONGODB

# Test application configuration
curl http://localhost:9876/health
```

### Environment-Specific Testing
```bash
# Development
docker-compose --env-file .env up -d

# Production
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d

# Staging
docker-compose --env-file .env.staging -f docker-compose.staging.yml up -d
```

## 🔄 Configuration Management

### Docker Compose Environment Files
```yaml
# docker-compose.yml
services:
  webservice:
    env_file:
      - .env
    environment:
      - APP_ENV=development
```

### Kubernetes ConfigMaps and Secrets
```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: webservice-config
data:
  GIN_MODE: "release"
  APP_ENV: "production"

# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: webservice-secrets
type: Opaque
data:
  MONGODB_PASSWORD: <base64-encoded-password>
```

## 📊 Monitoring Configuration

### Health Check Configuration
The service includes built-in health checks that can be configured:

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:9876/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Logging Configuration
Logs can be configured for different outputs:

```bash
# JSON format for production
LOG_FORMAT=json

# Text format for development
LOG_FORMAT=text

# Debug level for troubleshooting
LOG_LEVEL=debug
```

## 🚀 Deployment Examples

### Local Development
```bash
cp .env.example .env
# Edit .env with local settings
docker-compose up -d
```

### Production Deployment
```bash
export MONGO_INITDB_ROOT_PASSWORD="secure_password"
export MONGODB_PASSWORD="secure_app_password"
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD Pipeline
```bash
# Set environment variables in pipeline
export APP_ENV=production
export MONGODB_URI="mongodb://production-host:27017"
export LOG_LEVEL=info

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Troubleshooting

### Common Configuration Issues

#### Database Connection Failed
```bash
# Check environment variables
docker-compose exec webservice env | grep MONGODB

# Test connection manually
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

#### Port Already in Use
```bash
# Check port usage
netstat -tulpn | grep :9876

# Change port
export PORT=9877
docker-compose up -d
```

#### CORS Issues
```bash
# Check CORS configuration
curl -H "Origin: http://localhost:3000" -v http://localhost:9876/api/v1/characters

# Update CORS settings in .env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## 📚 Additional Resources

- [Go Environment Variables](https://golang.org/pkg/os/#Getenv)
- [Gin Framework Configuration](https://gin-gonic.com/docs/examples/custom-middleware/)
- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)

## 🆘 Support

For configuration issues:
1. Verify all required environment variables are set
2. Check variable names match exactly (case-sensitive)
3. Ensure database is accessible from the container
4. Review application logs for error messages
5. Test configuration in development environment first