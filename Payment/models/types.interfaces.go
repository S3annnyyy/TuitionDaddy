package models

import (
	"time"

	"gorm.io/gorm"
)

type PaymentBody struct {
	Description     string  `json:"Description" binding:"required"`
	Price           float64 `json:"Price" binding:"required"`
	UserID          string  `json:"UserID" binding:"required"`
	SellerID        string  `json:"SellerID" binding:"required"`
	StripeAccountID string  `json:"StripeAccountID" binding:"required"`
	PaymentMethodID string  `json:"PaymentMethodID" binding:"required"`
}

type Payment struct {
	gorm.Model
	ID              uint      `json:"ID" gorm:"primaryKey"`
	SellerID        string    `json:"SellerID"`
	UserID          string    `json:"UserID"`
	Price           float64   `json:"Price"`
	Description     string    `json:"Description"`
	PaymentMethodID string    `json:"PaymentMethodID"`
	PaymentIntentID string    `json:"PaymentIntentID"`
	StripeAccountID string    `json:"StripeAccountID"`
	Refund          bool      `json:"Refund default:false"`
	CreatedAt       time.Time `json:"CreatedAt"`
	UpdatedAt       time.Time `json:"UpdatedAt"`
}

type PaymentResponse struct {
	PaymentIntentID string `json:"PaymentIntentID"`
}

type RefundResponse struct {
	Message string `json:"message"`
}

type PaymentError struct {
	Error string `json:"error"`
}
