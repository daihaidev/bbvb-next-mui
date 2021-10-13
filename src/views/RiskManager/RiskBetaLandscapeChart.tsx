import React from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import BubbleChart from '../../components/Charts/BubbleChart'
import { Asset } from '../../utils/getCalculatedAssetsAndTotals'
import { getRiskBetaLandscapeChartData } from './utils'
import CircularLoader from '../../components/CircularLoader'

interface RiskBetaLandscapeChartProps {
  loading: boolean
  assets: Asset[]
}

const useStyles = makeStyles((theme: Theme) => ({
  sectionWrapper: {
    padding: theme.spacing(4, 0),
    height: '100%',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    marginRight: theme.spacing(1),
    lineHeight: 1,
  },
  chartWrapper: {
    marginTop: theme.spacing(3),
  },
}))

const RiskBetaLandscapeChart: React.FC<RiskBetaLandscapeChartProps> = (props) => {
  const { loading, assets } = props
  const classes = useStyles(props)
  const chartData = getRiskBetaLandscapeChartData(assets)

  return (
    <CircularLoader loading={loading}>
      <Box className={classes.sectionWrapper} display="flex" flexDirection="column">
        <Box className={classes.sectionHeader}>
          <Box display="flex">
            <Typography className={classes.sectionTitle} variant="h5">
              Risk/Beta Landscape
            </Typography>
          </Box>
        </Box>
        <Box className={classes.chartWrapper} flexGrow={1}>
          <BubbleChart lines={chartData} />
        </Box>
      </Box>
    </CircularLoader>
  )
}

export default RiskBetaLandscapeChart
