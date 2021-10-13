import React, { useState } from 'react'
import { CardNumberElement } from '@stripe/react-stripe-js'
import CardFieldWrapper from './CardFieldWrapper'
import { useGetCardElementStyle } from './constants'

interface CardNumberProps extends React.ComponentProps<typeof CardNumberElement> {
  wrapper?: React.ComponentProps<typeof CardFieldWrapper>
}

const CardNumber: React.FC<CardNumberProps> = (props) => {
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
    <CardFieldWrapper label="Card Number" error={error} {...wrapper}>
      <CardNumberElement
        options={{ showIcon: true, ...cardElementStyle, ...options }}
        onChange={handleChange}
        {...rest}
      />
    </CardFieldWrapper>
  )
}

export default CardNumber
