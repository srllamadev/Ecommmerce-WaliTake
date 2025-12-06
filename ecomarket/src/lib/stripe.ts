import { Stripe, loadStripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (key && key.startsWith('pk_test_') && process.env.NEXT_PUBLIC_DISABLE_STRIPE !== 'true') {
      stripePromise = loadStripe(key)
    } else {
      stripePromise = Promise.resolve(null)
    }
  }
  return stripePromise
}

// Server-side Stripe client - lazy loaded
let stripeInstance: any = null

export const getStripeServer = () => {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (key && key.startsWith('sk_test_') && process.env.NEXT_PUBLIC_DISABLE_STRIPE !== 'true') {
      const StripeServer = require('stripe')
      stripeInstance = new StripeServer(key, {
        apiVersion: '2024-12-18.acacia',
      })
    }
  }
  return stripeInstance
}

// Export for backward compatibility
export const stripe = getStripeServer()