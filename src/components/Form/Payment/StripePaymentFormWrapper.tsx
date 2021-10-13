import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import config from '../../../config'

export const stripePromise = loadStripe(config.stripe.publicKey)

const StripePaymentFormWrapper: React.FC = (props) => {
  const { children } = props
  return <Elements stripe={stripePromise}>{children}</Elements>
}

export default StripePaymentFormWrapper
