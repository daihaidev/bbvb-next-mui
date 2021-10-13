import React, { useEffect, useState } from 'react'
import { Box, IconButton, Theme } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { INITIAL_RATE_VALUE, RATE_OPTIONS } from '../Form/constants'
import QuestionLabel from './QuestionLabel'
import QuestionFormControl from './QuestionFormControl'

// Renders a Rating Question

interface RatingQuestionBaseProps {
  name: string
  title: string
  error?: boolean
  input?: React.HTMLProps<HTMLInputElement>
  onValueChange?: (value) => void
}

interface RatingQuestionBaseStyles {
  error?: boolean
}

const useStyles = makeStyles<Theme, RatingQuestionBaseStyles>((theme) => ({
  iconButtonsWrapper: {
    '& > :not(:first-child)': {
      marginLeft: theme.spacing(0.5),
    },
  },
  iconButton: {
    padding: 0,
    color: ({ error }) => (error ? theme.palette.error.main : '#969fba'),
    '&.Mui-disabled': {
      color: theme.palette.text.secondary,
    },
    '&:hover': {
      background: 'transparent',
      color: theme.palette.text.secondary,
    },
  },
}))

const RatingQuestionBase: React.FC<RatingQuestionBaseProps> = (props) => {
  const { name, title, error, input, onValueChange } = props

  const [value, setValue] = useState(INITIAL_RATE_VALUE)
  useEffect(() => {
    // Execute only if value is no longer initial value
    if (onValueChange && value !== INITIAL_RATE_VALUE) {
      onValueChange(value)
    }
  }, [onValueChange, value])

  const classes = useStyles({ error })

  return (
    <QuestionFormControl error={error}>
      <QuestionLabel>{title}</QuestionLabel>
      <input type="hidden" name={name} value={value} {...input} />
      <Box className={classes.iconButtonsWrapper}>
        {RATE_OPTIONS.map(({ icon: Icon, value: rateValue }) => (
          <IconButton
            disabled={rateValue === value}
            onClick={() => setValue(rateValue)}
            className={classes.iconButton}
            key={rateValue}
          >
            <Icon fontSize="large" />
          </IconButton>
        ))}
      </Box>
    </QuestionFormControl>
  )
}

export default RatingQuestionBase
