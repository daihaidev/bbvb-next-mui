import React, { useCallback, useEffect } from 'react'
import { useFormContext, ValidationOptions } from 'react-hook-form'
import SelectQuestionBase from '../SelectQuestionBase'

// Link up Select Question with react-hook-form

interface SelectQuestionProps extends React.ComponentProps<typeof SelectQuestionBase> {
  name: string
  validation?: ValidationOptions
}

const RhfSelectQuestion: React.FC<SelectQuestionProps> = (props) => {
  const { name, validation = {}, ...rest } = props
  const { errors, register, triggerValidation, setValue } = useFormContext()

  useEffect(() => {
    register({ name }, validation)
  }, [])

  const onValueSet = useCallback(
    (value) => {
      setValue(name, value)
    },
    [name]
  )

  const onValueChange = useCallback(() => {
    // Trigger validation check on every value change
    triggerValidation(name)
  }, [name])

  const error = Boolean(errors && errors[name])

  return <SelectQuestionBase onValueSet={onValueSet} onValueChange={onValueChange} error={error} {...rest} />
}

export default RhfSelectQuestion
