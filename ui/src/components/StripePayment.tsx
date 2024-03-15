import React, { FormEvent, useEffect, useState } from 'react';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your_publishable_key_here');

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(true);

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setDisabled(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement) as StripeCardElement,
      billing_details: {
        name: 'Jenny Rosen', // replace with the name entered by the user
      },
    });

    if (error) {
      setError(error.message || null);
      setDisabled(false);
    } else {
      // The PaymentMethod was successfully created
      // You can send the PaymentMethod ID to your server here
      const paymentMethodId = paymentMethod.id;
      console.log('PaymentMethod ID:', paymentMethodId);

      // Here you would also handle form submission to your backend using fetch or AJAX
      setDisabled(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <CardElement
        //   options={{
        //     style: {
        //       base: 'StripeElement py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
        //       invalid: 'StripeElement py-2 px-4 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500',
        //     },
        //   }}
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

export const StripePayment: React.FC = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);