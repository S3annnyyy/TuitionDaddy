// THIS FILE DEFINES THE USER STRUCT WITH GORM.MODEL DEFAULT FIELDS ID, CREATEDAT, UPDATEDAT, DELETEDAT
// TRANSCRIPTS ARE REFERENCE POINTERS TO IMAGES STORED ON AWS S3 BUCKET
package models

import (
	"gorm.io/gorm"
)

// gorm.Model definition
// type Model struct {
// 	ID        uint           `gorm:"primaryKey"`
// 	CreatedAt time.Time
// 	UpdatedAt time.Time
// 	DeletedAt gorm.DeletedAt `gorm:"index"`
//   }

type User struct {
	gorm.Model
	Email          string `gorm:"unique"`
	Password       string
	Username       string
	Organisation   string
	Role           string
	EducationLevel string
	Transcripts    []string `gorm:"type:jsonb"`
}
