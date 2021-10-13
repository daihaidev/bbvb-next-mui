import React, { useEffect, useState } from 'react'
import kebabCase from 'lodash/kebabCase'
import { MenuItem, Select, Theme } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { INITIAL_SELECT_VALUE } from '../Form/constants'
import QuestionFormControl from './QuestionFormControl'
import QuestionLabel from './QuestionLabel'

// Renders a Select Question

interface SelectQuestionBaseProps {
  title: string
  options: Array<{ value: string; label: string }>
  error?: boolean
  onValueChange?: (value) => void
  onValueSet?: (value) => void
}

interface SelectQuestionBaseStyles {
  error?: boolean
}

const useStyles = makeStyles<Theme, SelectQuestionBaseStyles>((theme) => ({
  select: {
    backgroundColor: '#fbfbfb',
    color: ({ error }) => (error ? theme.palette.error.main : theme.palette.primary.light),
    fontWeight: 600,
    '& .MuiSelect-root': {
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(1.25),
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },
  },
}))

const SelectQuestionBase: React.FC<SelectQuestionBaseProps> = (props) => {
  const { title, options, error, onValueSet, onValueChange } = props

  const [value, setValue] = useState(INITIAL_SELECT_VALUE)

  const onSelectChange = (e: any) => {
    setValue(e.target.value)
    const {
      target: { value: nextValue },
    } = e
    setValue(nextValue)

    if (onValueSet) {
      onValueSet(nextValue)
    }
  }

  useEffect(() => {
    // Execute only if value is no longer initial value
    if (onValueChange && value !== INITIAL_SELECT_VALUE) {
      onValueChange(value)
    }
  }, [onValueChange, value])

  const classes = useStyles({ error })

  return (
    <QuestionFormControl error={error}>
      <QuestionLabel>{title}</QuestionLabel>
      <Select variant="outlined" displayEmpty className={classes.select} value={value} onChange={onSelectChange}>
        {/* Placeholder */}
        <MenuItem value={INITIAL_SELECT_VALUE} disabled>
          Select an option
        </MenuItem>
        {options.map(({ label, value }) => (
          <MenuItem value={value} key={kebabCase(value)}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </QuestionFormControl>
  )
}

export default SelectQuestionBase
