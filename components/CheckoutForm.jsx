'use client'

import React, { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

const CheckoutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            setIsLoading(false);
            return;
        }

        // --- THIS IS THE FIX ---
        // 1. Call elements.submit() first to validate the form
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message);
            setIsLoading(false);
            return;
        }
        // --- END OF FIX ---

        try {
            // 2. Now, create the Payment Intent on the server
            const res = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amount, currency: 'inr' }),
            });

            const { clientSecret, error: backendError } = await res.json();

            if (backendError) {
                setErrorMessage(backendError.message);
                setIsLoading(false);
                return;
            }

            // 3. Confirm the payment on the client
            const { error: stripeError } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    // Redirect to a confirmation page after payment
                    return_url: `${window.location.origin}/payment-confirmation`,
                },
            });

            // This point will only be reached if there is an immediate error
            if (stripeError) {
                setErrorMessage(stripeError.message);
                setIsLoading(false);
            }

        } catch (error) {
            setErrorMessage('An unexpected error occurred.');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button
                type="submit"
                disabled={!stripe || isLoading}
                className={`w-full px-4 py-3 text-lg font-uberMedium rounded-lg text-white mt-6
                    ${!stripe || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}
                `}
            >
                {isLoading ? 'Processing...' : `Pay ₹${amount}`}
            </button>
            
            {/* Show error messages */}
            {errorMessage && <div className="text-red-600 text-center mt-4">{errorMessage}</div>}
        </form>
    )
}

export default CheckoutForm

