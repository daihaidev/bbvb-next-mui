import React from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'

interface Stat {
  title: string
  value: string
  isPercentage?: boolean
  hasPositiveIcon?: boolean
  hasNegativeIcon?: boolean
}

interface StatCardProps {
  stat: Stat
}

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
    padding: theme.spacing(1, 0),
    borderBottom: `1px solid ${theme.palette.border.main}`,
  },
  title: {
    color: theme.palette.text.primary,
  },
  value: {
    marginRight: theme.spacing(1),
  },
  positiveIcon: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(1),
  },
  negativeIcon: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(1),
  },
}))

const OverviewListCard: React.FC<StatCardProps> = (props) => {
  const { stat } = props
  const { title, value, isPercentage, hasPositiveIcon, hasNegativeIcon } = stat || {}
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      <Box display="flex" alignItems="center">
        {hasPositiveIcon && <TrendingUpIcon fontSize="inherit" className={classes.positiveIcon} />}
        {hasNegativeIcon && <TrendingDownIcon fontSize="inherit" className={classes.negativeIcon} />}
        <Typography className={classes.value} variant="h6">
          {`${value}${isPercentage ? '%' : ''}`}
        </Typography>
      </Box>
    </Box>
  )
}

export default OverviewListCard
