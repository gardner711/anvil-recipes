# MongoDB Object Storage Implementation

## 📋 Overview

This implementation provides a complete MongoDB-based object storage solution for the Anvil Recipes application, specifically designed for D&D character data management. The implementation follows ENB-492038 specifications and provides a robust, scalable data storage layer with Docker containerization.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 2GB free disk space
- Ports 27017, 27018, 27019 available (configurable)

### Production Deployment

1. **Clone and navigate to the implementation directory:**
   ```bash
   cd objectstorage-impl
   ```

2. **Start the MongoDB container:**
   ```bash
   docker-compose up -d
   ```

3. **Verify the deployment:**
   ```bash
   docker-compose ps
   ```

4. **Check container health:**
   ```bash
   docker-compose logs mongodb
   ```

### Development Deployment

For development with hot-reload and separate data:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Testing Deployment

For isolated testing with replica set support:

```bash
docker-compose -f docker-compose.test.yml up -d
```

## 🔧 Configuration

### Environment Variables

The implementation uses environment variables defined in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_INITDB_ROOT_USERNAME` | `admin` | Root user username |
| `MONGO_INITDB_ROOT_PASSWORD` | `password123` | Root user password |
| `MONGO_INITDB_DATABASE` | `anvil_recipes` | Default database name |
| `MONGODB_APP_USERNAME` | `anvil_app` | Application user |
| `MONGODB_APP_PASSWORD` | `app_password123` | Application password |
| `MONGODB_POOL_SIZE` | `10` | Connection pool size |

### Database Schema

**Database:** `anvil_recipes`
**Collection:** `characters`

#### Document Structure
```json
{
  "_id": "ObjectId(...)",
  "characterName": "Aragorn",
  "race": "Human",
  "class": "Fighter",
  "level": 5,
  "alignment": "Lawful Good",
  "armorClass": 18,
  "speed": 30,
  "proficiencyBonus": 3,
  "appearance": "Tall, dark haired...",
  "backstory": "Son of Arathorn...",
  "createdAt": "2025-11-08T21:00:00.000Z",
  "updatedAt": "2025-11-08T21:00:00.000Z"
}
```

#### Indexes
- `_id` (primary, automatic)
- `characterName` (single field)
- `race` (single field)
- `class` (single field)
- `level` (single field)
- `alignment` (single field)
- `createdAt` (single field)
- `updatedAt` (single field)
- `{class: 1, level: 1}` (compound)
- `{race: 1, class: 1}` (compound)

## 🔗 Connection Details

### Production Environment
- **Host:** `localhost`
- **Port:** `27017`
- **Database:** `anvil_recipes`
- **Username:** `anvil_app`
- **Password:** `app_password123`
- **Connection String:** `mongodb://anvil_app:app_password123@localhost:27017/anvil_recipes`

### Development Environment
- **Host:** `localhost`
- **Port:** `27018`
- **Database:** `anvil_recipes_dev`

### Testing Environment
- **Host:** `localhost`
- **Port:** `27019`
- **Database:** `anvil_recipes_test`
- **Replica Set:** `rs0`

## 🛠️ Operations

### Basic Operations

**Start services:**
```bash
docker-compose up -d
```

**Stop services:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f mongodb
```

**Check status:**
```bash
docker-compose ps
```

### Database Operations

**Connect to database:**
```bash
docker-compose exec mongodb mongosh --username anvil_app --password app_password123 --authenticationDatabase anvil_recipes anvil_recipes
```

**List collections:**
```bash
db.getCollectionNames()
```

**View indexes:**
```bash
db.characters.getIndexes()
```

**Sample query:**
```bash
db.characters.find({class: "Fighter", level: {$gte: 5}})
```

### Backup and Restore

**Create backup:**
```bash
docker-compose exec mongodb mongodump --db anvil_recipes --out /backup/$(date +%Y%m%d_%H%M%S)
```

**Restore from backup:**
```bash
docker-compose exec mongodb mongorestore /backup/20251108_210000/anvil_recipes
```

## 📊 Monitoring

### Health Checks
The container includes automated health checks that run every 10 seconds:
- MongoDB ping command
- 5-second timeout
- 3 retry attempts
- 30-second startup grace period

### Performance Metrics
```bash
# Connection statistics
docker-compose exec mongodb mongosh --eval "db.serverStatus().connections"

# Database statistics
docker-compose exec mongodb mongosh anvil_recipes --eval "db.characters.stats()"

# Index usage
docker-compose exec mongodb mongosh anvil_recipes --eval "db.characters.aggregate([{\$indexStats: {}}])"
```

## 🧪 Testing

### Unit Testing
```bash
# Run tests against test environment
docker-compose -f docker-compose.test.yml up -d
npm test  # Assuming test scripts are configured
```

### Integration Testing
```bash
# Test full application stack
docker-compose -f docker-compose.test.yml up -d
# Run integration tests
```

### Load Testing
```bash
# Simulate concurrent connections
docker-compose exec mongodb mongosh --eval "
for(let i=0; i<100; i++) {
  db.characters.insertOne({
    characterName: 'TestChar' + i,
    race: 'Human',
    class: 'Fighter',
    level: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}
"
```

## 🔒 Security

### Authentication
- Root user with administrative privileges
- Application user with restricted read/write access
- Database-level authentication required

### Network Security
- Container isolation via Docker networks
- No external exposure by default
- Configurable port mapping

### Data Protection
- Persistent volumes for data durability
- Automated backup capabilities
- Access logging and monitoring

## 🚨 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker-compose logs mongodb

# Check system resources
docker system df

# Verify port availability
netstat -tulpn | grep :27017
```

**Connection refused:**
```bash
# Verify container is running
docker-compose ps

# Check health status
docker inspect --format='{{.State.Health.Status}}' anvil-recipes-mongodb

# Test connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

**Authentication failed:**
```bash
# Verify credentials in .env
cat .env | grep MONGO

# Check user exists
docker-compose exec mongodb mongosh --username admin --password password123 --authenticationDatabase admin --eval "db.getSiblingDB('anvil_recipes').getUsers()"
```

**Performance issues:**
```bash
# Check connection pool
docker-compose exec mongodb mongosh --eval "db.serverStatus().connections"

# Monitor slow queries
docker-compose exec mongodb mongosh anvil_recipes --eval "db.currentOp()"
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [ENB-492038 Specification](../objectstorage/specifications/492038-enabler.md)

## 🤝 Contributing

1. Follow the existing code structure
2. Update documentation for any changes
3. Test thoroughly before committing
4. Use meaningful commit messages

## 📄 License

This implementation is part of the Anvil Recipes project.