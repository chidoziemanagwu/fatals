// src/app/payment/page.tsx
"use client"; // Add this line if you haven't already

import { getStripe } from '../../utils/stripe'; // Adjust the import path as necessary

const Payment = () => {
    const handleCheckout = async () => {
        const response = await fetch('/api/create-checkout-session/', {
            method: 'POST',
        });
        const session = await response.json();
        const stripe = await getStripe(); // Function to load Stripe.js

        if (stripe) {
            await stripe.redirectToCheckout({ sessionId: session.id });
        } else {
            console.error("Stripe.js failed to load.");
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Subscribe to Fantasy Baseball</h1>
            <button onClick={handleCheckout} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                Subscribe for \\$20
            </button>
        </div>
    );
};

export default Payment;