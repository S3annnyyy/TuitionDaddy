// THIS FILE DEFINES THE USER STRUCT WITH GORM.MODEL DEFAULT FIELDS ID, CREATEDAT, UPDATEDAT, DELETEDAT
package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"unique"`
	Password string
}
