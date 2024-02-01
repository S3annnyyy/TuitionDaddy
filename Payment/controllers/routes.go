package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/checkout/session"
	"github.com/stripe/stripe-go/v76/paymentintent"
)

func Payment(c *gin.Context) {
	var body struct {
		Amount float64 `json:"amount"`
	}

	if c.BindJSON(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	// Convert amount to cents
	amountInCents := int64(body.Amount * 100)

	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{
			"card",
		}),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String("sgd"), // Replace with your desired currency code
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String("Custom Payment"), // Replace with your desired product name
					},
					UnitAmount: stripe.Int64(amountInCents),
				},
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		SuccessURL: stripe.String("https://stripe.com"), // Replace with your success URL
		CancelURL:  stripe.String("https://stripe.com"), // Replace with your cancel URL
	}

	session, err := session.New(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to initialize payment",
		})
		return
	}

	c.JSON(http.StatusSeeOther, gin.H{
		"url": session.URL,
	})
}

func PaynowPayment(c *gin.Context) {
	var body struct {
		Amount float64
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	amountInCents := int64(body.Amount * 100)

	params := &stripe.PaymentIntentParams{
		Amount:             stripe.Int64(amountInCents),
		Currency:           stripe.String(string(stripe.CurrencySGD)),
		PaymentMethodTypes: []*string{stripe.String("paynow")},
		PaymentMethodData: &stripe.PaymentIntentPaymentMethodDataParams{
			Type: stripe.String("paynow"),
		},
		ConfirmationMethod: stripe.String("automatic"),
		Confirm:            stripe.Bool(true),
	}

	intent, err := paymentintent.New(params)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to initialize payment",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"clientSecret": intent.ClientSecret,
	})
}
