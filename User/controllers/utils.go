package controllers

import (
	"path/filepath"
)

// Function to get content type based on file extension
func GetContentType(fileName string) string {
	extension := filepath.Ext(fileName)
	switch extension {
	case ".jpeg", ".jpg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".pdf":
		return "application/pdf"
	default:
		return "application/octet-stream" // Default content type
	}
}
