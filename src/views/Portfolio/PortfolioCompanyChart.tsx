import React, { useState, useEffect } from 'react'
import { startCase, lowerCase, groupBy, sumBy, round } from 'lodash'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import { SectorEnum } from '@onextech/btb-api'
import LineChart from '../../components/Charts/LineChart'
import ToggleGroup from '../../components/ToggleGroup'
import { TIME_PERIOD_TOGGLE_OPTIONS, VALUE_TOGGLE_OPTIONS, CHART_TYPE } from '../Performance/constants'
import Tabs from '../../components/Tabs'
import { Asset } from '../../utils/getCalculatedAssetsAndTotals'
import { BenchmarkInterface } from '../../graphql/benchmark/typing'
import CircularLoader from '../../components/CircularLoader'
import getMinChartData from '../../utils/getMinChartData'
import getMaxChartData from '../../utils/getMaxChartData'

const useStyles = makeStyles((theme: Theme) => ({
  sectionWrapper: {
    paddingTop: theme.spacing(2),
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
    '& > canvas': {
      height: '250px !important',
    },
  },
}))

interface PortfolioCompanyChartProps {
  loading: boolean
  assets: Asset[]
  benchmark: BenchmarkInterface
}

const PortfolioCompanyChart: React.FC<PortfolioCompanyChartProps> = (props) => {
  const classes = useStyles(props)
  const theme = useTheme()
  const { loading, assets, benchmark } = props

  const [minY, setMinY] = useState(0)
  const [maxY, setMaxY] = useState(0)

  // YTD, MTD, 1Y, 1M, 1W, Custom toggle (Currently allow YTD data)
  const [performanceHistoryTime, setPerformanceHistoryTime] = useState(TIME_PERIOD_TOGGLE_OPTIONS[0].value)
  // $ and % toggle
  const [performanceHistoryValueType, setPerformanceHistoryValueType] = useState(VALUE_TOGGLE_OPTIONS[0].value)
  // Portfolio (0) and Benchmark (1) toggle
  const [performanceHistoryTab, setPerformanceHistoryTab] = useState(0)

  // CALCULATION (Currently allow YTD data)
  // Portfolio Tab
  const currentCalculatedProperty =
    performanceHistoryValueType === VALUE_TOGGLE_OPTIONS[0].value ? 'marketValue' : 'weight'

  const groupAssets = groupBy(assets, 'sector')
  const assetSumsBySectors = Object.entries(groupAssets || {}).reduce((acc, [sectorKey, assets]) => {
    acc[sectorKey] = round(sumBy(assets, currentCalculatedProperty), 2)
    return acc
  }, {})

  const CHART_LABEL_FOR_COMPANY_PORTFOLIO = {
    YTD: Object.keys(assetSumsBySectors || {}),
  }
  const CHART_DATA_FOR_COMPANY_PORTFOLIO = {
    YTD: Object.values(assetSumsBySectors || {}).map((sum) => sum),
  }

  // Benchmark Tab
  const benchmarkLastPrice = benchmark?.prices?.items?.length
    ? benchmark?.prices.items[benchmark?.prices.items.length - 1].value
    : 0
  const benchmarkSectors = benchmark?.sectors || []
  const benchmarkSumsBySectors = benchmarkSectors.reduce((acc, { title, weight }) => {
    acc[title] =
      performanceHistoryValueType === VALUE_TOGGLE_OPTIONS[0].value ? round(benchmarkLastPrice * weight, 2) : weight
    return acc
  }, {})

  const CHART_LABEL_FOR_COMPANY_BENCHMARK = {
    YTD: Object.keys(benchmarkSumsBySectors),
  }
  const CHART_DATA_FOR_COMPANY_BENCHMARK = {
    YTD: Object.values(benchmarkSumsBySectors).map((val) => val),
  }

  // Active Tab
  const CHART_LABEL_FOR_COMPANY_ACTIVE = {
    YTD: Object.values(SectorEnum),
  }
  const CHART_DATA_FOR_COMPANY_ACTIVE = {
    YTD: Object.values(SectorEnum).map(
      (sectorKey) => (assetSumsBySectors[sectorKey] || 0) - (benchmarkSumsBySectors[sectorKey] || 0)
    ),
  }

  const CHART_TYPE_TABS_FOR_COMPANY = [
    {
      title: 'Portfolio',
      color: theme.palette.primary.main,
      chartLabel: CHART_LABEL_FOR_COMPANY_PORTFOLIO,
      chartData: CHART_DATA_FOR_COMPANY_PORTFOLIO,
    },
    {
      title: 'Benchmark',
      color: theme.palette.primary.main,
      chartLabel: CHART_LABEL_FOR_COMPANY_BENCHMARK,
      chartData: CHART_DATA_FOR_COMPANY_BENCHMARK,
    },
    {
      title: 'Active',
      color: theme.palette.primary.main,
      chartLabel: CHART_LABEL_FOR_COMPANY_ACTIVE,
      chartData: CHART_DATA_FOR_COMPANY_ACTIVE,
    },
  ]

  // Chart Labels and Data
  const [chartLabel, setChartLabel] = useState([])
  const [chartData, setChartData] = useState([])

  const getChartLabel = (historyTab: number, period: string) => {
    switch (period) {
      case TIME_PERIOD_TOGGLE_OPTIONS[0].value:
        return CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartLabel.YTD
      default:
        return CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartLabel.YTD
    }
  }

  const getChartDataPerTime = (historyTab: number, period: string) => {
    switch (period) {
      case TIME_PERIOD_TOGGLE_OPTIONS[0].value:
        return [
          {
            color: CHART_TYPE_TABS_FOR_COMPANY[historyTab].color,
            data: CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartData.YTD,
          },
        ]
      default:
        return [
          {
            color: CHART_TYPE_TABS_FOR_COMPANY[historyTab].color,
            data: CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartData.YTD,
          },
        ]
    }
  }

  useEffect(() => {
    setChartLabel(getChartLabel(performanceHistoryTab, performanceHistoryTime))

    const nextChartData = getChartDataPerTime(performanceHistoryTab, performanceHistoryTime)
    setChartData(nextChartData)

    const nextMinY =
      nextChartData?.[0]?.data?.length > 0 ? getMinChartData(nextChartData, performanceHistoryValueType) : 0
    const nextMaxY =
      nextChartData?.[0]?.data?.length > 0 ? getMaxChartData(nextChartData, performanceHistoryValueType) : 0

    setMinY(nextMinY)
    setMaxY(nextMaxY)
  }, [performanceHistoryTime, performanceHistoryTab, performanceHistoryValueType, loading])

  const handlePerformanceHistoryTabChange = (e, newTab) => {
    setPerformanceHistoryTab(newTab)
  }

  const handlePerformanceHistoryValueTypeToggle = (e) => {
    setPerformanceHistoryValueType(e.currentTarget.value)
  }

  return (
    <CircularLoader loading={loading}>
      <Box className={classes.sectionWrapper} display="flex" flexDirection="column">
        <Box className={classes.sectionHeader}>
          {/* Title and Toggle Buttons */}
          <Box display="flex">
            <Typography className={classes.sectionTitle} variant="h5">
              Company Sector Weights
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
        {/* Tabs */}
        <Box className={classes.sectionHeader}>
          <Tabs
            value={performanceHistoryTab}
            onChange={handlePerformanceHistoryTabChange}
            items={CHART_TYPE_TABS_FOR_COMPANY.map((tab: any) => tab.title)}
          />
        </Box>
        <Box className={classes.chartWrapper} flexGrow={1}>
          <LineChart
            maintainAspectRatio={false}
            lines={chartData}
            labels={chartLabel}
            valueType={performanceHistoryValueType}
            type={CHART_TYPE.bar}
            minPoint={minY}
            maxPoint={maxY}
          />
        </Box>
      </Box>
    </CircularLoader>
  )
}

export default PortfolioCompanyChart
