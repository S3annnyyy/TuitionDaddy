// THIS FILE AUTOMATICALLY MIGRATES USER MODEL DB SCHEMA,USING THE GORM PACKAGE FOR DATABASE INTERACTIONS.

package initializers

import "payment/models"

func SyncDatabase() {
	// Migrate the schema
	DB.AutoMigrate(&models.Payment{})

	return
}
