// src/utils/stripe.ts
export const getStripe = () => {
    if (typeof window === 'undefined') return null;

    return window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY); // Ensure you have this environment variable set
};