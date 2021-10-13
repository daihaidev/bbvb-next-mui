import React from 'react'
import { TableCell, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import * as colors from '@material-ui/core/colors'
import NumberField from './NumberField'

enum HighlightStateEnum {
  DEFAULT = 'default',
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

function getHighlightState(value) {
  if (typeof value !== 'number') {
    return HighlightStateEnum.DEFAULT
  }
  return value < 0 ? HighlightStateEnum.NEGATIVE : HighlightStateEnum.POSITIVE
}

function getHighlightColor(state) {
  switch (state) {
    case HighlightStateEnum.POSITIVE:
      return { text: colors.green[500], background: colors.green[50] }
    case HighlightStateEnum.NEGATIVE:
      return { text: colors.red[500], background: colors.red[50] }
    default:
      return { text: colors.grey[400], background: colors.grey[50] }
  }
}

interface HighlightNumberFieldStyles {
  highlightColor?: { text: string; background: string }
  align?: 'left' | 'right' | 'center'
}

const useStyles = makeStyles<Theme, HighlightNumberFieldStyles>((theme) => ({
  highlightCell: ({ highlightColor, align }) => ({
    backgroundColor: highlightColor.background,
    '& > .MuiInputBase-root': {
      color: highlightColor.text,
      '& > input': {
        textAlign: align,
        fontSize: theme.typography.pxToRem(16),
      },
    },
  }),
}))

const HighlightNumberField = (props) => {
  const { value, threshold, className, align = 'left', placeholder = 'Enter Value', ...rest } = props
  const highlightColor = getHighlightColor(getHighlightState(!value ? null : value - threshold))
  const classes = useStyles({ highlightColor, align })

  return (
    <TableCell align={align} className={clsx(classes.highlightCell, className)}>
      <NumberField value={value} placeholder={placeholder} {...rest} />
    </TableCell>
  )
}

export default HighlightNumberField
