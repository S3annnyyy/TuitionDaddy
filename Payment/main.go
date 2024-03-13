package main

import (
	"os"
	"payment/controllers"
	"payment/initializers"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76"

	docs "payment/docs"

	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func init() {
	initializers.LoadEnvVariables()
	stripe.Key = os.Getenv("STRIPE_KEY")
	initializers.ConnectionManager()
	initializers.SyncDatabase()
}

// CORS middleware
func corsMiddleware(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(204)
		return
	}

	c.Next()
}

func main() {
	// CompileDaemon --command="./Payment"
	// go run .
	r := gin.Default()

	// Enable CORS middleware
	r.Use(corsMiddleware)

	docs.SwaggerInfo.BasePath = "/"
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	r.POST("/payment", controllers.Payment)
	r.PATCH("/refund/:payment_intent_id", controllers.Refund)

	r.Run(":8080")
}
