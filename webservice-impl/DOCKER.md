# Docker Deployment Guide

This guide provides comprehensive instructions for deploying the Anvil Recipes web service using Docker and Docker Compose.

## 🏗️ Architecture Overview

The application consists of two main services:
- **Web Service**: Go application serving REST APIs
- **MongoDB**: Database for persistent storage

## 🚀 Quick Deployment

### Development Environment
```bash
# Navigate to the webservice implementation
cd webservice-impl

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Environment
```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up -d

# Scale the web service (optional)
docker-compose -f docker-compose.prod.yml up -d --scale webservice=3
```

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available
- 5GB free disk space

## 🔧 Configuration

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# Web Service
PORT=9876
GIN_MODE=release

# MongoDB
MONGODB_URI=mongodb://anvil_app:app_password123@mongodb:27017/anvil_recipes?authSource=anvil_recipes
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=secure_password_here
```

### Port Configuration

The service uses port `9876` by default, chosen to avoid conflicts with commonly used ports:
- ✅ `9876` (unique, available)
- ❌ `80`, `443`, `3000`, `5000`, `8000`, `8080`, `8443`, `9000` (commonly used)

## 🏗️ Building Custom Images

### Build Web Service Image
```bash
# Build for local architecture
docker build -t anvil-recipes-webservice .

# Build for specific platform
docker build --platform linux/amd64 -t anvil-recipes-webservice .

# Build with custom build args
docker build --build-arg CGO_ENABLED=0 -t anvil-recipes-webservice .
```

### Multi-Architecture Builds
```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t anvil-recipes-webservice .
```

## 🔍 Health Checks and Monitoring

### Container Health Status
```bash
# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Detailed health inspection
docker inspect anvil-recipes-webservice --format='{{.State.Health.Status}}'
```

### Application Health Endpoints
```bash
# General health check
curl -f http://localhost:9876/health

# Liveness probe
curl -f http://localhost:9876/health/live

# Readiness probe
curl -f http://localhost:9876/health/ready
```

### Database Health Check
```bash
# MongoDB health check
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Database statistics
docker-compose exec mongodb mongosh anvil_recipes --eval "db.stats()"
```

## 📊 Resource Management

### Development Resources
```yaml
webservice:
  cpus: 0.25
  memory: 256MB

mongodb:
  cpus: 0.5
  memory: 512MB
```

### Production Resources
```yaml
webservice:
  cpus: 0.5
  memory: 512MB

mongodb:
  cpus: 1.0
  memory: 1GB
```

## 🔄 Data Persistence

### Volume Management
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect webservice-impl_mongodb_data

# Backup volume
docker run --rm -v webservice-impl_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb_backup.tar.gz -C /data .
```

### Database Backup and Restore
```bash
# Backup database
docker-compose exec mongodb mongodump --db anvil_recipes --out /backup/$(date +%Y%m%d_%H%M%S)

# Restore database
docker-compose exec mongodb mongorestore --db anvil_recipes /backup/backup_directory
```

## 🌐 Networking

### Network Configuration
```bash
# List networks
docker network ls

# Inspect network
docker network inspect webservice-impl_anvil-network

# Connect to network
docker network connect webservice-impl_anvil-network external_container
```

### Port Mapping
- **Web Service**: `9876` (configurable via `PORT` environment variable)
- **MongoDB**: `27017` (internal network only in production)

## 🔒 Security Considerations

### Non-Root Execution
The container runs as a non-privileged user (`appuser`) for security.

### Environment Variables
- Store sensitive data in environment variables
- Use Docker secrets for production deployments
- Never commit `.env` files to version control

### Network Security
```bash
# Run on internal network only
docker-compose -f docker-compose.prod.yml up -d

# Expose only necessary ports
# MongoDB is not exposed externally in production
```

## 🚨 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check logs
docker-compose logs webservice

# Check container status
docker-compose ps

# Restart service
docker-compose restart webservice
```

#### Database Connection Issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Reset database
docker-compose down -v
docker-compose up -d
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :9876

# Change port in .env
echo "PORT=9877" >> .env
docker-compose up -d
```

#### Memory Issues
```bash
# Check resource usage
docker stats

# Adjust memory limits in docker-compose.yml
webservice:
  deploy:
    resources:
      limits:
        memory: 1G
```

### Log Analysis
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs webservice

# Export logs
docker-compose logs > deployment_logs.txt
```

## 📈 Performance Optimization

### Image Optimization
- Multi-stage builds reduce image size
- Alpine Linux base image
- Minimal dependencies

### Database Optimization
- Connection pooling configured
- Indexes created for query performance
- Persistent volumes for data durability

### Application Optimization
- Gin framework in release mode for production
- Health checks prevent serving unhealthy instances
- Graceful shutdown handling

## 🔄 Updates and Rollbacks

### Rolling Updates
```bash
# Update images
docker-compose pull

# Rolling restart
docker-compose up -d --no-deps webservice

# Check health after update
curl -f http://localhost:9876/health
```

### Rollback Procedure
```bash
# Stop current deployment
docker-compose down

# Deploy previous version
docker-compose up -d --scale webservice=0
docker tag anvil-recipes-webservice:previous anvil-recipes-webservice:latest
docker-compose up -d
```

## 📊 Monitoring and Observability

### Docker Monitoring
```bash
# Container metrics
docker stats

# System monitoring
docker system df

# Event monitoring
docker events
```

### Application Monitoring
- Health check endpoints provide service status
- Structured logging in JSON format
- Request/response metrics via Gin middleware

## 🧪 Testing Deployment

### Integration Tests
```bash
# Run tests against container
docker-compose exec webservice go test ./...

# API testing
curl -X POST http://localhost:9876/api/v1/characters \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Character","race":"Human","class":"Fighter","level":1}'
```

### Load Testing
```bash
# Simple load test
for i in {1..100}; do
  curl -s http://localhost:9876/health &
done
wait
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Go Docker Best Practices](https://docs.docker.com/language/golang/)
- [MongoDB Docker Guide](https://hub.docker.com/_/mongo)

## 🆘 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs`
3. Verify configuration in `.env` file
4. Ensure sufficient system resources
5. Check network connectivity and port availability