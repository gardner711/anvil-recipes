# Anvil Recipes Web Service

A RESTful web service for managing D&D character data, built with Go and Gin framework. This service provides a complete API for character management with MongoDB persistence and comprehensive documentation.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Go 1.23+ (for local development)

### Development Setup

1. **Clone and navigate to the project:**
   ```bash
   cd webservice-impl
   ```

2. **Start the services:**
   ```bash
   docker-compose up -d
   ```

3. **Verify the service is running:**
   ```bash
   curl http://localhost:9876/health
   ```

4. **View API documentation:**
   Open http://localhost:9876/api-docs/index.html in your browser

### Local Development

1. **Install dependencies:**
   ```bash
   go mod download
   ```

2. **Generate Swagger docs:**
   ```bash
   go install github.com/swaggo/swag/cmd/swag@latest
   swag init -g main.go -o docs
   ```

3. **Run the service:**
   ```bash
   go run main.go
   ```

## 📋 API Endpoints

### Health Checks
- `GET /health` - General health check
- `GET /health/live` - Kubernetes liveness probe
- `GET /health/ready` - Kubernetes readiness probe

### Characters API
- `GET /api/v1/characters` - List all characters
- `POST /api/v1/characters` - Create a new character
- `GET /api/v1/characters/{id}` - Get character by ID
- `PUT /api/v1/characters/{id}` - Update character
- `DELETE /api/v1/characters/{id}` - Delete character

## 🐳 Docker Deployment

### Development Environment
```bash
docker-compose up -d
```

### Production Environment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Build Custom Image
```bash
docker build -t anvil-recipes-webservice .
```

## 📚 Documentation

- **API Documentation**: http://localhost:9876/api-docs/index.html
- **Docker Guide**: See DOCKER.md for detailed deployment instructions
- **Environment Configuration**: See ENVIRONMENT.md for configuration options

## 🔧 Configuration

The service can be configured using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `9876` | Server port |
| `GIN_MODE` | `debug` | Gin framework mode |
| `MONGODB_URI` | `mongodb://localhost:27017/anvil_recipes` | MongoDB connection string |

See `.env` file for complete configuration options.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Web Service   │────│   MongoDB       │
│   (Go + Gin)    │    │   Container     │
│                 │    │   (mongo:7)     │
└─────────────────┘    └─────────────────┘
         │                       │
         │                       │
    ┌────▼────┐             ┌────▼────┐
    │  REST   │             │ Persistent │
    │  APIs   │             │  Volumes  │
    │         │             │ - /data/db│
    │         │             │ - /data/  │
    │         │             │   configdb│
    └─────────┘             └──────────┘
```

## 🧪 Testing

### Health Check
```bash
curl -f http://localhost:9876/health
```

### API Test
```bash
curl -X GET http://localhost:9876/api/v1/characters
```

### Database Connection Test
```bash
docker-compose exec mongodb mongosh anvil_recipes --eval "db.characters.find()"
```

## 🔒 Security

- Non-root container execution
- Health check monitoring
- Environment-based configuration
- CORS support for web clients

## 📊 Monitoring

The service includes comprehensive health checks:
- Container health checks via Docker
- Application health endpoints
- Database connectivity monitoring

## 🚀 Production Considerations

- Use `docker-compose.prod.yml` for production deployments
- Configure proper environment variables
- Set up reverse proxy (nginx/Caddy)
- Enable TLS/SSL
- Configure log aggregation
- Set up monitoring and alerting

## 📝 Development

### Adding New Endpoints
1. Add route handlers in `main.go`
2. Add Swagger annotations
3. Regenerate docs: `swag init`
4. Test the endpoint

### Database Schema Changes
Update the `init-mongo.js` script for schema changes and restart the MongoDB container.

## 🤝 Contributing

1. Follow the existing code style
2. Add Swagger documentation for new endpoints
3. Update tests for new functionality
4. Ensure Docker builds pass

## 📄 License

This project is part of the Anvil Recipes application suite.