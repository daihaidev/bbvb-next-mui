import React from 'react'
import { useFormContext, ValidationOptions } from 'react-hook-form'
import RadioQuestionBase from '../RadioQuestionBase'

// Link up Radio Question with react-hook-form

interface RhfRadioQuestionProps extends React.ComponentProps<typeof RadioQuestionBase> {
  validation?: ValidationOptions
}

const RhfRadioQuestion: React.FC<RhfRadioQuestionProps> = (props) => {
  const { name, radio, validation = {}, ...rest } = props
  const { register, errors } = useFormContext()

  const error = Boolean(errors && errors[name])

  return <RadioQuestionBase name={name} radio={{ inputRef: register(validation), ...radio }} error={error} {...rest} />
}

export default RhfRadioQuestion
