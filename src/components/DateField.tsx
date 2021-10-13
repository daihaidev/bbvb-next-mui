import React from 'react'
import { DatePicker, DatePickerProps } from '@material-ui/pickers'

interface DateFieldProps extends Omit<DatePickerProps, 'value'> {
  value?: object
}

const DateField: React.FC<DateFieldProps> = (props) => {
  const { value, onChange, ...rest } = props

  return (
    <DatePicker
      value={value}
      onChange={onChange}
      autoOk
      openTo="year"
      views={['year', 'month', 'date']}
      fullWidth
      inputVariant="outlined"
      format="DD/MM/YYYY"
      {...rest}
    />
  )
}

export default DateField
