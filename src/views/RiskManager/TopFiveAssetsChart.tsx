import React from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DoughnutChart from '../../components/Charts/DoughnutChart'
import { Asset } from '../../utils/getCalculatedAssetsAndTotals'
import { getTopFiveLabels, getTopFiveData } from './utils'
import CircularLoader from '../../components/CircularLoader'

interface TopFiveAssetsChartProps {
  loading: boolean
  assets: Asset[]
}

const useStyles = makeStyles((theme: Theme) => ({
  sectionWrapper: {
    padding: theme.spacing(2),
    borderLeft: `1px solid ${theme.palette.border.secondary}`,
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
    marginTop: theme.spacing(5),
  },
}))

const TopFiveAssetsChart: React.FC<TopFiveAssetsChartProps> = (props) => {
  const { loading, assets } = props
  const classes = useStyles(props)

  const chartLabel = getTopFiveLabels(assets)
  const chartData = getTopFiveData(assets)

  return (
    <CircularLoader loading={loading}>
      <Box className={classes.sectionWrapper} display="flex" flexDirection="column">
        <Box className={classes.sectionHeader}>
          <Box display="flex">
            <Typography className={classes.sectionTitle} variant="h5">
              Top 5 Assets
            </Typography>
          </Box>
        </Box>
        <Box className={classes.chartWrapper} flexGrow={1}>
          <DoughnutChart doughnuts={chartData} labels={chartLabel} />
        </Box>
      </Box>
    </CircularLoader>
  )
}

export default TopFiveAssetsChart
