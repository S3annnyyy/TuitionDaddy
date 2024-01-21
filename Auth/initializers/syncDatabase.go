package initializers

import "TuitionDaddy/Auth/models"

func SyncDatabase() {
	// Migrate the schema
	DB.AutoMigrate(&models.User{})
}
