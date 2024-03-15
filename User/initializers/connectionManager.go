// THIS FILE FACILITATES THE CONNECTION BETWEEN main.go AND POSTGRESQL DB HOSTED ON ELEPHANT SQL
package initializers

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectionManager() {
	var err error
	dsn := os.Getenv("DB")
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to Database")
	}
}
