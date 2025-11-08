# Docker Containerization Implementation

## Metadata

- **Name**: Docker Containerization Implementation
- **Type**: Enabler
- **ID**: ENB-941723
- **Approval**: Approved
- **Capability ID**: CAP-758392
- **Owner**: Product Team
- **Status**: Ready for Implementation
- **Priority**: High
- **Analysis Review**: Required
- **Code Review**: Required

## Technical Overview
### Purpose
Implements Docker containerization for the web application, service API, and MongoDB database with multi-stage builds, Docker Compose orchestration, health checks, and optimized production images for consistent deployment across all environments.

## Functional Requirements

| ID | Name | Requirement | Priority | Status | Approval |
|----|------|-------------|----------|--------|----------|
| FR-DOCK001 | Service Dockerfile | The service SHALL have a multi-stage Dockerfile (build + production) | High | Ready for Implementation | Approved |
| FR-DOCK002 | Web Dockerfile | The web app SHALL have a multi-stage Dockerfile (build + nginx runtime) | High | Ready for Implementation | Approved |
| FR-DOCK003 | Docker Compose Dev | Docker Compose SHALL configure all services for local development | High | Ready for Implementation | Approved |
| FR-DOCK004 | Docker Compose Prod | Docker Compose SHALL configure all services for production deployment | High | Ready for Implementation | Approved |
| FR-DOCK005 | MongoDB Persistence | MongoDB data SHALL persist in Docker named volumes | High | Ready for Implementation | Approved |
| FR-DOCK006 | Service Health Check | Service container SHALL implement /health endpoint check | High | Ready for Implementation | Approved |
| FR-DOCK007 | Web Health Check | Web container SHALL implement health check via nginx | High | Ready for Implementation | Approved |
| FR-DOCK008 | Environment Config | All containers SHALL accept environment variables from .env files | High | Ready for Implementation | Approved |
| FR-DOCK009 | Network Configuration | Containers SHALL communicate via Docker bridge network | High | Ready for Implementation | Approved |
| FR-DOCK010 | Hot Reload Dev | Development mode SHALL support hot reload via volume mounts | High | Ready for Implementation | Approved |
| FR-DOCK011 | Image Tagging | Images SHALL be tagged with version numbers | Medium | Ready for Implementation | Approved |
| FR-DOCK012 | Build Scripts | Project SHALL include npm scripts for Docker operations | Medium | Ready for Implementation | Approved |

## Non-Functional Requirements

| ID | Name | Type | Requirement | Priority | Status | Approval |
|----|------|------|-------------|----------|--------|----------|
| NFR-DOCK001 | Image Size Service | Performance | Service production image SHALL be < 200MB | High | Ready for Implementation | Approved |
| NFR-DOCK002 | Image Size Web | Performance | Web production image SHALL be < 100MB | High | Ready for Implementation | Approved |
| NFR-DOCK003 | Startup Time | Performance | All containers SHALL start within 30 seconds | High | Ready for Implementation | Approved |
| NFR-DOCK004 | Security | Security | Production containers SHALL run as non-root user | High | Ready for Implementation | Approved |
| NFR-DOCK005 | Resource Limits | Performance | Containers SHALL have defined CPU and memory limits | Medium | Ready for Implementation | Approved |

## Dependencies

### Internal Upstream Dependency

| Enabler ID | Description |
|------------|-------------|
| ENB-621847 | Environment Configuration - Provides environment variable configuration |
| ENB-501283 | Player Character Web Application - Web app to containerize |
| ENB-432891 | Create API - Part of service to containerize |

### Internal Downstream Impact

| Enabler ID | Description |
|------------|-------------|
| | All deployment processes depend on Docker images |

### External Dependencies

**External Upstream Dependencies**: 
- Docker Engine 20.10+
- Docker Compose 2.0+
- Node.js base images
- MongoDB Community Server official image (mongo:7-community)
- Nginx alpine image

**External Downstream Impact**: Deployment infrastructure uses these containers

## Technical Specifications

### Enabler Dependency Flow Diagram
```mermaid
flowchart TD
    ENB_941723["ENB-941723<br/>Docker Containerization<br/>🐳"]
    
    SERVICE_DF["Service Dockerfile<br/>Multi-stage Build<br/>📄"]
    WEB_DF["Web Dockerfile<br/>Build + Nginx<br/>📄"]
    COMPOSE_DEV["docker-compose.yml<br/>Development<br/>⚙️"]
    COMPOSE_PROD["docker-compose.prod.yml<br/>Production<br/>🚀"]
    
    SERVICE_IMG["Service Image<br/>node:18-alpine<br/>🎯"]
    WEB_IMG["Web Image<br/>nginx:alpine<br/>🎯"]
    MONGO_IMG["MongoDB Image<br/>mongo:7-community<br/>💾"]
    
    VOLUMES["Docker Volumes<br/>Data Persistence<br/>💿"]
    NETWORKS["Docker Networks<br/>Container Communication<br/>🔗"]
    
    ENB_941723 --> SERVICE_DF
    ENB_941723 --> WEB_DF
    ENB_941723 --> COMPOSE_DEV
    ENB_941723 --> COMPOSE_PROD
    
    SERVICE_DF -->|Builds| SERVICE_IMG
    WEB_DF -->|Builds| WEB_IMG
    COMPOSE_DEV -->|Uses| MONGO_IMG
    
    COMPOSE_DEV -->|Orchestrates| SERVICE_IMG
    COMPOSE_DEV -->|Orchestrates| WEB_IMG
    COMPOSE_DEV -->|Orchestrates| MONGO_IMG
    
    COMPOSE_DEV -->|Creates| VOLUMES
    COMPOSE_DEV -->|Creates| NETWORKS
    
    SERVICE_IMG -->|Connects| NETWORKS
    WEB_IMG -->|Connects| NETWORKS
    MONGO_IMG -->|Connects| NETWORKS
    MONGO_IMG -->|Stores| VOLUMES

    classDef enabler fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef dockerfile fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef image fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef resource fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    
    class ENB_941723 enabler
    class SERVICE_DF,WEB_DF,COMPOSE_DEV,COMPOSE_PROD dockerfile
    class SERVICE_IMG,WEB_IMG,MONGO_IMG image
    class VOLUMES,NETWORKS resource
```

### Dockerfile Configurations

#### service/Dockerfile
```dockerfile
# ==================================
# Multi-stage build for Service API
# ==================================

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Run tests (optional - can be done in CI/CD instead)
# RUN npm test

# Prune dev dependencies
RUN npm prune --production

# Stage 2: Production
FROM node:18-alpine

# Set environment
ENV NODE_ENV=production

# Create app user (non-root)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy only production dependencies and built code
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs src ./src

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start application
CMD ["node", "src/index.js"]
```

#### web/Dockerfile
```dockerfile
# ==================================
# Multi-stage build for Web Application
# ==================================

# Stage 1: Build React App
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Create nginx user (already exists, just for clarity)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx (runs as nginx user by default in alpine)
CMD ["nginx", "-g", "daemon off;"]
```

#### web/nginx.conf
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/x-font-ttf font/opentype image/svg+xml;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Serve static files
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Proxy API requests to service
        location /api {
            proxy_pass http://service:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Cache static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### Docker Compose Configurations

#### docker-compose.yml (Development)
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7-community
    container_name: pc-mongodb-dev
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    environment:
      MONGO_INITDB_DATABASE: player_characters
    networks:
      - pc-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  service:
    build:
      context: ./service
      dockerfile: Dockerfile
      target: builder  # Use builder stage for hot reload
    container_name: pc-service-dev
    restart: unless-stopped
    ports:
      - "3001:3001"
    volumes:
      # Hot reload: mount source code
      - ./service/src:/app/src:ro
      - ./service/package.json:/app/package.json:ro
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://mongodb:27017/player_characters
      PORT: 3001
      CORS_ORIGIN: http://localhost:3000
      LOG_LEVEL: debug
      RATE_LIMIT_ENABLED: false
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - pc-network
    command: npm run dev  # Use nodemon for hot reload

  web:
    build:
      context: ./web
      dockerfile: Dockerfile.dev  # Separate dev Dockerfile
    container_name: pc-web-dev
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      # Hot reload: mount source code
      - ./web/src:/app/src:ro
      - ./web/public:/app/public:ro
    environment:
      REACT_APP_API_URL: http://localhost:3001
      CHOKIDAR_USEPOLLING: true  # For hot reload in Docker
    depends_on:
      - service
    networks:
      - pc-network
    command: npm start

networks:
  pc-network:
    driver: bridge

volumes:
  mongodb_data:
    driver: local
```

#### docker-compose.prod.yml (Production)
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7-community
    container_name: pc-mongodb-prod
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: player_characters
    networks:
      - pc-network
    healthcheck:
      test: ["CMD", "mongosh", "-u", "${MONGO_USERNAME}", "-p", "${MONGO_PASSWORD}", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  service:
    build:
      context: ./service
      dockerfile: Dockerfile
      target: production  # Use production stage
    container_name: pc-service-prod-1
    restart: always
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongodb:27017/player_characters?authSource=admin
      PORT: 3001
      CORS_ORIGIN: ${WEB_URL}
      LOG_LEVEL: warn
      RATE_LIMIT_ENABLED: true
      RATE_LIMIT_MAX_REQUESTS: 100
      REQUEST_SIZE_LIMIT: 1mb
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - pc-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 30s
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    container_name: pc-web-prod-1
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - service
    networks:
      - pc-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.25'
          memory: 256M
        reservations:
          cpus: '0.1'
          memory: 128M

networks:
  pc-network:
    driver: bridge

volumes:
  mongodb_data:
    driver: local
  mongodb_config:
    driver: local
```

#### .env.example (for Docker Compose)
```bash
# ==============================================
# Docker Compose Environment Variables
# ==============================================

# MongoDB
MONGO_USERNAME=admin
MONGO_PASSWORD=change-this-password

# Web Application
WEB_URL=https://yourdomain.com

# Service API
# (Additional variables loaded from service/.env)
```

#### .dockerignore (for service and web)
```
node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
.dockerignore
Dockerfile
docker-compose*.yml
coverage
.nyc_output
dist
build
```

### Helper Scripts

#### package.json (root)
```json
{
  "name": "player-character-app",
  "scripts": {
    "docker:dev": "docker-compose up -d",
    "docker:dev:build": "docker-compose up -d --build",
    "docker:dev:logs": "docker-compose logs -f",
    "docker:dev:down": "docker-compose down",
    "docker:dev:clean": "docker-compose down -v",
    
    "docker:prod": "docker-compose -f docker-compose.prod.yml up -d",
    "docker:prod:build": "docker-compose -f docker-compose.prod.yml up -d --build",
    "docker:prod:logs": "docker-compose -f docker-compose.prod.yml logs -f",
    "docker:prod:down": "docker-compose -f docker-compose.prod.yml down",
    
    "docker:build:service": "docker build -t player-character-service:latest ./service",
    "docker:build:web": "docker build -t player-character-web:latest ./web",
    "docker:build:all": "npm run docker:build:service && npm run docker:build:web",
    
    "docker:ps": "docker-compose ps",
    "docker:health": "docker ps --filter name=pc- --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
  }
}
```

#### Makefile (Alternative)
```makefile
.PHONY: help dev prod build clean

help:
	@echo "Player Character Docker Commands"
	@echo "  make dev         - Start development environment"
	@echo "  make prod        - Start production environment"
	@echo "  make build       - Build all images"
	@echo "  make clean       - Stop and remove containers"
	@echo "  make logs        - View logs"

dev:
	docker-compose up -d

dev-build:
	docker-compose up -d --build

prod:
	docker-compose -f docker-compose.prod.yml up -d

prod-build:
	docker-compose -f docker-compose.prod.yml up -d --build

build:
	docker build -t player-character-service:latest ./service
	docker build -t player-character-web:latest ./web

clean:
	docker-compose down -v

logs:
	docker-compose logs -f

ps:
	docker-compose ps

health:
	@docker ps --filter name=pc- --format 'table {{.Names}}\t{{.Status}}'
```

### Health Check Endpoints

#### service/src/routes/health.js
```javascript
/**
 * Health check endpoint for Docker health checks.
 */
import express from 'express';
import { getDatabase } from '../database/connection.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const db = getDatabase();
    await db.admin().ping();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'player-character-api',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'player-character-api',
      database: 'disconnected',
      error: error.message,
    });
  }
});

export default router;
```

## Testing Strategy

### Docker Build Tests
- Verify all images build successfully
- Check image sizes meet targets
- Validate multi-stage builds work correctly

### Docker Compose Tests
- Test `docker-compose up` starts all services
- Verify health checks pass for all containers
- Test container communication via networks
- Verify MongoDB data persists across restarts

### Production Readiness Tests
- Verify containers run as non-root
- Test resource limits are enforced
- Validate security headers in nginx
- Test restart policies work correctly

## Success Criteria

- ✅ All Dockerfiles build without errors
- ✅ Service image < 200MB, Web image < 100MB
- ✅ All containers start within 30 seconds
- ✅ Health checks pass for all containers
- ✅ MongoDB data persists across restarts
- ✅ Hot reload works in development mode
- ✅ Containers run as non-root in production
- ✅ Docker Compose orchestrates all services correctly
- ✅ Documentation covers Docker setup
