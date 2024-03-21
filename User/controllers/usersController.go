package controllers

import (
	"TuitionDaddy/User/initializers"
	"TuitionDaddy/User/models"
	"context"
	"encoding/json"
	"fmt"
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

	// get file type of image and parse to s3
	fileType := GetContentType(image.Filename)
	// Upload the image to s3 bucket
	uploadResult, uploadError := initializers.Uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket:             aws.String(os.Getenv("AWS_S3_BUCKET_NAME")),
		Key:                aws.String(image.Filename),
		Body:               transcript,
		ACL:                "public-read",
		ContentDisposition: aws.String("inline"),
		ContentType:        aws.String(fileType),
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
		"token":    tokenString,
		"userID":   user.ID,
	})
}

func Validate(c *gin.Context) {
	user, _ := c.Get("user")
	userEmail := user.(models.User).Email

	c.JSON(http.StatusOK, gin.H{
		"message": userEmail + " user is logged in",
	})
}

func RetrieveTranscript(c *gin.Context) {
	user, userExists := c.Get("user")
	if !userExists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not retrieve user details",
		})
		return
	}

	userTranscriptUrl := user.(models.User).Transcript

	c.JSON(http.StatusOK, gin.H{
		"response": userTranscriptUrl,
	})
}

func RetrieveUserInfo(c *gin.Context) {
	user, userExists := c.Get("user")

	if !userExists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not retrieve user details",
		})
		return
	}

	userInfo, ok := user.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to parse user information",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"response": userInfo,
	})
}

func RetrieveUserPaymentDetails(c *gin.Context) {
	// Get UserID off req body
	var body struct {
		UserID int
	}

	// Debugging: Print the raw request body
	rawBody, err := c.GetRawData()
	if err != nil {
		// Handle error
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read request body",
		})
		return
	}
	fmt.Println("Raw request body:", string(rawBody))

	// Parse JSON data from rawBody into body struct
	if err := json.Unmarshal(rawBody, &body); err != nil {
		// Handle JSON parsing error
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to parse request body",
		})
		return
	}

	// Debugging: Print the parsed UserID
	fmt.Println("Parsed UserID:", body.UserID)

	// Lookup requested user
	var user models.User
	initializers.DB.First(&user, "ID = ?", body.UserID)
	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid userID",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": user.StripeAccountID,
	})
}

func StoreResourceLinks(c *gin.Context) {
	userID := c.Param("userID")

	var newResourceLinksMap map[string]string
	if err := c.ShouldBindJSON(&newResourceLinksMap); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := initializers.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var existingResourceLinksMap map[string]string
	if user.ResourceLinks != "" {
		err := json.Unmarshal([]byte(user.ResourceLinks), &existingResourceLinksMap)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deserialize existing resource links"})
			return
		}
	} else {
		existingResourceLinksMap = make(map[string]string)
	}

	for key, value := range newResourceLinksMap {
		existingResourceLinksMap[key] = value
	}

	jsonData, err := json.Marshal(existingResourceLinksMap)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize resource links"})
		return
	}

	user.ResourceLinks = string(jsonData)
	if err := initializers.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store resource links"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resource links stored successfully"})
}

func RetrieveResourceLinks(c *gin.Context) {
	userID := c.Param("userID")

	var user models.User
	if err := initializers.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var resourceLinksMap map[string]string
	err := json.Unmarshal([]byte(user.ResourceLinks), &resourceLinksMap)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deserialize resource links"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"resource_links": resourceLinksMap})
}
