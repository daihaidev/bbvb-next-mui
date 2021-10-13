import React from 'react'
import { Theme } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

interface ToggleOption {
  title: string
  value: string
}

interface ToggleGroupProps {
  options: ToggleOption[]
  value: string
  handleChange: (e) => void
}

const ToggleGroup: React.FC<ToggleGroupProps> = (props) => {
  const { options, value, handleChange } = props

  const TextToggleButton = withStyles((theme: Theme) => ({
    root: {
      fontSize: theme.typography.pxToRem(12),
      color: theme.palette.text.light,
      fontWeight: 400,
      border: 'none',
      height: 'unset',
      lineHeight: 1,
      letterSpacing: '0.3px',
      padding: theme.spacing(0, 0.5),
      '&:hover, &.Mui-selected, &.Mui-selected:hover': {
        fontWeight: 500,
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
      },
    },
  }))(ToggleButton)

  return (
    <ToggleButtonGroup value={value} exclusive onChange={handleChange}>
      {options?.map((option) => (
        <TextToggleButton disableRipple key={option.title} value={option.value}>
          {option.title}
        </TextToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default ToggleGroup
