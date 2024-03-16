import React, { FormEvent, useEffect, useState } from 'react';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { resourceDataType } from '../utils/types';
import { formatResources, purchaseStudyResource } from '../utils/mktplaceFunctions';

const stripePromise = loadStripe('pk_test_51OeWBEErUfNoRA7UgfVM1N113ESwwN5FzbC4nqkEfwSS0JXiB4rKQiKnCfGjvo0qIL3G19Mu6uG9IFk6kysN9XYx00cSUkYA88');

const PaymentForm: React.FC<{ items: resourceDataType[] }> = ({ items }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [buyerName, setBuyerName] = useState<string>("");
  const [buyerID, setBuyerID] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Real-time validation errors from the card Element
    if (elements) {
      const card = elements.getElement(CardElement);
      if (card) {
        card.on('change', (event) => {
          setError(event.error ? event.error.message : null);
        });
      }
    }
  }, [elements]);

  useEffect(() => {
    const name = sessionStorage.getItem("username")
    const ID = sessionStorage.getItem("userid")
    if (name && ID) {
      setBuyerName(name)
      setBuyerID(ID)
    }    
  })

  const handleSubmit = async (event: FormEvent) => {
    setDisabled(true);
    event.preventDefault();

    if (!stripe || !elements) {return;}    

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement) as StripeCardElement,
      billing_details: {
        name: buyerName, 
      },
    });

    if (error) {
      setError(error.message || null);
      setDisabled(false);
    } else {     
      // The PaymentMethod was successfully created      
      const paymentMethodId = paymentMethod.id;      
      console.log(`PaymentMethod ID: ${paymentMethodId}, Name: ${buyerName}`)      
      // format data by sellerID
      const formattedItems = formatResources(items)
      console.log(formattedItems)
      const description = `Purchase made by ${buyerName}`      
      let paymentIsSuccessful = true;
      // Parse to complex MS => Purchase study resource by each consolidated seller
      for (const sellerID in formattedItems) {
        const seller = formattedItems[sellerID];        
        const operationResult = await purchaseStudyResource(sellerID, seller.totalCost, seller.resources, paymentMethodId, description, buyerID)
        console.log(operationResult, typeof operationResult)
        // validate operation
        if (operationResult === false) {          
          paymentIsSuccessful = false;
          break;
        }
      }     

      console.log(paymentIsSuccessful, typeof paymentIsSuccessful)
      // notify user of outcome
      if (paymentIsSuccessful) {
        // Once purchase is made, reset cart and notify user payment has been made
        alert("Purchase made!")
        sessionStorage.setItem("cart", "")
        sessionStorage.setItem("cartCount", "0")
        navigate("/marketplace")
      } else {
        alert("There was error in purchase please try again!")
        setDisabled(false)
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
      <CardElement
        options={{
          classes: {
            base: 'py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
            invalid: 'border-red-500 focus:ring-red-500',
          },
        }}
      />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        Submit Payment
      </button>
    </form>
  );
};

export const StripePayment: React.FC<{items: resourceDataType[] }> = ({items}) => (
  <Elements stripe={stripePromise}>
    <PaymentForm items={items}/>
  </Elements>
);