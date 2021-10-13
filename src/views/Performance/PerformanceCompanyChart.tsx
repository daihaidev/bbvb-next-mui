import React, { useState, useEffect } from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import LineChart from '../../components/Charts/LineChart'
import ToggleGroup from '../../components/ToggleGroup'
import { VALUE_TOGGLE_OPTIONS, CHART_TYPE } from './constants'
import Tabs from '../../components/Tabs'
import CircularLoader from '../../components/CircularLoader'
import getMinChartData from '../../utils/getMinChartData'
import getMaxChartData from '../../utils/getMaxChartData'

const useStyles = makeStyles((theme: Theme) => ({
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
      height: '350px !important',
    },
  },
}))

interface PerformanceValueType {
  relValue: number
  absValue: number
}

interface PerformanceBySector {
  sector: string
  port: PerformanceValueType
  bench: PerformanceValueType
  active: PerformanceValueType
  absGainLoss: PerformanceValueType
}

interface PortfolioCompanyChartProps {
  loading: boolean
  performanceBySector: PerformanceBySector[]
}

const PerformanceCompanyChart: React.FC<PortfolioCompanyChartProps> = (props) => {
  const classes = useStyles(props)
  const theme = useTheme()
  const { loading, performanceBySector } = props

  // Chart Data State
  const [chartData, setChartData] = useState([])
  const [minY, setMinY] = useState(0)
  const [maxY, setMaxY] = useState(0)

  // $ and % toggle
  const [performanceHistoryValueType, setPerformanceHistoryValueType] = useState(VALUE_TOGGLE_OPTIONS[0].value)
  // Portfolio (0), Benchmark (1), Active (2) toggle
  const [performanceHistoryTab, setPerformanceHistoryTab] = useState(0)

  // CALCULATION
  const currentCalculatedProperty =
    performanceHistoryValueType === VALUE_TOGGLE_OPTIONS[0].value ? 'absValue' : 'relValue'

  const sectorLabels = performanceBySector.map(({ sector }) => sector)
  const CHART_TYPE_TABS_FOR_COMPANY = [
    {
      title: 'Portfolio',
      color: theme.palette.primary.main,
      chartData: performanceBySector.map(({ absGainLoss }) => absGainLoss[currentCalculatedProperty]),
    },
    {
      title: 'Benchmark',
      color: theme.palette.primary.main,
      chartData: performanceBySector.map(({ bench }) => bench[currentCalculatedProperty]),
    },
    {
      title: 'Active',
      color: theme.palette.primary.main,
      chartData: performanceBySector.map(({ active }) => active[currentCalculatedProperty]),
    },
  ]

  const getChartData = (historyTab: number) => {
    return [
      {
        color: CHART_TYPE_TABS_FOR_COMPANY[historyTab].color,
        data: CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartData,
      },
    ]
  }

  useEffect(() => {
    const nextChartData = getChartData(performanceHistoryTab)
    setChartData(nextChartData)

    const nextMinY =
      nextChartData?.[0]?.data?.length > 0 ? getMinChartData(nextChartData, performanceHistoryValueType) : 0
    const nextMaxY =
      nextChartData?.[0]?.data?.length > 0 ? getMaxChartData(nextChartData, performanceHistoryValueType) : 0

    setMinY(nextMinY)
    setMaxY(nextMaxY)
  }, [performanceHistoryTab, performanceHistoryValueType, loading])

  const handlePerformanceHistoryTabChange = (e, newTab) => {
    setPerformanceHistoryTab(newTab)
  }

  const handlePerformanceHistoryValueTypeToggle = (e) => {
    setPerformanceHistoryValueType(e.currentTarget.value)
  }

  return (
    <CircularLoader loading={loading}>
      <Box py={1} display="flex" flexDirection="column">
        <Box className={classes.sectionHeader}>
          {/* Title and Toggle Buttons */}
          <Box display="flex">
            <Typography className={classes.sectionTitle} variant="h5">
              Performance by Company Sector
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
            labels={sectorLabels}
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

export default PerformanceCompanyChart
