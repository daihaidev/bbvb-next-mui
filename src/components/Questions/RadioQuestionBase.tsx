import React, { useEffect } from 'react'
import kebabCase from 'lodash/kebabCase'
import { FormControlLabel, Radio, RadioGroup, RadioProps, Theme } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import { INITIAL_RADIO_VALUE } from '../Form/constants'
import QuestionLabel from './QuestionLabel'
import QuestionFormControl from './QuestionFormControl'

// Renders a Radio Question

interface RadioQuestionBaseProps {
  name: string
  options: Array<{ label: string; value: string }>
  title: string
  error?: boolean
  radio?: RadioProps
  onValueChange?: (value) => void
}

interface RadioQuestionBaseStyles {
  error?: boolean
}

const useStyles = makeStyles<Theme, RadioQuestionBaseStyles>((theme) => ({
  verticalField: {
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'column',
    '& .MuiFormControlLabel-root': {
      '&, & > .MuiRadio-root': {
        marginLeft: 0,
      },
    },
  },
  radioGroup: {
    flexDirection: 'row',
  },
  radioWrapper: {
    [theme.breakpoints.down('sm')]: {
      '&, & > .MuiRadio-root': {
        marginLeft: 0,
      },
    },
    '& .MuiFormControlLabel-label': {
      color: ({ error }) => (error ? theme.palette.error.main : theme.palette.primary.light),
    },
  },
  radio: {
    padding: 0,
    margin: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      '&:nth-child(1)': {
        color: ({ error }) => (error ? theme.palette.error.main : theme.palette.primary.light),
      },
      '&:nth-child(2)': {
        color: ({ error }) => (error ? theme.palette.error.main : theme.palette.primary.light),
      },
    },
  },
}))

const RadioQuestionBase: React.FC<RadioQuestionBaseProps> = (props) => {
  const { error, title, name, options, radio, onValueChange } = props
  const { className: radioClassName, ...nextRadioProps } = radio

  const isVerticalFormControl = options.length > 2

  const [value, setValue] = React.useState(INITIAL_RADIO_VALUE)
  const handleChange = (event) => {
    setValue(event.target.value)
  }
  useEffect(() => {
    if (onValueChange && value !== INITIAL_RADIO_VALUE) {
      onValueChange(value)
    }
  }, [onValueChange, value])

  const classes = useStyles({ error })

  return (
    <QuestionFormControl error={error} className={clsx(classes.root, isVerticalFormControl && classes.verticalField)}>
      <QuestionLabel>{title}</QuestionLabel>
      <RadioGroup aria-label={name} name={name} value={value} onChange={handleChange} className={classes.radioGroup}>
        {options.map(({ label, value }) => (
          <FormControlLabel
            value={value}
            control={
              <Radio size="small" className={clsx(classes.radio, radioClassName)} disableRipple {...nextRadioProps} />
            }
            label={label}
            key={kebabCase(value)}
            className={classes.radioWrapper}
          />
        ))}
      </RadioGroup>
    </QuestionFormControl>
  )
}

export default RadioQuestionBase
