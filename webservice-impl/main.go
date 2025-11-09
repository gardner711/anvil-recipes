package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "webservice/docs" // This is required for Swagger to find the docs
)

// @title Anvil Recipes Web Service API
// @version 1.0
// @description A RESTful web service for managing D&D character data
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:9876
// @BasePath /api/v1

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

func main() {
	// Set Gin mode based on environment
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "" {
		ginMode = "release"
	}
	gin.SetMode(ginMode)

	// Initialize Gin router
	r := gin.Default()

	// Add middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Health check endpoints
	r.GET("/health", healthCheck)
	r.GET("/health/live", livenessCheck)
	r.GET("/health/ready", readinessCheck)

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Characters endpoints (placeholder for future implementation)
		v1.GET("/characters", getCharacters)
		v1.POST("/characters", createCharacter)
		v1.GET("/characters/:id", getCharacter)
		v1.PUT("/characters/:id", updateCharacter)
		v1.DELETE("/characters/:id", deleteCharacter)
	}

	// Swagger documentation
	r.GET("/api-docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "9876" // Unique port as per requirements
	}

	log.Printf("Starting server on port %s", port)
	log.Printf("Swagger UI available at: http://localhost:%s/api-docs/index.html", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

// Health check response
type HealthResponse struct {
	Status  string `json:"status" example:"ok"`
	Service string `json:"service" example:"webservice"`
	Version string `json:"version" example:"1.0.0"`
}

// healthCheck godoc
// @Summary Health check endpoint
// @Description Returns the health status of the service
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} HealthResponse
// @Router /health [get]
func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, HealthResponse{
		Status:  "ok",
		Service: "webservice",
		Version: "1.0.0",
	})
}

// livenessCheck godoc
// @Summary Liveness probe
// @Description Kubernetes liveness probe endpoint
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} HealthResponse
// @Router /health/live [get]
func livenessCheck(c *gin.Context) {
	c.JSON(http.StatusOK, HealthResponse{
		Status:  "alive",
		Service: "webservice",
		Version: "1.0.0",
	})
}

// readinessCheck godoc
// @Summary Readiness probe
// @Description Kubernetes readiness probe endpoint
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} HealthResponse
// @Router /health/ready [get]
func readinessCheck(c *gin.Context) {
	// In a real implementation, this would check database connectivity
	c.JSON(http.StatusOK, HealthResponse{
		Status:  "ready",
		Service: "webservice",
		Version: "1.0.0",
	})
}

// Character represents a D&D character
type Character struct {
	ID        string `json:"id" example:"60d5ecb74b24c72b8c8b4567"`
	Name      string `json:"name" example:"Aragorn"`
	Race      string `json:"race" example:"Human"`
	Class     string `json:"class" example:"Fighter"`
	Level     int    `json:"level" example:"5"`
	CreatedAt string `json:"createdAt" example:"2025-11-09T08:00:00Z"`
	UpdatedAt string `json:"updatedAt" example:"2025-11-09T08:00:00Z"`
}

// getCharacters godoc
// @Summary Get all characters
// @Description Retrieve a list of all D&D characters
// @Tags characters
// @Accept json
// @Produce json
// @Success 200 {array} Character
// @Router /api/v1/characters [get]
func getCharacters(c *gin.Context) {
	// Placeholder implementation - returns empty array
	characters := []Character{}
	c.JSON(http.StatusOK, characters)
}

// createCharacter godoc
// @Summary Create a new character
// @Description Create a new D&D character
// @Tags characters
// @Accept json
// @Produce json
// @Param character body Character true "Character data"
// @Success 201 {object} Character
// @Router /api/v1/characters [post]
func createCharacter(c *gin.Context) {
	var character Character
	if err := c.ShouldBindJSON(&character); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Placeholder implementation - just return the input
	c.JSON(http.StatusCreated, character)
}

// getCharacter godoc
// @Summary Get a character by ID
// @Description Retrieve a specific D&D character by ID
// @Tags characters
// @Accept json
// @Produce json
// @Param id path string true "Character ID"
// @Success 200 {object} Character
// @Failure 404 {object} map[string]string
// @Router /api/v1/characters/{id} [get]
func getCharacter(c *gin.Context) {
	id := c.Param("id")

	// Placeholder implementation - return not found
	c.JSON(http.StatusNotFound, gin.H{"error": "Character not found", "id": id})
}

// updateCharacter godoc
// @Summary Update a character
// @Description Update an existing D&D character
// @Tags characters
// @Accept json
// @Produce json
// @Param id path string true "Character ID"
// @Param character body Character true "Updated character data"
// @Success 200 {object} Character
// @Failure 404 {object} map[string]string
// @Router /api/v1/characters/{id} [put]
func updateCharacter(c *gin.Context) {
	id := c.Param("id")
	var character Character

	if err := c.ShouldBindJSON(&character); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Placeholder implementation - return not found
	c.JSON(http.StatusNotFound, gin.H{"error": "Character not found", "id": id})
}

// deleteCharacter godoc
// @Summary Delete a character
// @Description Delete a D&D character by ID
// @Tags characters
// @Accept json
// @Produce json
// @Param id path string true "Character ID"
// @Success 204 {object} nil
// @Failure 404 {object} map[string]string
// @Router /api/v1/characters/{id} [delete]
func deleteCharacter(c *gin.Context) {
	id := c.Param("id")

	// Placeholder implementation - return not found
	c.JSON(http.StatusNotFound, gin.H{"error": "Character not found", "id": id})
}
