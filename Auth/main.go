package main

import (
	"TuitionDaddy/Auth/controllers"
	"TuitionDaddy/Auth/initializers"
	"TuitionDaddy/Auth/middleware"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectionManager()
	initializers.SyncDatabase()
	initializers.LoadS3Uploader()
}

// CORS middleware
func corsMiddleware(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(204)
		return
	}

	c.Next()
}

func main() {
	// compiledaemon --command="./Auth"
	// go run main.go
	r := gin.Default()
	r.Static("/assets", "./assets")

	// Set file limit to 8Mib
	r.MaxMultipartMemory = 8 << 20

	// Enable CORS middleware
	r.Use(corsMiddleware)

	r.POST("/signup", controllers.Signup)
	r.POST("/login", controllers.Login)
	r.GET("/validate", middleware.RequireAuth, controllers.Validate)

	r.Run() // listen and serve on 0.0.0.0:3000
}
