import React, { useState } from 'react'
import { CardExpiryElement } from '@stripe/react-stripe-js'
import CardFieldWrapper from './CardFieldWrapper'
import { useGetCardElementStyle } from './constants'

interface CardExpiryProps extends React.ComponentProps<typeof CardExpiryElement> {
  wrapper?: React.ComponentProps<typeof CardFieldWrapper>
}

const CardExpiry: React.FC<CardExpiryProps> = (props) => {
  const { wrapper, options, ...rest } = props

  const cardElementStyle = useGetCardElementStyle()

  const [error, setError] = useState()

  // Handle real-time validation errors from the card Element.
  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message)
    } else {
      setError(null)
    }
  }

  return (
    <CardFieldWrapper label="Expiration" error={error} {...wrapper}>
      <CardExpiryElement options={{ ...cardElementStyle, ...options }} onChange={handleChange} {...rest} />
    </CardFieldWrapper>
  )
}

export default CardExpiry
