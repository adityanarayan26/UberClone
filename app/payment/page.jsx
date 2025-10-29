'use client'

import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useSearchParams } from 'next/navigation'
import CheckoutForm from '@/components/CheckoutForm'
import Navbar from '@/components/Navbar' // Re-using Navbar

// Load Stripe with your public key
// Make sure to add this to your .env.local file
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
    const searchParams = useSearchParams();
    const price = searchParams.get('price');
    const carName = searchParams.get('carName');

    const options = {
        mode: 'payment',
        amount: Math.round(price * 100), // Stripe expects price in cents
        currency: 'inr', // Or make this dynamic based on region
    };

    return (
        <div className='h-screen w-full bg-zinc-100'>
            <Navbar />
            <div className='flex justify-center items-center mt-20'>
                <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
                    <h1 className='text-2xl font-uberMedium mb-2'>Confirm your ride</h1>
                    <p className='text-lg mb-6'>You are requesting a <span className='font-semibold'>{carName}</span> for <span className='font-semibold'>₹{price}</span></p>
                    
                    {/* Stripe Elements Wrapper */}
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm amount={Number(price)} />
                    </Elements>
                </div>
            </div>
        </div>
    )
}

export default PaymentPage
