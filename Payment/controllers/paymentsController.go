package controllers

import (
	"fmt"
	"net/http"
	"payment/initializers"

	"payment/models"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/paymentintent"
)

// @Summary Card Payment
// @Schemes
// @Description Make a card Payment in Stripe
// @Tags Payment
// @Accept json
// @Param Body body models.PaymentBody true "Parameters"
// @Produce json
// @Success 200 {object} models.PaymentResponse "A successful response."
// @Failure 400 {object} models.PaymentError "Failed to read body."
// @Failure 500 {object} models.PaymentError "Failed to create payment intent."
// @Failure 500 {object} models.PaymentError "Failed to save payment information."
// @Router /payment [post]
func Payment(c *gin.Context) {
	var body models.PaymentBody

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, models.PaymentError{
			Error: "Failed to read body",
		})
		return
	}

	// Convert amount to smallest currency unit, e.g., cents
	amountInCents := int64(body.Price * 100)

	// Create a PaymentIntent with the amount and currency
	params := &stripe.PaymentIntentParams{
		Amount:        stripe.Int64(amountInCents),
		Currency:      stripe.String("sgd"),
		PaymentMethod: stripe.String(body.PaymentMethodID),
		Confirm:       stripe.Bool(true),
		TransferData: &stripe.PaymentIntentTransferDataParams{
			Destination: stripe.String(body.StripeAccountID),
		},
		Description:          stripe.String(body.Description),
		ReturnURL:            stripe.String("https://stripe.com"),
		ApplicationFeeAmount: stripe.Int64(100), // Uncomment to take a fee
	}

	// Confirm the PaymentIntent to finalize the payment
	pi, err := paymentintent.New(params)
	if err != nil {
		fmt.Printf("Error creating payment intent: %v", err)
		c.JSON(http.StatusInternalServerError, models.PaymentError{
			Error: "Failed to create payment intent",
		})
		return
	}

	// Create and save the payment record in your database
	paymentRecord := models.Payment{
		Description:     body.Description,
		Price:           body.Price,
		UserID:          body.UserID,
		SellerID:        body.SellerID,
		PaymentMethod:   "card",
		StripeAccountID: body.StripeAccountID,
		PaymentIntentID: pi.ID, // Save the PaymentIntent ID for future reference
	}

	if result := initializers.DB.Create(&paymentRecord); result.Error != nil {
		c.JSON(http.StatusInternalServerError, models.PaymentError{
			Error: "Failed to save payment information",
		})
		return
	}

	// Respond with success and the PaymentIntent ID or client secret as needed
	c.JSON(http.StatusOK, models.PaymentResponse{
		PaymentIntentID: pi.ID, // Use this on the backend for further operations like refunds
	})
}
