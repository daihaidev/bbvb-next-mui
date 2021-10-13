import React from 'react'
import { useFormContext, ValidationOptions } from 'react-hook-form'
import { TextField, TextFieldProps, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '@media screen and (-webkit-min-device-pixel-ratio:0)': {
      '& input': {
        fontSize: 16,
      },
    },
  },
}))

type RhfTextFieldProps = TextFieldProps & {
  name: string
  validation?: ValidationOptions
}

const RhfTextField: React.FC<RhfTextFieldProps> = (props) => {
  const classes = useStyles(props)
  const { name, validation = {}, inputProps, ...rest } = props
  const { register, errors } = useFormContext()

  const error = Boolean(errors && errors[name])

  return (
    <TextField
      className={classes.root}
      error={error}
      inputProps={{
        name,
        ...inputProps,
      }}
      inputRef={register(validation)}
      {...rest}
    />
  )
}

export default RhfTextField
