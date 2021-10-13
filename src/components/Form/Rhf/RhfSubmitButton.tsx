import React, { useMemo } from 'react'
import { Button, ButtonProps } from '@material-ui/core'
import { useFormContext } from 'react-hook-form'

interface RhfSubmitButtonProps extends ButtonProps {
  disabledOnEmpty?: boolean
}

const RhfSubmitButton: React.FC<RhfSubmitButtonProps> = (props) => {
  const { disabled, disabledOnEmpty, ...rest } = props
  const {
    errors,
    formState: { isSubmitting },
    watch,
  } = useFormContext()

  // Only watch all fields if submit button needs to be disabled when all form fields are empty
  const watchAllFields = disabledOnEmpty && watch()
  const isEmpty = useMemo(() => {
    if (!watchAllFields) {
      // No fields are being watched, assume that form is never empty
      return false
    }
    return !Object.keys(watchAllFields).length || Object.values(watchAllFields).every((value) => !value)
  }, [watchAllFields])

  const nextDisabled = Boolean(
    disabled || isSubmitting || (errors && Object.keys(errors).length) || (disabledOnEmpty && isEmpty)
  )

  return <Button type="submit" variant="contained" color="secondary" disabled={nextDisabled} {...rest} />
}

export default RhfSubmitButton
