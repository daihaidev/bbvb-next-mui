import React, { useCallback } from 'react'
import { useFormContext, ValidationOptions } from 'react-hook-form'
import RatingQuestionBase from '../RatingQuestionBase'

// Hook up Select Question with react-hook-form

interface RhfRatingQuestionProps extends React.ComponentProps<typeof RatingQuestionBase> {
  validation?: ValidationOptions
}

const RhfRatingQuestion: React.FC<RhfRatingQuestionProps> = (props) => {
  const { name, validation = {}, ...rest } = props
  const { register, triggerValidation, errors } = useFormContext()

  const onValueChange = useCallback(() => {
    // Trigger validation check on every value change
    triggerValidation(name)
  }, [triggerValidation])

  const error = Boolean(errors && errors[name])

  return (
    <RatingQuestionBase
      onValueChange={onValueChange}
      error={error}
      name={name}
      input={{ ref: register(validation) }}
      {...rest}
    />
  )
}

export default RhfRatingQuestion
