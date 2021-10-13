import React, { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, FormLabel, FormControl, FormHelperText, InputBase, Theme } from '@material-ui/core'

interface NumberStepperProps extends Omit<React.ComponentProps<typeof InputBase>, 'onChange'> {
  value?: number
  helperText?: React.ReactNode
  label?: React.ReactNode
  onChange?: (value: number | '') => void
  wrapper?: React.ComponentProps<typeof FormControl>
  min?: number
  max?: number
}

interface NumberStepperStyles {
  error?: boolean
}

const useStyles = makeStyles<Theme, NumberStepperStyles>((theme) => ({
  optionHeader: {
    fontWeight: 600,
    display: 'inline',
  },
  quantityWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    '& > *': {
      '&:not(.Mui-disabled)': {
        borderColor: ({ error }) => (error ? theme.palette.error.main : theme.palette.primary),
      },
      '&.MuiButton-outlined.Mui-disabled': {
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRight: 0,
      },
    },
  },
  button: {
    height: 40,
    minWidth: 32,
    [theme.breakpoints.down('xs')]: {
      height: 28,
      width: 28,
      // Overrides min-width in NumberStepper Component
      minWidth: 28,
    },
  },
  subtractQuantityButton: {
    borderRight: 0,
    borderRadius: '20px 0 0 20px',
  },
  addQuantityButton: {
    borderLeft: 0,
    borderRadius: '0 20px 20px 0',
  },
  input: {
    fontSize: theme.typography.button.fontSize,
    borderTop: `1px solid rgba(0, 0, 0, 0.23)`,
    borderBottom: `1px solid rgba(0, 0, 0, 0.23)`,
    height: 40,
    width: 32,
    textAlign: 'center',
    align: 'center',
    '& input': {
      textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      height: 28,
      width: 28,
      padding: 0,
    },
  },
}))

const NumberStepper: React.FC<NumberStepperProps> = (props) => {
  const { value = 0, onChange, disabled, helperText, label, error, min, max, ...rest }: NumberStepperProps = props || {}
  const [quantity, setQuantity] = useState<number | ''>(value)

  useEffect(() => {
    if (quantity !== value) {
      // If passed in value is changed and state's value is different, update state to ensure values match
      setQuantity(value)
    }
  }, [value])

  const getIsMaxReached = useCallback((value) => !Number.isNaN(max) && value >= max, [max])
  const getIsMinReached = useCallback((value) => !Number.isNaN(min) && value <= min, [min])
  const isMaxReached = getIsMaxReached(quantity)
  const isMinReached = getIsMinReached(quantity)

  const handleUpdateQuantity = (nextQuantity: number | '') => {
    // If component is controlled from calling component, do not update state within this component to prevent mismatch of state values
    if (onChange) {
      onChange(nextQuantity)
      return
    }
    setQuantity(nextQuantity)
  }

  const handleAddQuantity = () => {
    const nextQuantity = Number.isNaN(Number(quantity)) ? 1 : Number(quantity) + 1
    handleUpdateQuantity(nextQuantity)
  }

  const handleSubtractQuantity = () => {
    const nextQuantity = Number.isNaN(Number(quantity)) ? 0 : Number(quantity) - 1
    handleUpdateQuantity(nextQuantity)
  }

  const handleChange = (e: any) => {
    const {
      target: { value },
    } = e
    if (value === '' || value === '-') {
      // Accept both empty string '' and '-' as these could be typed when typing the next number
      handleUpdateQuantity(value)
      return
    }

    const nextValue = Number(value)
    if (!Number.isNaN(nextValue)) {
      if (getIsMaxReached(nextValue)) {
        handleUpdateQuantity(max)
        return
      }

      if (getIsMinReached(nextValue)) {
        handleUpdateQuantity(min)
        return
      }

      handleUpdateQuantity(nextValue)
    }
  }

  const classes = useStyles(props)

  return (
    <FormControl error={error} disabled={disabled}>
      {label && <FormLabel>{label}</FormLabel>}
      <Box className={classes.quantityWrapper}>
        <Button
          variant="outlined"
          onClick={handleSubtractQuantity}
          className={clsx(classes.button, classes.subtractQuantityButton)}
          disabled={disabled || isMinReached}
        >
          -
        </Button>
        <InputBase
          className={classes.input}
          value={quantity}
          onChange={handleChange}
          disabled={disabled}
          readOnly
          {...rest}
        />
        <Button
          variant="outlined"
          onClick={handleAddQuantity}
          className={clsx(classes.button, classes.addQuantityButton)}
          disabled={disabled || isMaxReached}
        >
          +
        </Button>
      </Box>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default NumberStepper
