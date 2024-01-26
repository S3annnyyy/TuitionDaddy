// THIS FILE LOADS ENVIRONMENT VARIABLES FROM A .ENV FILE USING THE GITHUB JOHO/GODOTENV PACKAGE AND LOGS AN ERROR IF THE FILE CANNOT BE LOADED.

package initializers

import (
	"log"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}
