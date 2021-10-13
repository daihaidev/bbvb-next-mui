import React, { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { sumBy, round } from 'lodash'
import moment from 'moment'
import LineChart from '../../components/Charts/LineChart'
import ColorBullet from '../../components/Charts/ColorBullet'
import ToggleGroup from '../../components/ToggleGroup'
import {
  TIME_PERIOD_TOGGLE_OPTIONS,
  VALUE_TOGGLE_OPTIONS,
  CHART_TYPE_TABS,
  IntervalTypeEnum,
  DateFormatEnum,
} from './constants'
import Tabs from '../../components/Tabs'
import { getGroupedObjectsByInterval } from '../../utils/getGroupedObjectsByInterval'
import { getDatesMomentsList } from '../../utils/getDatesMomentsList'
import CircularLoader from '../../components/CircularLoader'
import getMinChartData from '../../utils/getMinChartData'
import getMaxChartData from '../../utils/getMaxChartData'
import { ReturnInterface } from '../../graphql/return/typing'
import { BenchmarkPricesWithReturns } from '.'

const useStyles = makeStyles((theme: Theme) => ({
  sectionWrapper: {
    padding: theme.spacing(2),
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

const getNDaysLabels = (numOfDays, dates) => {
  const dayOfWeek = dates[0].day()

  switch (true) {
    case numOfDays <= 7:
      return dates.map((date) => date.format('DD MMM'))
    case numOfDays <= 90:
      // Label every 7 days
      return dates.map((date) => (date.day() === dayOfWeek ? date.format('DD MMM') : ''))
    default:
      // Label every start of the month
      return dates.map((date) => {
        return date.date() === 1 ? date.format('MMM') : ''
      })
  }
}

const getNDaysReturns = (numOfDays, returns, valueType) => {
  // n days ago + today
  const dates = getDatesMomentsList(numOfDays, IntervalTypeEnum.DAYS)

  const returnsByDay = getGroupedObjectsByInterval(
    numOfDays + 1,
    IntervalTypeEnum.DAYS,
    returns,
    DateFormatEnum.BY_DATE
  )

  const nextData = dates.map((date) => {
    const sum = sumBy(returnsByDay?.[date.format(DateFormatEnum.BY_DATE)], valueType)
    const roundedSum = round(sum, 2)
    return roundedSum
  })

  return {
    data: nextData,
    labels: getNDaysLabels(numOfDays, dates),
  }
}

const getToDateReturns = (toDateType, returns, valueType) => {
  const numOfDaysToDate = moment().diff(moment().startOf(toDateType), IntervalTypeEnum.DAYS)
  return getNDaysReturns(numOfDaysToDate, returns, valueType)
}

const getActiveReturns = (returns, benchmarkReturns) =>
  returns.map((portReturn, index) => portReturn - benchmarkReturns[index])

interface PerformanceHistoryChartProps {
  loading: boolean
  returns: ReturnInterface[]
  benchmarkPricesWithReturns: BenchmarkPricesWithReturns[]
  title: string
}

const PerformanceHistoryChart: React.FC<PerformanceHistoryChartProps> = (props) => {
  const classes = useStyles(props)
  const theme = useTheme()
  const { loading, returns, benchmarkPricesWithReturns, title } = props

  // YTD, MTD, 1Y, 1M, 1W, Custom toggle (Currently allow YTD data)
  const [performanceHistoryTime, setPerformanceHistoryTime] = useState(TIME_PERIOD_TOGGLE_OPTIONS[0].value)
  // $ and % toggle
  const [performanceHistoryValueType, setPerformanceHistoryValueType] = useState(VALUE_TOGGLE_OPTIONS[0].value)
  // Portfolio (0) and Benchmark (1) toggle
  const [performanceHistoryTab, setPerformanceHistoryTab] = useState(0)

  // CALCULATION (Currently allow YTD data)
  const currentCalculatedProperty =
    performanceHistoryValueType === VALUE_TOGGLE_OPTIONS[0].value ? 'absValue' : 'relValue'

  // FOR PORTFOLIO
  // YTD
  const yearToDateReturns = useMemo(
    () => getToDateReturns(IntervalTypeEnum.YEARS, returns, currentCalculatedProperty),
    [loading, returns, currentCalculatedProperty]
  )
  // MTD
  const monthToDateReturns = useMemo(
    () => getToDateReturns(IntervalTypeEnum.MONTHS, returns, currentCalculatedProperty),
    [loading, returns, currentCalculatedProperty]
  )
  // 1Y
  const oneYearReturns = useMemo(() => getNDaysReturns(365, returns, currentCalculatedProperty), [
    loading,
    returns,
    currentCalculatedProperty,
  ])
  // 1M
  const oneMonthReturns = useMemo(() => getNDaysReturns(30, returns, currentCalculatedProperty), [
    loading,
    returns,
    currentCalculatedProperty,
  ])
  // 1W
  const oneWeekReturns = useMemo(() => getNDaysReturns(7, returns, currentCalculatedProperty), [
    loading,
    returns,
    currentCalculatedProperty,
  ])

  const CHART_LABEL_FOR_COMPANY_PORTFOLIO = {
    YTD: yearToDateReturns.labels,
    MTD: monthToDateReturns.labels,
    TY: oneYearReturns.labels,
    TM: oneMonthReturns.labels,
    TW: oneWeekReturns.labels,
  }
  const CHART_DATA_FOR_COMPANY_PORTFOLIO = {
    YTD: yearToDateReturns.data,
    MTD: monthToDateReturns.data,
    TY: oneYearReturns.data,
    TM: oneMonthReturns.data,
    TW: oneWeekReturns.data,
  }

  // FOR BENCHMARK
  // YTD
  const benchmarkYearToDateReturns = useMemo(
    () => getToDateReturns(IntervalTypeEnum.YEARS, benchmarkPricesWithReturns, currentCalculatedProperty),
    [loading, benchmarkPricesWithReturns, currentCalculatedProperty]
  )
  // MTD
  const benchmarkMonthToDateReturns = useMemo(
    () => getToDateReturns(IntervalTypeEnum.MONTHS, benchmarkPricesWithReturns, currentCalculatedProperty),
    [loading, benchmarkPricesWithReturns, currentCalculatedProperty]
  )
  // 1Y
  const benchmarkOneYearReturns = useMemo(
    () => getNDaysReturns(365, benchmarkPricesWithReturns, currentCalculatedProperty),
    [loading, benchmarkPricesWithReturns, currentCalculatedProperty]
  )
  // 1M
  const benchmarkOneMonthReturns = useMemo(
    () => getNDaysReturns(30, benchmarkPricesWithReturns, currentCalculatedProperty),
    [loading, benchmarkPricesWithReturns, currentCalculatedProperty]
  )
  // 1W
  const benchmarkOneWeekReturns = useMemo(
    () => getNDaysReturns(7, benchmarkPricesWithReturns, currentCalculatedProperty),
    [loading, benchmarkPricesWithReturns, currentCalculatedProperty]
  )

  const CHART_DATA_FOR_COMPANY_BENCHMARK = {
    YTD: benchmarkYearToDateReturns.data,
    MTD: benchmarkMonthToDateReturns.data,
    TY: benchmarkOneYearReturns.data,
    TM: benchmarkOneMonthReturns.data,
    TW: benchmarkOneWeekReturns.data,
  }

  const CHART_DATA_FOR_COMPANY_ACTIVE = {
    YTD: getActiveReturns(yearToDateReturns.data, benchmarkYearToDateReturns.data),
    MTD: getActiveReturns(monthToDateReturns.data, benchmarkMonthToDateReturns.data),
    TY: getActiveReturns(oneYearReturns.data, benchmarkOneYearReturns.data),
    TM: getActiveReturns(oneMonthReturns.data, benchmarkOneMonthReturns.data),
    TW: getActiveReturns(oneWeekReturns.data, benchmarkOneWeekReturns.data),
  }

  const CHART_TYPE_TABS_FOR_COMPANY = [
    {
      title: 'Overview',
      color: theme.palette.primary.main,
      chartLabel: CHART_LABEL_FOR_COMPANY_PORTFOLIO,
      chartData: { YTD: [], MTD: [], TY: [], TM: [], TW: [] },
    },
    {
      title: 'Portfolio',
      color: theme.palette.secondary.main,
      chartLabel: CHART_LABEL_FOR_COMPANY_PORTFOLIO,
      chartData: CHART_DATA_FOR_COMPANY_PORTFOLIO,
    },
    {
      title: 'Benchmark',
      color: theme.palette.text.primary,
      chartLabel: CHART_LABEL_FOR_COMPANY_PORTFOLIO,
      chartData: CHART_DATA_FOR_COMPANY_BENCHMARK,
    },
    {
      title: 'Active',
      color: theme.palette.primary.main,
      chartLabel: CHART_LABEL_FOR_COMPANY_PORTFOLIO,
      chartData: CHART_DATA_FOR_COMPANY_ACTIVE,
    },
  ]

  // Chart Labels and Data
  const [chartLabel, setChartLabel] = useState([])
  const [chartData, setChartData] = useState([])
  const [minY, setMinY] = useState(0)
  const [maxY, setMaxY] = useState(0)

  const getChartLabel = (historyTab: number, period: string) => {
    switch (period) {
      case TIME_PERIOD_TOGGLE_OPTIONS[0].value:
        return CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartLabel.YTD
      case TIME_PERIOD_TOGGLE_OPTIONS[1].value:
        return CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartLabel.MTD
      case TIME_PERIOD_TOGGLE_OPTIONS[2].value:
        return CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartLabel.TY
      case TIME_PERIOD_TOGGLE_OPTIONS[3].value:
        return CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartLabel.TM
      case TIME_PERIOD_TOGGLE_OPTIONS[4].value:
        return CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartLabel.TW
      default:
        return CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartLabel.YTD
    }
  }

  const getChartDataPerTime = (historyTab: number, period: string) => {
    switch (period) {
      case TIME_PERIOD_TOGGLE_OPTIONS[0].value:
        if (historyTab === 0) {
          return CHART_TYPE_TABS_FOR_COMPANY.map((chart) => ({
            color: chart.color,
            data: chart.chartData.YTD,
          }))
        }
        return [
          {
            color: CHART_TYPE_TABS_FOR_COMPANY[historyTab].color,
            data: CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartData.YTD,
          },
        ]
      case TIME_PERIOD_TOGGLE_OPTIONS[1].value:
        if (historyTab === 0) {
          return CHART_TYPE_TABS_FOR_COMPANY.map((chart) => ({
            color: chart.color,
            data: chart.chartData.MTD,
          }))
        }
        return [
          {
            color: CHART_TYPE_TABS_FOR_COMPANY[historyTab].color,
            data: CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartData.MTD,
          },
        ]
      case TIME_PERIOD_TOGGLE_OPTIONS[2].value:
        if (historyTab === 0) {
          return CHART_TYPE_TABS_FOR_COMPANY.map((chart) => ({
            color: chart.color,
            data: chart.chartData.TY,
          }))
        }
        return [
          {
            color: CHART_TYPE_TABS_FOR_COMPANY[historyTab].color,
            data: CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartData.TY,
          },
        ]
      case TIME_PERIOD_TOGGLE_OPTIONS[3].value:
        if (historyTab === 0) {
          return CHART_TYPE_TABS_FOR_COMPANY.map((chart) => ({
            color: chart.color,
            data: chart.chartData.TM,
          }))
        }
        return [
          {
            color: CHART_TYPE_TABS_FOR_COMPANY[historyTab].color,
            data: CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartData.TM,
          },
        ]
      case TIME_PERIOD_TOGGLE_OPTIONS[4].value:
        if (historyTab === 0) {
          return CHART_TYPE_TABS_FOR_COMPANY.map((chart) => ({
            color: chart.color,
            data: chart.chartData.TW,
          }))
        }
        return [
          {
            color: CHART_TYPE_TABS_FOR_COMPANY[historyTab].color,
            data: CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartData.TW,
          },
        ]
      default:
        if (historyTab === 0) {
          return CHART_TYPE_TABS_FOR_COMPANY.map((chart) => ({
            color: chart.color,
            data: chart.chartData.YTD,
          }))
        }
        return [
          {
            color: CHART_TYPE_TABS_FOR_COMPANY[historyTab].color,
            data: CHART_TYPE_TABS_FOR_COMPANY[historyTab].chartData.YTD,
          },
        ]
    }
  }

  useEffect(() => {
    const nextLabels = getChartLabel(performanceHistoryTab, performanceHistoryTime)
    setChartLabel(nextLabels)

    const nextChartData = getChartDataPerTime(performanceHistoryTab, performanceHistoryTime)
    setChartData(nextChartData)

    const chartDataToEvaluate = nextChartData?.[0]?.data?.length > 0 ? nextChartData : nextChartData?.slice(1)
    const nextMinY =
      chartDataToEvaluate?.[0]?.data?.length > 0 ? getMinChartData(chartDataToEvaluate, performanceHistoryValueType) : 0
    const nextMaxY =
      chartDataToEvaluate?.[0]?.data?.length > 0 ? getMaxChartData(chartDataToEvaluate, performanceHistoryValueType) : 0

    setMinY(nextMinY)
    setMaxY(nextMaxY)
  }, [performanceHistoryTime, performanceHistoryTab, performanceHistoryValueType, loading])

  const handlePerformanceHistoryTabChange = (e, newTab) => {
    setPerformanceHistoryTab(newTab)
  }

  const handlePerformanceHistoryTimeToggle = (e) => {
    setPerformanceHistoryTime(e.currentTarget.value)
  }

  const handlePerformanceHistoryValueTypeToggle = (e) => {
    setPerformanceHistoryValueType(e.currentTarget.value)
  }

  return (
    <CircularLoader loading={loading}>
      <Box className={classes.sectionWrapper}>
        <Box className={classes.sectionHeader}>
          {/* Title and Toggle Buttons */}
          <Box display="flex">
            <Typography className={classes.sectionTitle} variant="h5">
              {title}
            </Typography>
            <ToggleGroup
              options={TIME_PERIOD_TOGGLE_OPTIONS}
              value={performanceHistoryTime}
              handleChange={handlePerformanceHistoryTimeToggle}
            />
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
          <Box display="flex" alignItems="center" justifyContent="center">
            <ColorBullet title={CHART_TYPE_TABS[1].title} color={CHART_TYPE_TABS[1].color} />
            <ColorBullet title={CHART_TYPE_TABS[2].title} color={CHART_TYPE_TABS[2].color} />
            <ColorBullet title={CHART_TYPE_TABS[3].title} color={CHART_TYPE_TABS[3].color} />
          </Box>
        </Box>
        <Box className={classes.chartWrapper}>
          <LineChart
            lines={chartData}
            labels={chartLabel}
            valueType={performanceHistoryValueType}
            minPoint={minY}
            maxPoint={maxY}
          />
        </Box>
      </Box>
    </CircularLoader>
  )
}

export default PerformanceHistoryChart
