import React from 'react'
import { InputBase } from '@material-ui/core'
import NumberFormat, { NumberFormatProps } from 'react-number-format'

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
  value: NumberFormatProps['value']
}

const NumberFormatCustom = (props: NumberFormatCustomProps) => {
  const { inputRef, onChange, value, ...other } = props

  const nextValue = value === undefined ? null : value

  const handleChange = (values) =>
    onChange({
      target: {
        name: props.name,
        value: values.floatValue,
      },
    })

  return (
    <NumberFormat isNumericString {...other} value={nextValue} getInputRef={inputRef} onValueChange={handleChange} />
  )
}

const NumberField = (props) => {
  const { onChange, value, name, placeholder, ...rest } = props

  const handleChange = (e) => onChange(e.target.value)

  return (
    <InputBase
      value={value}
      onChange={handleChange}
      name={name}
      inputComponent={NumberFormatCustom as any}
      inputProps={rest}
      placeholder={placeholder}
    />
  )
}

export default NumberField
