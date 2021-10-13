import { round } from 'lodash'
import { VALUE_TOGGLE_OPTIONS } from '../views/Performance/constants'

const getMaxChartData = (chartData, performanceHistoryValueType) => {
  const maxValue = round(
    chartData?.reduce((maximum, { data }) => Math.max(maximum, Math.max(...data)), Number.MIN_VALUE),
    2
  )
  const maxByValueType = performanceHistoryValueType === VALUE_TOGGLE_OPTIONS[0].value ? maxValue : maxValue * 100

  return Math.floor(maxByValueType)
}

export default getMaxChartData
