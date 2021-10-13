import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import * as colors from '@material-ui/core/colors'
import printPercentage from '../../utils/printPercentage'

interface HighlightPercentTrendStyles {
  isGrowthNegative?: boolean
}

const useStyles = makeStyles<Theme, HighlightPercentTrendStyles>((theme) => ({
  highlightLabel: ({ isGrowthNegative }) => ({
    color: isGrowthNegative ? colors.red['A200'] : colors.green['A700'],
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 500,
  }),
  highlightLabelWrapper: ({ isGrowthNegative }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: isGrowthNegative ? colors.red['A200'] : colors.green['A700'],
    '& > .MuiSvgIcon-root': {
      fontSize: theme.typography.pxToRem(20),
      marginRight: theme.spacing(0.5),
    },
  }),
}))

interface HighlightPercentTrendProps {
  percentValue: number
}

const HighlightPercentTrend: React.FC<HighlightPercentTrendProps> = ({ percentValue }) => {
  const classes = useStyles({ isGrowthNegative: percentValue < 0 })

  return (
    <div className={classes.highlightLabelWrapper}>
      {percentValue > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
      <Typography className={classes.highlightLabel}>{printPercentage(percentValue)}</Typography>
    </div>
  )
}

export default HighlightPercentTrend
