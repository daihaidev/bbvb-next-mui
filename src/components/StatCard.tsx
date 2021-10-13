import React from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import { formatCurrency } from '../utils/utils'

// TODO: Confirm data shape, this is based on mock data.

interface StatCardStyles {
  performance: string
}

interface Stat {
  title: string
  value: number
  isPercentage?: boolean
  performance: string
}

interface StatCardProps {
  stat: Stat
}

const useStyles = makeStyles<Theme, StatCardStyles>((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  title: {
    color: theme.palette.text.tertiary,
  },
  value: {
    marginRight: theme.spacing(1),
  },
  positiveIcon: {
    color: theme.palette.success.main,
  },
  negativeIcon: {
    color: theme.palette.error.main,
  },
}))

const StatCard: React.FC<StatCardProps> = (props) => {
  const { stat } = props
  const { title, value, isPercentage, performance } = stat || {}
  const classes = useStyles({ performance })

  const isPositive = performance === 'positive'
  const performanceSign = isPositive ? '+' : ''

  const nextValue = isPercentage ? `${performanceSign}${value}%` : formatCurrency(value).replace('$', '')

  return (
    <Box className={classes.root}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      <Box display="flex" alignItems="center">
        <Typography className={classes.value} variant="h4">
          {nextValue}
        </Typography>
        {isPositive ? (
          <TrendingUpIcon fontSize="inherit" className={classes.positiveIcon} />
        ) : (
          <TrendingDownIcon fontSize="inherit" className={classes.negativeIcon} />
        )}
      </Box>
    </Box>
  )
}

export default StatCard
