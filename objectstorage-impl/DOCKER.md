# Docker Operations Guide

## 📋 Overview

This guide provides comprehensive instructions for operating the MongoDB Docker containers in the object storage implementation. The setup includes three environments: production, development, and testing, each with specific configurations and use cases.

## 🏗️ Architecture

### Container Structure
```
objectstorage-impl/
├── docker-compose.yml          # Production environment
├── docker-compose.dev.yml      # Development environment
├── docker-compose.test.yml     # Testing environment
├── .env                        # Environment variables
├── init-mongo.js              # Database initialization
└── .dockerignore              # Docker build exclusions
```

### Network Architecture
```
Host Machine
├── Port 27017 → Production MongoDB
├── Port 27018 → Development MongoDB
└── Port 27019 → Testing MongoDB (Replica Set)
```

## 🚀 Production Environment

### Starting Production Services
```bash
# Navigate to implementation directory
cd objectstorage-impl

# Start services in detached mode
docker-compose up -d

# Verify startup
docker-compose ps
```

### Production Configuration
- **Image:** `mongo:7` (MongoDB Community Server 7.x)
- **Port:** `27017` (host) → `27017` (container)
- **Database:** `anvil_recipes`
- **Volumes:** Persistent data and config storage
- **Restart:** `unless-stopped` (automatic recovery)

### Production Health Checks
```bash
# Check container status
docker-compose ps

# View detailed health status
docker inspect --format='{{.State.Health.Status}}' anvil-recipes-mongodb

# Monitor health check logs
docker-compose logs --tail=50 mongodb
```

## 🛠️ Development Environment

### Starting Development Services
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Verify startup
docker-compose -f docker-compose.dev.yml ps
```

### Development Configuration
- **Image:** `mongo:7`
- **Port:** `27018` (host) → `27017` (container)
- **Database:** `anvil_recipes_dev`
- **Volumes:** Separate development data storage
- **Isolation:** Independent from production data

### Development Operations
```bash
# View development logs
docker-compose -f docker-compose.dev.yml logs -f

# Access development database
docker-compose -f docker-compose.dev.yml exec mongodb mongosh

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

## 🧪 Testing Environment

### Starting Testing Services
```bash
# Start testing environment
docker-compose -f docker-compose.test.yml up -d

# Initialize replica set (if needed)
docker-compose -f docker-compose.test.yml exec mongodb mongosh --eval "
rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }]
})
"
```

### Testing Configuration
- **Image:** `mongo:7`
- **Port:** `27019` (host) → `27017` (container)
- **Database:** `anvil_recipes_test`
- **Replica Set:** `rs0` (for transactions)
- **Restart:** `no` (test-controlled lifecycle)

### Testing Operations
```bash
# Quick test database reset
docker-compose -f docker-compose.test.yml down -v
docker-compose -f docker-compose.test.yml up -d

# Run tests against test database
npm test -- --db-uri mongodb://localhost:27019/anvil_recipes_test
```

## 🔧 Container Management

### Basic Commands

#### Starting Services
```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up -d

# Testing
docker-compose -f docker-compose.test.yml up -d
```

#### Stopping Services
```bash
# Graceful shutdown
docker-compose down

# Force stop
docker-compose down --timeout 0

# Stop and remove volumes (data loss!)
docker-compose down -v
```

#### Viewing Status
```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# Detailed container info
docker inspect anvil-recipes-mongodb
```

### Log Management

#### Viewing Logs
```bash
# Last 100 lines
docker-compose logs --tail=100 mongodb

# Follow logs in real-time
docker-compose logs -f mongodb

# Logs since specific time
docker-compose logs --since "2025-11-08T20:00:00" mongodb

# Logs with timestamps
docker-compose logs -t mongodb
```

#### Log Analysis
```bash
# Search for errors
docker-compose logs mongodb | grep -i error

# Search for connections
docker-compose logs mongodb | grep -i connection

# Export logs for analysis
docker-compose logs mongodb > mongodb_logs_$(date +%Y%m%d_%H%M%S).log
```

## 💾 Volume Management

### Volume Operations

#### Listing Volumes
```bash
# Docker volumes
docker volume ls | grep anvil

# Volume details
docker volume inspect objectstorage-impl_mongodb_data
```

#### Volume Backup
```bash
# Backup data volume
docker run --rm -v objectstorage-impl_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb_data_backup.tar.gz -C /data .

# Backup config volume
docker run --rm -v objectstorage-impl_mongodb_config:/data -v $(pwd):/backup alpine tar czf /backup/mongodb_config_backup.tar.gz -C /data .
```

#### Volume Restore
```bash
# Restore data volume
docker run --rm -v objectstorage-impl_mongodb_data:/data -v $(pwd):/backup alpine tar xzf /backup/mongodb_data_backup.tar.gz -C /data

# Restore config volume
docker run --rm -v objectstorage-impl_mongodb_config:/data -v $(pwd):/backup alpine tar xzf /backup/mongodb_config_backup.tar.gz -C /data
```

### Volume Cleanup
```bash
# Remove unused volumes
docker volume prune

# Remove specific volumes
docker volume rm objectstorage-impl_mongodb_data objectstorage-impl_mongodb_config
```

## 🔍 Database Operations

### Connecting to Database

#### Production Database
```bash
# Connect as application user
docker-compose exec mongodb mongosh --username anvil_app --password app_password123 --authenticationDatabase anvil_recipes anvil_recipes

# Connect as root user
docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin
```

#### Development Database
```bash
docker-compose -f docker-compose.dev.yml exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin anvil_recipes_dev
```

#### Testing Database
```bash
docker-compose -f docker-compose.test.yml exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin anvil_recipes_test
```

### Database Administration

#### User Management
```bash
# List users
docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin --eval "db.getSiblingDB('anvil_recipes').getUsers()"

# Create new user
docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin --eval "
db.getSiblingDB('anvil_recipes').createUser({
  user: 'new_user',
  pwd: 'new_password',
  roles: ['readWrite']
})
"
```

#### Collection Management
```bash
# List collections
docker-compose exec mongodb mongosh --username anvil_app --password app_password123 --authenticationDatabase anvil_recipes anvil_recipes --eval "db.getCollectionNames()"

# Collection statistics
docker-compose exec mongodb mongosh --username anvil_app --password app_password123 --authenticationDatabase anvil_recipes anvil_recipes --eval "db.characters.stats()"

# Index information
docker-compose exec mongodb mongosh --username anvil_app --password app_password123 --authenticationDatabase anvil_recipes anvil_recipes --eval "db.characters.getIndexes()"
```

## 📊 Monitoring and Diagnostics

### Performance Monitoring

#### Connection Statistics
```bash
docker-compose exec mongodb mongosh --eval "db.serverStatus().connections"
```

#### Database Performance
```bash
# Database statistics
docker-compose exec mongodb mongosh anvil_recipes --eval "db.stats()"

# Collection statistics
docker-compose exec mongodb mongosh anvil_recipes --eval "db.characters.stats()"

# Index usage statistics
docker-compose exec mongodb mongosh anvil_recipes --eval "db.characters.aggregate([{\$indexStats: {}}])"
```

#### System Resources
```bash
# Container resource usage
docker stats anvil-recipes-mongodb

# Disk usage
docker system df

# Volume usage
docker run --rm -v objectstorage-impl_mongodb_data:/data alpine du -sh /data
```

### Health Monitoring

#### Health Check Status
```bash
# Current health status
docker inspect --format='{{.State.Health.Status}}' anvil-recipes-mongodb

# Health check configuration
docker inspect --format='{{.Config.Healthcheck}}' anvil-recipes-mongodb

# Manual health check
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

#### Automated Monitoring
```bash
# Monitor health continuously
watch -n 10 'docker inspect --format="{{.State.Health.Status}}" anvil-recipes-mongodb'

# Log health check failures
docker-compose logs mongodb | grep -E "(health|ping|failed)"
```

## 🔄 Backup and Recovery

### Database Backup

#### Full Database Backup
```bash
# Create timestamped backup
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup database
docker-compose exec mongodb mongodump \
  --db anvil_recipes \
  --out "/tmp/backup"

# Copy backup to host
docker cp anvil-recipes-mongodb:/tmp/backup "$BACKUP_DIR"

# Cleanup
docker-compose exec mongodb rm -rf /tmp/backup
```

#### Collection-Specific Backup
```bash
# Backup characters collection
docker-compose exec mongodb mongoexport \
  --db anvil_recipes \
  --collection characters \
  --username anvil_app \
  --password app_password123 \
  --authenticationDatabase anvil_recipes \
  --out characters_backup_$(date +%Y%m%d).json
```

### Database Restore

#### Full Database Restore
```bash
# Copy backup to container
docker cp ./backups/20251108_210000 anvil-recipes-mongodb:/tmp/backup

# Restore database
docker-compose exec mongodb mongorestore \
  --db anvil_recipes \
  /tmp/backup/anvil_recipes

# Cleanup
docker-compose exec mongodb rm -rf /tmp/backup
```

#### Collection Restore
```bash
# Restore characters collection
docker-compose exec mongodb mongoimport \
  --db anvil_recipes \
  --collection characters \
  --username anvil_app \
  --password app_password123 \
  --authenticationDatabase anvil_recipes \
  --file characters_backup_20251108.json
```

## 🚨 Troubleshooting

### Startup Issues

#### Container Won't Start
```bash
# Check system requirements
docker system info

# Check available resources
docker system df

# Verify port availability
netstat -tulpn | grep :27017

# Check Docker daemon
docker info
```

#### Initialization Failures
```bash
# Check initialization logs
docker-compose logs --tail=100 mongodb | grep -A 20 -B 5 "init-mongo.js"

# Verify init script exists
ls -la init-mongo.js

# Check file permissions
docker-compose exec mongodb ls -la /docker-entrypoint-initdb.d/
```

### Connection Issues

#### Authentication Problems
```bash
# Test root authentication
docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin --eval "db.runCommand({ping: 1})"

# Test application authentication
docker-compose exec mongodb mongosh --username anvil_app --password app_password123 --authenticationDatabase anvil_recipes --eval "db.runCommand({ping: 1})"

# Check user exists
docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin --eval "db.getSiblingDB('anvil_recipes').getUsers()"
```

#### Network Issues
```bash
# Test container networking
docker-compose exec mongodb ping -c 3 google.com

# Check exposed ports
docker port anvil-recipes-mongodb

# Verify network configuration
docker network ls | grep anvil
```

### Performance Issues

#### Slow Queries
```bash
# Identify slow operations
docker-compose exec mongodb mongosh anvil_recipes --eval "db.currentOp()"

# Check index usage
docker-compose exec mongodb mongosh anvil_recipes --eval "db.characters.explain('executionStats').find({class: 'Fighter'})"

# Profile slow queries
docker-compose exec mongodb mongosh anvil_recipes --eval "db.setProfilingLevel(2)"
```

#### Resource Constraints
```bash
# Check container limits
docker inspect --format='{{.HostConfig.Memory}}' anvil-recipes-mongodb

# Monitor resource usage
docker stats --no-stream anvil-recipes-mongodb

# Check disk I/O
docker run --rm -v objectstorage-impl_mongodb_data:/data alpine dd if=/dev/zero of=/data/test bs=1M count=100
```

## 🔧 Advanced Configuration

### Custom Docker Configuration

#### Environment-Specific Overrides
```bash
# Create custom environment file
cp .env .env.production

# Override specific values
echo "MONGO_INITDB_ROOT_PASSWORD=super_secret_password" >> .env.production

# Use custom environment
docker-compose --env-file .env.production up -d
```

#### Custom Docker Compose
```yaml
# docker-compose.custom.yml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    environment:
      - MONGO_INITDB_ROOT_PASSWORD_FILE=/run/secrets/mongodb_root_password
    secrets:
      - mongodb_root_password
    # Additional custom configuration

secrets:
  mongodb_root_password:
    file: ./secrets/mongodb_root_password.txt
```

### Security Enhancements

#### TLS/SSL Configuration
```yaml
# docker-compose.tls.yml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    command: --tlsMode requireTLS --tlsCertificateKeyFile /etc/ssl/mongodb.pem --tlsCAFile /etc/ssl/ca.pem
    volumes:
      - ./ssl:/etc/ssl:ro
    ports:
      - "27017:27017"
```

#### Network Security
```bash
# Create isolated network
docker network create --driver bridge --internal anvil-secure-network

# Run with network restrictions
docker-compose -f docker-compose.yml --scale mongodb=1 up -d
```

## 📈 Scaling and Optimization

### Vertical Scaling
```bash
# Increase memory limits
echo "MONGO_MEMORY_LIMIT=2GB" >> .env

# Adjust connection pool
echo "MONGODB_POOL_SIZE=20" >> .env
```

### Horizontal Scaling
```yaml
# docker-compose.cluster.yml
version: '3.8'
services:
  mongodb-primary:
    image: mongo:7
    command: --replSet rs0 --keyFile /etc/mongo-keyfile
    # Primary node configuration

  mongodb-secondary:
    image: mongo:7
    command: --replSet rs0 --keyFile /etc/mongo-keyfile
    # Secondary node configuration

  mongodb-arbiter:
    image: mongo:7
    command: --replSet rs0 --keyFile /etc/mongo-keyfile
    # Arbiter node configuration
```

### Performance Tuning
```javascript
// MongoDB configuration tuning
db.adminCommand({
  setParameter: 1,
  wiredTigerMaxCacheOverflowSizeGB: 1,
  wiredTigerCacheSizeGB: 2
});

// Connection pool optimization
db.adminCommand({
  setParameter: 1,
  maxIncomingConnections: 1000
});
```

## 📚 Reference

### Docker Commands Quick Reference
```bash
# Container management
docker-compose up -d                    # Start services
docker-compose down                     # Stop services
docker-compose ps                       # Show status
docker-compose logs -f                  # Follow logs

# Database operations
docker-compose exec mongodb mongosh     # Connect to database
docker-compose exec mongodb mongoexport # Export data
docker-compose exec mongodb mongoimport # Import data

# Volume operations
docker volume ls                        # List volumes
docker volume inspect <name>           # Volume details
docker volume rm <name>                # Remove volume

# Network operations
docker network ls                      # List networks
docker network inspect <name>          # Network details
```

### File Structure Reference
```
objectstorage-impl/
├── docker-compose.yml          # Production configuration
├── docker-compose.dev.yml      # Development configuration
├── docker-compose.test.yml     # Testing configuration
├── .env                        # Environment variables
├── init-mongo.js              # Database initialization
├── .dockerignore              # Docker exclusions
├── README.md                  # User documentation
├── DOCKER.md                  # This operations guide
├── ENVIRONMENT.md             # Configuration reference
└── IMPLEMENTATION_SUMMARY.md  # Implementation details
```