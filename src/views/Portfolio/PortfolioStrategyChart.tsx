import React, { useState, useEffect } from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { groupBy, sumBy, round } from 'lodash'
import LineChart from '../../components/Charts/LineChart'
import ToggleGroup from '../../components/ToggleGroup'
import { TIME_PERIOD_TOGGLE_OPTIONS, VALUE_TOGGLE_OPTIONS } from '../Performance/constants'
import { Asset } from '../../utils/getCalculatedAssetsAndTotals'
import CircularLoader from '../../components/CircularLoader'
import getMinChartData from '../../utils/getMinChartData'
import getMaxChartData from '../../utils/getMaxChartData'

const useStyles = makeStyles((theme: Theme) => ({
  sectionWrapper: {
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
    height: 'calc(100% - 64px)',
  },
}))

export enum StrategyTypeEnum {
  Strategy = 'strategy',
  SubStrategy = 'subStrategy',
}

interface PortfolioStrategyWidgetProps {
  title: string
  loading: boolean
  assets: Asset[]
  type: StrategyTypeEnum
}

const PortfolioStrategyChart: React.FC<PortfolioStrategyWidgetProps> = (props) => {
  const classes = useStyles(props)
  const theme = useTheme()
  const { loading, assets, title, type } = props

  const [minX, setMinX] = useState(0)
  const [maxX, setMaxX] = useState(0)

  // YTD, MTD, 1Y, 1M, 1W, Custom toggle (Currently allow YTD data)
  const [performanceHistoryTime, setPerformanceHistoryTime] = useState(TIME_PERIOD_TOGGLE_OPTIONS[0].value)
  // $ and % toggle
  const [performanceHistoryValueType, setPerformanceHistoryValueType] = useState(VALUE_TOGGLE_OPTIONS[0].value)

  // CALCULATION (Currently allow YTD data)
  const groupAssets = groupBy(assets, type)
  const currentCalculatedProperty =
    performanceHistoryValueType === VALUE_TOGGLE_OPTIONS[0].value ? 'marketValue' : 'weight'

  const CHART_LABEL_FOR_STRATEGY = {
    YTD: Object.keys(groupAssets || {}).map((key) => (key === 'null' || key === 'undefined' ? 'N/A' : key)),
  }
  const CHART_DATA_FOR_STRATEGY = {
    color: theme.palette.primary.main,
    YTD: Object.values(groupAssets || {}).map((assets) => round(sumBy(assets, currentCalculatedProperty), 2)),
  }

  const [chartLabel, setChartLabel] = useState([])
  const [chartData, setChartData] = useState([])

  const getChartLabel = (period: string) => {
    switch (period) {
      case TIME_PERIOD_TOGGLE_OPTIONS[0].value:
        return CHART_LABEL_FOR_STRATEGY.YTD
      default:
        return CHART_LABEL_FOR_STRATEGY.YTD
    }
  }

  const getChartDataPerTime = (period: string) => {
    switch (period) {
      case TIME_PERIOD_TOGGLE_OPTIONS[0].value:
        return [
          {
            color: CHART_DATA_FOR_STRATEGY.color,
            data: CHART_DATA_FOR_STRATEGY.YTD,
          },
        ]
      default:
        return [
          {
            color: CHART_DATA_FOR_STRATEGY.color,
            data: CHART_DATA_FOR_STRATEGY.YTD,
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

  const handlePerformanceHistoryValueTypeToggle = (e) => {
    setPerformanceHistoryValueType(e.currentTarget.value)
  }

  return (
    <CircularLoader loading={loading}>
      <Box className={classes.sectionWrapper} display="flex" flexDirection="column">
        <Box className={classes.sectionHeader}>
          <Box display="flex">
            <Typography className={classes.sectionTitle} variant="h5">
              {title}
            </Typography>
          </Box>
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

export default PortfolioStrategyChart
