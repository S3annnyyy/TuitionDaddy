package main

import (
	"os"
	"payment/controllers"
	"payment/initializers"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76"
)

func init() {
	initializers.LoadEnvVariables()
	stripe.Key = os.Getenv("STRIPE_KEY")
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

	r.POST("/payment", controllers.Payment)
	r.POST("/paynow", controllers.PaynowPayment)

	r.Run()
}
