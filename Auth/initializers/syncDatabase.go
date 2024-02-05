// THIS FILE AUTOMATICALLY MIGRATES USER MODEL DB SCHEMA,USING THE GORM PACKAGE FOR DATABASE INTERACTIONS.

package initializers

import "TuitionDaddy/Auth/models"

func SyncDatabase() {
	// Migrate the schema
	DB.AutoMigrate(&models.User{})
}
