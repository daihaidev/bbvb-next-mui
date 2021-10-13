import React, { useState, useEffect } from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { groupBy, sumBy } from 'lodash'
import LineChart from '../../components/Charts/LineChart'
import { TIME_PERIOD_TOGGLE_OPTIONS, VALUE_TOGGLE_OPTIONS, CHART_TYPE } from './constants'
import { Asset } from '../../utils/getCalculatedAssetsAndTotals'
import CircularLoader from '../../components/CircularLoader'
import getMinChartData from '../../utils/getMinChartData'
import getMaxChartData from '../../utils/getMaxChartData'
import ToggleGroup from '../../components/ToggleGroup'

const useStyles = makeStyles((theme: Theme) => ({
  sectionWrapper: {
    padding: theme.spacing(2),
    borderLeft: `1px solid ${theme.palette.border.secondary}`,
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

interface PerformanceStrategyChartProps {
  loading: boolean
  assets: Asset[]
}

const PerformanceStrategyChart: React.FC<PerformanceStrategyChartProps> = (props) => {
  const classes = useStyles(props)
  const theme = useTheme()
  const { loading, assets } = props

  const [minX, setMinX] = useState(0)
  const [maxX, setMaxX] = useState(0)

  const MAX_STRATEGY_LIMIT = 10

  // YTD, MTD, 1Y, 1M, 1W, Custom toggle (Currently allow YTD data)
  const [performanceHistoryTime, setPerformanceHistoryTime] = useState(TIME_PERIOD_TOGGLE_OPTIONS[0].value)
  // $ and % toggle
  const [performanceHistoryValueType, setPerformanceHistoryValueType] = useState(VALUE_TOGGLE_OPTIONS[0].value)

  // CALCULATION (Currently allow YTD data)
  const groupAssets = groupBy(assets, 'strategy')
  const currentCalculatedProperty =
    performanceHistoryValueType === VALUE_TOGGLE_OPTIONS[0].value ? 'gainLoss' : 'gainLossPercent'

  const CHART_LABEL_FOR_STRATEGY = {
    YTD: Object.keys(groupAssets || {}).map((key) => (key === 'null' || key === 'undefined' ? 'N/A' : key)),
  }
  const CHART_DATA_FOR_STRATEGY = {
    color: theme.palette.primary.main,
    YTD: Object.values(groupAssets || {}).map((assets) => sumBy(assets, currentCalculatedProperty)),
  }

  const [chartLabel, setChartLabel] = useState([])
  const [chartData, setChartData] = useState([])

  const getChartLabel = (period: string) => {
    switch (period) {
      case TIME_PERIOD_TOGGLE_OPTIONS[0].value:
        return CHART_LABEL_FOR_STRATEGY.YTD.slice(0, MAX_STRATEGY_LIMIT)
      default:
        return CHART_LABEL_FOR_STRATEGY.YTD.slice(0, MAX_STRATEGY_LIMIT)
    }
  }

  const getChartDataPerTime = (period: string) => {
    switch (period) {
      case TIME_PERIOD_TOGGLE_OPTIONS[0].value:
        return [
          {
            color: CHART_DATA_FOR_STRATEGY.color,
            data: CHART_DATA_FOR_STRATEGY.YTD.slice(0, MAX_STRATEGY_LIMIT),
          },
        ]
      default:
        return [
          {
            color: CHART_DATA_FOR_STRATEGY.color,
            data: CHART_DATA_FOR_STRATEGY.YTD.slice(0, MAX_STRATEGY_LIMIT),
          },
        ]
    }
  }

  useEffect(() => {
    setChartLabel(getChartLabel(performanceHistoryTime))

    const nextChartData = getChartDataPerTime(performanceHistoryTime)
    setChartData(nextChartData)

    const nextMinX =
      nextChartData?.[0]?.data?.length > 0 ? getMinChartData(nextChartData, performanceHistoryValueType) : 0
    const nextMaxX =
      nextChartData?.[0]?.data?.length > 0 ? getMaxChartData(nextChartData, performanceHistoryValueType) : 0

    setMinX(nextMinX)
    setMaxX(nextMaxX)
  }, [performanceHistoryTime, performanceHistoryValueType, loading])

  const handlePerformanceHistoryTimeToggle = (e) => {
    setPerformanceHistoryTime(e.currentTarget.value)
  }

  const handlePerformanceHistoryValueTypeToggle = (e) => {
    setPerformanceHistoryValueType(e.currentTarget.value)
  }

  return (
    <CircularLoader loading={loading}>
      <Box
        className={classes.sectionWrapper}
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box className={classes.sectionHeader}>
          <Box display="flex">
            <Typography className={classes.sectionTitle} variant="h5">
              Performance by Strategy
            </Typography>
          </Box>
          {/* Value Type Buttons */}
          <Box display="flex">
            <ToggleGroup
              options={VALUE_TOGGLE_OPTIONS}
              value={performanceHistoryValueType}
              handleChange={handlePerformanceHistoryValueTypeToggle}
            />
          </Box>
        </Box>
        <Box className={classes.chartWrapper} flexGrow={1}>
          <LineChart
            type={CHART_TYPE.bar}
            lines={chartData}
            labels={chartLabel}
            valueType={performanceHistoryValueType}
            isVertical={false}
            maintainAspectRatio={false}
            minPoint={minX}
            maxPoint={maxX}
          />
        </Box>
      </Box>
    </CircularLoader>
  )
}

export default PerformanceStrategyChart
