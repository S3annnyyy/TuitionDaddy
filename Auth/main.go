package main

import (
	"TuitionDaddy/Auth/controllers"
	"TuitionDaddy/Auth/initializers"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectionManager()
	initializers.SyncDatabase()
}

func main() {
	// compiledaemon --command="./Auth"
	// go run .
	r := gin.Default()

	r.POST("/signup", controllers.Signup)
	r.POST("/login", controllers.Login)

	r.Run() // listen and serve on 0.0.0.0:3000
}
