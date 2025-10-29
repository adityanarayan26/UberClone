import { NextResponse } from 'next/server';
// Make sure to add your secret key to .env.local
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { amount, currency } = await request.json();

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: currency || 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }
}
