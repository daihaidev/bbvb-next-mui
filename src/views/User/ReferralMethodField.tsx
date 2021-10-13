import React from 'react'
import { Autocomplete } from '@material-ui/lab'
import { TextField, TextFieldProps } from '@material-ui/core'
import { REFERRAL_METHOD_OPTIONS } from '../../components/OnboardingModal/constants'

interface ReferralMethodFieldProps {
  // Controller props
  name?: string
  value?: string[]
  onChange: any

  // Autocomplete props
  TextFieldProps?: TextFieldProps
  ListboxProps?: object

  // TextField props
  label?: string
  placeholder?: string
  required?: boolean
  error?: any
  helperText?: string
}

const ReferralMethodField: React.FC<ReferralMethodFieldProps> = (props) => {
  const { value, onChange, name, label, placeholder, required, error, helperText, TextFieldProps, ...rest } = props

  return (
    <Autocomplete
      options={REFERRAL_METHOD_OPTIONS}
      value={value ?? []}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          placeholder={value?.length > 0 ? null : placeholder}
          required={required}
          variant="outlined"
          error={error}
          helperText={helperText}
          {...TextFieldProps}
        />
      )}
      onChange={(e, data) => onChange(data)}
      disableCloseOnSelect
      filterSelectedOptions
      multiple
      {...rest}
    />
  )
}

export default ReferralMethodField
