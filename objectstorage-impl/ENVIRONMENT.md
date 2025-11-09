# Environment Configuration Guide

## 📋 Overview

This guide provides comprehensive documentation for configuring the MongoDB object storage implementation. The system uses environment variables for flexible deployment across different environments (production, development, testing).

## 🔧 Environment Variables

### Core MongoDB Configuration

#### Database Initialization
| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `MONGO_INITDB_ROOT_USERNAME` | `admin` | Root administrative user | No |
| `MONGO_INITDB_ROOT_PASSWORD` | `password123` | Root user password | No |
| `MONGO_INITDB_DATABASE` | `anvil_recipes` | Default database name | No |

#### Application Credentials
| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `MONGODB_APP_USERNAME` | `anvil_app` | Application user for data operations | No |
| `MONGODB_APP_PASSWORD` | `app_password123` | Application user password | No |

#### Connection Configuration
| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `MONGODB_URI` | `mongodb://admin:password123@localhost:27017/anvil_recipes?authSource=admin` | Full connection string | No |
| `MONGODB_DATABASE` | `anvil_recipes` | Target database name | No |
| `MONGODB_HOST` | `localhost` | MongoDB server hostname | No |
| `MONGODB_PORT` | `27017` | MongoDB server port | No |

#### Performance Tuning
| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `MONGODB_POOL_SIZE` | `10` | Connection pool size | No |
| `MONGODB_MAX_IDLE_TIME_MS` | `30000` | Connection idle timeout (ms) | No |

## 📁 Configuration Files

### .env File Structure

```bash
# MongoDB Environment Configuration
# Used for MongoDB deployment and configuration

# MongoDB Configuration
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=anvil_recipes

# Database Connection
MONGODB_URI=mongodb://admin:password123@localhost:27017/anvil_recipes?authSource=admin

# Database Settings
MONGODB_DATABASE=anvil_recipes
MONGODB_HOST=localhost
MONGODB_PORT=27017

# Application User Credentials (created by init-mongo.js)
MONGODB_APP_USERNAME=anvil_app
MONGODB_APP_PASSWORD=app_password123

# Collection Names
MONGODB_CHARACTERS_COLLECTION=characters

# Connection Pool Settings
MONGODB_POOL_SIZE=10
MONGODB_MAX_IDLE_TIME_MS=30000
```

### Environment-Specific Configurations

#### Production Environment (.env)
```bash
# Production settings - secure and optimized
MONGO_INITDB_ROOT_USERNAME=prod_admin
MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
MONGO_INITDB_DATABASE=anvil_recipes
MONGODB_POOL_SIZE=20
MONGODB_MAX_IDLE_TIME_MS=60000
```

#### Development Environment (.env.dev)
```bash
# Development settings - relaxed security, hot reload
MONGO_INITDB_ROOT_USERNAME=dev_admin
MONGO_INITDB_ROOT_PASSWORD=dev_password123
MONGO_INITDB_DATABASE=anvil_recipes_dev
MONGODB_POOL_SIZE=5
MONGODB_MAX_IDLE_TIME_MS=30000
```

#### Testing Environment (.env.test)
```bash
# Testing settings - isolated, fast reset
MONGO_INITDB_ROOT_USERNAME=test_admin
MONGO_INITDB_ROOT_PASSWORD=test_password123
MONGO_INITDB_DATABASE=anvil_recipes_test
MONGODB_POOL_SIZE=3
MONGODB_MAX_IDLE_TIME_MS=10000
```

## 🏗️ Docker Compose Configuration

### Environment Variable Mapping

#### Production (docker-compose.yml)
```yaml
services:
  mongodb:
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME:-admin}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD:-password123}
      - MONGO_INITDB_DATABASE=${MONGO_INITDB_DATABASE:-anvil_recipes}
```

#### Development (docker-compose.dev.yml)
```yaml
services:
  mongodb:
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME:-admin}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD:-password123}
      - MONGO_INITDB_DATABASE=${MONGO_INITDB_DATABASE:-anvil_recipes_dev}
```

#### Testing (docker-compose.test.yml)
```yaml
services:
  mongodb:
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME:-admin}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD:-password123}
      - MONGO_INITDB_DATABASE=${MONGO_INITDB_DATABASE:-anvil_recipes_test}
```

## 🔐 Security Configuration

### Password Management

#### Environment Variable Passwords
```bash
# Use environment variables for sensitive data
export MONGO_ROOT_PASSWORD="super_secure_password_123!"
export MONGO_APP_PASSWORD="app_secure_password_456!"

# Reference in .env file
MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
MONGODB_APP_PASSWORD=${MONGO_APP_PASSWORD}
```

#### Docker Secrets (Advanced)
```yaml
# docker-compose.secrets.yml
services:
  mongodb:
    environment:
      - MONGO_INITDB_ROOT_PASSWORD_FILE=/run/secrets/mongodb_root_password
      - MONGO_INITDB_DATABASE=anvil_recipes
    secrets:
      - mongodb_root_password

secrets:
  mongodb_root_password:
    file: ./secrets/mongodb_root_password.txt
```

### Network Security

#### Port Configuration
```yaml
# Production - standard port
services:
  mongodb:
    ports:
      - "27017:27017"

# Development - alternative port
services:
  mongodb:
    ports:
      - "27018:27017"

# Testing - isolated port
services:
  mongodb:
    ports:
      - "27019:27017"
```

#### Network Isolation
```yaml
# Isolated network configuration
services:
  mongodb:
    networks:
      - anvil-secure-network

networks:
  anvil-secure-network:
    driver: bridge
    internal: true  # No external access
```

## ⚡ Performance Configuration

### Connection Pool Settings

#### Basic Pool Configuration
```bash
# Connection pool size based on application needs
MONGODB_POOL_SIZE=10          # Default for small applications
MONGODB_POOL_SIZE=50          # For high-traffic applications
MONGODB_POOL_SIZE=5           # For development/testing
```

#### Advanced Pool Settings
```javascript
// MongoDB driver configuration
const client = new MongoClient(uri, {
  maxPoolSize: parseInt(process.env.MONGODB_POOL_SIZE) || 10,
  minPoolSize: 2,
  maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME_MS) || 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### Memory and Resource Limits

#### Docker Resource Limits
```yaml
services:
  mongodb:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'
```

#### MongoDB Memory Configuration
```bash
# Environment variables for MongoDB
MONGO_MEMORY_LIMIT=2GB
MONGO_CACHE_SIZE=1GB
```

## 🌍 Multi-Environment Setup

### Environment Detection

#### Runtime Environment Detection
```javascript
// Detect environment from NODE_ENV or custom variable
const environment = process.env.NODE_ENV || 'development';

const config = {
  development: {
    host: 'localhost',
    port: 27018,
    database: 'anvil_recipes_dev'
  },
  test: {
    host: 'localhost',
    port: 27019,
    database: 'anvil_recipes_test'
  },
  production: {
    host: process.env.MONGODB_HOST,
    port: parseInt(process.env.MONGODB_PORT),
    database: process.env.MONGODB_DATABASE
  }
};

module.exports = config[environment];
```

#### Docker Environment Files
```bash
# Use different env files for different environments
docker-compose --env-file .env.production up -d
docker-compose --env-file .env.development up -d
docker-compose --env-file .env.testing up -d
```

### Environment-Specific Overrides

#### Production Overrides
```bash
# .env.production
MONGO_INITDB_ROOT_USERNAME=prod_mongo_admin
MONGO_INITDB_ROOT_PASSWORD=${PROD_MONGO_PASSWORD}
MONGODB_POOL_SIZE=25
MONGODB_MAX_IDLE_TIME_MS=60000
```

#### Development Overrides
```bash
# .env.development
MONGO_INITDB_ROOT_USERNAME=dev_mongo_admin
MONGO_INITDB_ROOT_PASSWORD=dev_password_123
MONGODB_POOL_SIZE=5
MONGODB_MAX_IDLE_TIME_MS=30000
```

## 🔍 Monitoring and Logging

### Environment-Based Logging

#### Log Levels
```bash
# Environment variable for log level
MONGO_LOG_LEVEL=INFO          # Production
MONGO_LOG_LEVEL=DEBUG         # Development
MONGO_LOG_LEVEL=WARN          # Testing
```

#### Structured Logging
```javascript
// Configure logging based on environment
const logLevel = process.env.LOG_LEVEL || 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'mongo-operations.log' })
  ]
});
```

### Health Check Configuration

#### Environment-Specific Health Checks
```yaml
# Production - strict health checks
services:
  mongodb:
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

# Development - relaxed health checks
services:
  mongodb:
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s
```

## 🚀 Deployment Strategies

### Blue-Green Deployment

#### Environment Variables for Blue-Green
```bash
# Blue environment
BLUE_MONGO_PORT=27017
BLUE_MONGO_DATABASE=anvil_recipes_blue

# Green environment
GREEN_MONGO_PORT=27018
GREEN_MONGO_DATABASE=anvil_recipes_green
```

### Canary Deployment

#### Gradual Rollout Configuration
```bash
# Percentage of traffic to new version
CANARY_PERCENTAGE=10

# Feature flags for canary features
ENABLE_NEW_INDEXES=true
ENABLE_QUERY_OPTIMIZATION=false
```

## 🧪 Testing Configuration

### Test Environment Setup

#### Isolated Test Configuration
```bash
# .env.test
MONGO_INITDB_ROOT_USERNAME=test_admin
MONGO_INITDB_ROOT_PASSWORD=test_password
MONGO_INITDB_DATABASE=anvil_recipes_test
MONGODB_POOL_SIZE=2
MONGODB_MAX_IDLE_TIME_MS=5000
```

#### Test Data Management
```javascript
// Test configuration
const testConfig = {
  database: process.env.MONGODB_DATABASE_TEST || 'anvil_recipes_test',
  host: process.env.MONGODB_HOST_TEST || 'localhost',
  port: parseInt(process.env.MONGODB_PORT_TEST) || 27019,
  dropDatabase: process.env.NODE_ENV === 'test'
};
```

### CI/CD Integration

#### GitHub Actions Example
```yaml
# .github/workflows/test.yml
env:
  MONGO_INITDB_ROOT_USERNAME: test_admin
  MONGO_INITDB_ROOT_PASSWORD: test_password
  MONGO_INITDB_DATABASE: anvil_recipes_test
  MONGODB_POOL_SIZE: 2

jobs:
  test:
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27019:27017
        env:
          MONGO_INITDB_ROOT_USERNAME: ${{ env.MONGO_INITDB_ROOT_USERNAME }}
          MONGO_INITDB_ROOT_PASSWORD: ${{ env.MONGO_INITDB_ROOT_PASSWORD }}
```

## 📊 Configuration Validation

### Environment Validation Script

#### Node.js Validation
```javascript
// config-validator.js
require('dotenv').config();

const requiredVars = [
  'MONGO_INITDB_ROOT_USERNAME',
  'MONGO_INITDB_ROOT_PASSWORD',
  'MONGO_INITDB_DATABASE',
  'MONGODB_DATABASE'
];

const optionalVars = [
  'MONGODB_POOL_SIZE',
  'MONGODB_MAX_IDLE_TIME_MS'
];

function validateConfig() {
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }

  // Validate pool size
  const poolSize = parseInt(process.env.MONGODB_POOL_SIZE);
  if (poolSize && (poolSize < 1 || poolSize > 100)) {
    console.error('MONGODB_POOL_SIZE must be between 1 and 100');
    process.exit(1);
  }

  console.log('✅ Environment configuration is valid');
}

validateConfig();
```

#### Docker Validation
```bash
# Validate configuration before deployment
docker-compose config

# Check environment variables
docker-compose exec mongodb env | grep MONGO

# Test database connection
docker-compose exec mongodb mongosh --eval "db.runCommand({ping: 1})"
```

## 🔧 Troubleshooting Configuration

### Common Configuration Issues

#### Environment Variable Not Set
```bash
# Check if variable is set
echo $MONGO_INITDB_ROOT_PASSWORD

# Source environment file
source .env

# Use docker-compose with env-file
docker-compose --env-file .env up -d
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :27017

# Find process using port
lsof -i :27017

# Change port in configuration
echo "MONGODB_PORT=27018" >> .env
```

#### Permission Issues
```bash
# Check file permissions
ls -la .env

# Fix permissions
chmod 600 .env

# Check Docker volume permissions
docker-compose exec mongodb ls -la /data/db
```

### Configuration Debugging

#### Debug Environment Loading
```bash
# Print all environment variables
docker-compose exec mongodb env | sort

# Check specific variable
docker-compose exec mongodb env | grep MONGO

# Debug application configuration
node -e "console.log(require('./config').database)"
```

#### Configuration Logging
```javascript
// Log configuration on startup
console.log('Database Configuration:');
console.log('- Host:', process.env.MONGODB_HOST);
console.log('- Port:', process.env.MONGODB_PORT);
console.log('- Database:', process.env.MONGODB_DATABASE);
console.log('- Pool Size:', process.env.MONGODB_POOL_SIZE);
```

## 📚 Reference

### Default Values Summary

| Variable | Default | Environment |
|----------|---------|-------------|
| `MONGO_INITDB_ROOT_USERNAME` | `admin` | All |
| `MONGO_INITDB_ROOT_PASSWORD` | `password123` | All |
| `MONGO_INITDB_DATABASE` | `anvil_recipes` | Production |
| `MONGO_INITDB_DATABASE` | `anvil_recipes_dev` | Development |
| `MONGO_INITDB_DATABASE` | `anvil_recipes_test` | Testing |
| `MONGODB_POOL_SIZE` | `10` | Production |
| `MONGODB_POOL_SIZE` | `5` | Development |
| `MONGODB_POOL_SIZE` | `3` | Testing |

### Configuration File Templates

#### Minimal Production Configuration
```bash
# .env.production.minimal
MONGO_INITDB_ROOT_PASSWORD=your_secure_password_here
MONGODB_POOL_SIZE=15
```

#### Full Development Configuration
```bash
# .env.development.full
MONGO_INITDB_ROOT_USERNAME=dev_admin
MONGO_INITDB_ROOT_PASSWORD=dev_password123
MONGO_INITDB_DATABASE=anvil_recipes_dev
MONGODB_URI=mongodb://dev_admin:dev_password123@localhost:27018/anvil_recipes_dev?authSource=admin
MONGODB_DATABASE=anvil_recipes_dev
MONGODB_HOST=localhost
MONGODB_PORT=27018
MONGODB_APP_USERNAME=dev_app
MONGODB_APP_PASSWORD=dev_app_password
MONGODB_CHARACTERS_COLLECTION=characters
MONGODB_POOL_SIZE=5
MONGODB_MAX_IDLE_TIME_MS=30000
LOG_LEVEL=debug
```

This comprehensive configuration guide ensures consistent and secure MongoDB deployments across all environments while providing flexibility for different use cases and scaling requirements.