// THIS FILE FACILITATES THE CONNECTION BETWEEN main.go AND POSTGRESQL DB HOSTED ON Supabase
package initializers

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"fmt"
)

var DB *gorm.DB

func ConnectionManager() {
	var err error
	dsn := os.Getenv("DB")
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	fmt.Println(&DB)
	fmt.Println("Error: ", err)

	if err != nil {
		panic("Failed to connect to Database")
	}

	fmt.Print("Successfully connected to Database\n")
}
