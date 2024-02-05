package controllers

import (
	"TuitionDaddy/Auth/initializers"
	"TuitionDaddy/Auth/models"
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var EXPIRATION_DATE_1MTH = 3600 * 24 * 30

func Signup(c *gin.Context) {
	// Get form components from req body
	var body struct {
		Email          string
		Password       string
		Username       string
		Organisation   string
		Role           string
		EducationLevel string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	// Obtain Transcript image
	image, retrievalError := c.FormFile("Transcript")
	log.Println(image.Filename)

	if retrievalError != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not retrieve image",
		})

		return
	}

	// open image for upload
	transcript, openErr := image.Open()
	if openErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not open image",
		})

		return
	}
	// Upload the image to s3 bucket
	// c.SaveUploadedFile(transcript, "assets/"+transcript.Filename)
	uploadResult, uploadError := initializers.Uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(os.Getenv("AWS_S3_BUCKET_NAME")),
		Key:    aws.String(image.Filename),
		Body:   transcript,
		ACL:    "public-read",
	})
	if uploadError != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not upload image",
		})

		return
	}
	transcriptLocation := uploadResult.Location

	// Hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to hash password",
		})

		return
	}

	// Create user
	user := models.User{
		Email:          body.Email,
		Password:       string(hash),
		Username:       body.Username,
		Organisation:   body.Organisation,
		Role:           body.Role,
		EducationLevel: body.EducationLevel,
		Transcript:     string(transcriptLocation),
	}
	result := initializers.DB.Create(&user)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create user due to: " + result.Error.Error(),
		})

		return
	}

	// Response
	c.JSON(http.StatusOK, gin.H{
		"data": "Added user to DB successfully",
		"code": 200,
	})
}

func Login(c *gin.Context) {
	// Get email and password off req body
	var body struct {
		Email    string
		Password string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	// Lookup requested user
	var user models.User
	initializers.DB.First(&user, "email = ?", body.Email)
	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email or password",
		})

		return
	}
	// compare pass with hashed pass
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email or password",
		})

		return
	}

	// Generate JWT token
	// Create a new token object, specifying signing method and the claims
	// Sign and get the complete encoded token as a string using the secret
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create token",
		})

		return
	}

	// Send response back(cookie) + username
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, EXPIRATION_DATE_1MTH, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"username": user.Username, // Include the username in the response
	})
}

func Validate(c *gin.Context) {
	user, _ := c.Get("user")
	userEmail := user.(models.User).Email

	c.JSON(http.StatusOK, gin.H{
		"message": userEmail + " user is logged in",
	})
}
