import React, { useCallback, useEffect, useState } from 'react'
import isEqual from 'lodash/isEqual'
import kebabCase from 'lodash/kebabCase'
import clsx from 'clsx'
import { FormControlLabelProps } from '@material-ui/core/FormControlLabel'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button, FormControl, FormControlProps, FormHelperText, FormLabel, Grid } from '@material-ui/core'

interface RadioButtonOption {
  value: any
  label: React.ReactNode
  key?: string // for options with complex values that cannot be stringified
  disabled?: boolean // for disabling unavailable options
}

interface RadioButtonsFieldProps extends React.ComponentProps<typeof Button> {
  error?: FormControlProps['error']
  label?: FormControlLabelProps['label']
  helperText?: React.ComponentProps<typeof FormHelperText>['children']
  wrapper?: FormControlProps
  disabled?: boolean
  options?: RadioButtonOption[]
  onChange?: (value: any) => void
  value?: any
}

interface RadioButtonsFieldStyles {
  error?: boolean
}

const useStyles = makeStyles<Theme, RadioButtonsFieldStyles>((theme) => ({
  root: {
    display: 'inline',
  },
  containerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start',
    },
  },
  buttonWrapper: {
    maxWidth: 125,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(1),
    },
  },
  radioBtn: {
    padding: theme.spacing(1, 2),
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  checked: {
    border: `2px solid ${theme.palette.secondary.main}`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}))

const RadioButtonsField: React.FC<RadioButtonsFieldProps> = (props) => {
  const {
    value: controlledValue,
    wrapper,
    helperText,
    onChange,
    disabled,
    error,
    label,
    options,
    className,
    ...rest
  } = props
  const classes = useStyles({ error })
  const [value, setValue] = useState(controlledValue)
  const handleClick = (option: RadioButtonOption) => {
    const nextValue = option.value
    setValue(nextValue)
    if (onChange) {
      onChange(nextValue)
    }
  }
  const isOptionChecked = useCallback((option) => isEqual(value, option.value), [value])
  useEffect(() => {
    if (value !== controlledValue) {
      setValue(controlledValue)
    }
  }, [controlledValue])
  return (
    <FormControl
      {...wrapper}
      fullWidth
      disabled={disabled}
      error={error}
      className={clsx(classes.root, wrapper && wrapper.className)}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <Grid container className={classes.containerWrapper}>
        {options.map((option) => (
          <Grid item xs={6} className={classes.buttonWrapper}>
            <Button
              key={option.key || kebabCase(option.value)}
              className={clsx(classes.radioBtn, className, isOptionChecked(option) && classes.checked)}
              disabled={disabled || option.disabled}
              variant="outlined"
              onClick={() => handleClick(option)}
              {...rest}
            >
              {option.label}
            </Button>
          </Grid>
        ))}
      </Grid>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default RadioButtonsField
