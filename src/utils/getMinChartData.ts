import { round } from 'lodash'
import { VALUE_TOGGLE_OPTIONS } from '../views/Performance/constants'

const getMinChartData = (chartData, performanceHistoryValueType) => {
  const minValue = round(
    chartData?.reduce((minimum, { data }) => Math.min(minimum, Math.min(...data)), Number.MAX_VALUE),
    2
  )
  const minByValueType = performanceHistoryValueType === VALUE_TOGGLE_OPTIONS[0].value ? minValue : minValue * 100

  return Math.floor(minByValueType)
}

export default getMinChartData
