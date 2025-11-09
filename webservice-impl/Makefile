# Anvil Recipes Web Service - Makefile

.PHONY: help build run test clean docker-build docker-run docker-stop docker-logs swagger

# Default target
help: ## Show this help message
	@echo "Anvil Recipes Web Service"
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Go commands
build: ## Build the Go application
	go build -o bin/webservice main.go

run: ## Run the application locally
	go run main.go

test: ## Run tests
	go test ./...

clean: ## Clean build artifacts
	rm -rf bin/
	go clean

# Docker commands
docker-build: ## Build Docker image
	docker build -t anvil-recipes-webservice .

docker-run: ## Run Docker container
	docker run -p 9876:9876 --env-file .env anvil-recipes-webservice

docker-stop: ## Stop Docker containers
	docker-compose down

docker-logs: ## Show Docker container logs
	docker-compose logs -f

docker-dev: ## Start development environment
	docker-compose up -d

docker-prod: ## Start production environment
	docker-compose -f docker-compose.prod.yml up -d

# Development commands
swagger: ## Generate Swagger documentation
	go install github.com/swaggo/swag/cmd/swag@latest
	swag init -g main.go -o docs

deps: ## Download and tidy Go dependencies
	go mod download
	go mod tidy

fmt: ## Format Go code
	go fmt ./...

vet: ## Run go vet
	go vet ./...

lint: ## Run golangci-lint (if installed)
	golangci-lint run

# Health checks
health: ## Check service health
	curl -f http://localhost:9876/health || echo "Service not healthy"

health-db: ## Check database health
	docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Database commands
db-init: ## Initialize database
	docker-compose exec mongodb mongo /docker-entrypoint-initdb.d/init-mongo.js

db-backup: ## Backup database
	docker-compose exec mongodb mongodump --db anvil_recipes --out /tmp/backup/$(date +%Y%m%d_%H%M%S)

db-logs: ## Show database logs
	docker-compose logs mongodb

# Utility commands
env-example: ## Create .env.example file
	cp .env .env.example
	# Remove sensitive values from example
	sed -i 's/password123/YOUR_PASSWORD_HERE/g' .env.example
	sed -i 's/app_password123/YOUR_APP_PASSWORD_HERE/g' .env.example

install-tools: ## Install development tools
	go install github.com/swaggo/swag/cmd/swag@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# CI/CD commands
ci-test: ## Run tests for CI
	go test -v -race -coverprofile=coverage.out ./...

ci-build: ## Build for CI
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/webservice .

ci-docker: ## Build Docker image for CI
	docker build --target production -t anvil-recipes-webservice:$(shell git rev-parse --short HEAD) .

# Deployment commands
deploy-dev: ## Deploy to development
	docker-compose -f docker-compose.yml up -d --build

deploy-prod: ## Deploy to production
	docker-compose -f docker-compose.prod.yml up -d --build

rollback: ## Rollback to previous version
	docker-compose down
	docker tag anvil-recipes-webservice:previous anvil-recipes-webservice:latest
	docker-compose up -d