import React, { useEffect } from 'react'
import { FormContext, useForm } from 'react-hook-form'
import Form from '../index'

interface RhfFormProps extends React.ComponentProps<typeof Form> {
  onFormSubmitted?: (isSubmitted) => void
}

const RhfForm: React.FC<RhfFormProps> = (props) => {
  const { onSubmit, onFormSubmitted, ...rest } = props
  const methods = useForm()
  const {
    handleSubmit,
    formState: { isSubmitted },
  } = methods

  useEffect(() => {
    if (isSubmitted && onFormSubmitted) {
      onFormSubmitted(isSubmitted)
    }
  }, [isSubmitted])

  return (
    <FormContext {...methods}>
      <form {...rest} onSubmit={handleSubmit(onSubmit)} />
    </FormContext>
  )
}

export default RhfForm
