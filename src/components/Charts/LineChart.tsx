import React from 'react'
import numeral from 'numeral'
import { Line, HorizontalBar, Bar } from 'react-chartjs-2'
import { floor, ceil, range, startCase, lowerCase } from 'lodash'
import { useTheme } from '@material-ui/core/styles'
import { switchChart } from '../../utils/chartUtils'
import { CHART_TYPE, CHART_COLOR } from '../../views/Performance/constants'
import 'chartjs-plugin-datalabels'
import printCurrency from '../../utils/printCurrency'
import printPercentage from '../../utils/printPercentage'
import getChartValueLabelRange from '../../utils/getChartValueLabelRange'

interface ModelLine {
  data: number[]
  color: string
}

interface LineChartProps {
  lines: ModelLine[]
  labels: string[]
  valueType: string
  isVertical?: boolean
  maintainAspectRatio?: boolean
  type?: string
  maxTicks?: number
  minPoint?: number
  maxPoint: number
  isAutoAssignLabels?: boolean
}

const getChartColor = (color: string, data: number[], type: string): string | string[] => {
  if (type === CHART_TYPE.line) {
    return color
  }
  if (type === CHART_TYPE.bar) {
    return data.map((dataValue) => (dataValue > 0 ? color : CHART_COLOR.negative))
  }
  return color
}

const getChartConfig = (color: string, data: number[], type: string) => ({
  fill: false,
  lineTension: 0.1,
  backgroundColor: getChartColor(color, data, type),
  borderColor: getChartColor(color, data, type),
  borderCapStyle: 'butt' as any,
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter' as any,
  pointBorderColor: getChartColor(color, data, type),
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: getChartColor(color, data, type),
  pointHoverBorderColor: 'rgba(220,220,220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
})

const datasetKeyProvider = () => {
  return Math.random()
}

const getFormattedLabel = (label: string) => {
  return startCase(lowerCase(label.replace('_', ' ')))
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const {
    lines,
    labels,
    valueType,
    isVertical = true,
    maintainAspectRatio = true,
    type = CHART_TYPE.line,
    minPoint = 0,
    maxPoint,
    maxTicks = 6,
    isAutoAssignLabels,
  } = props

  const theme = useTheme()

  const { roundedMaximum, roundedMinimum, tickSpacing } = getChartValueLabelRange(minPoint, maxPoint, maxTicks)

  const minPointLength = minPoint.toString().length
  const minTick = floor(minPoint, -(minPointLength - 2))
  const maxTick = ceil(minPoint, -(minPointLength - 2))
  const dataAxisLabels =
    minPoint === maxPoint ? [minTick, maxTick] : range(roundedMinimum, roundedMaximum + tickSpacing, tickSpacing)

  const nextData = {
    labels: labels.map((label) => (label === 'null' || label === 'undefined' ? 'N/A' : getFormattedLabel(label))),
    datasets: lines.map((line) => ({
      ...getChartConfig(line.color, line.data, type),
      data: switchChart(valueType, line.data, labels.length),
    })),
  }

  const getFormattedTicks = (value) => {
    if (value) {
      if (value >= 1000000) {
        return valueType === 'dollar' ? numeral(value).format('0.00 a') : numeral(value / 100).format('0 %')
      }
      return valueType === 'dollar' ? numeral(value).format('0 a') : numeral(value / 100).format('0 %')
    }
  }

  const getTooltipOptionProps = () => ({
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          return valueType === 'dollar'
            ? printCurrency({ amount: Number(tooltipItem.value) })
            : printPercentage(Number(tooltipItem.value) / 100)
        },
      },
    },
  })

  const defaultTickProps = isAutoAssignLabels
    ? {
        ticks: {
          userCallback: (value) => getFormattedTicks(value),
        },
      }
    : {
        ticks: {
          userCallback: (value) => getFormattedTicks(value),
          min: dataAxisLabels[0],
          max: dataAxisLabels[dataAxisLabels.length - 1],
          autoskip: false,
        },
        afterBuildTicks() {
          return dataAxisLabels
        },
      }

  const options = {
    responsive: true,
    maintainAspectRatio,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            userCallback(item) {
              if (item) return item
            },
            autoSkip: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
            zeroLineWidth: 1,
          },
          ...defaultTickProps,
        },
      ],
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
    layout: {
      padding: {
        // To prevent the top label getting cut off
        top: theme.spacing(1),
      },
    },
    ...getTooltipOptionProps(),
  }

  const optionsHorizontal = {
    responsive: true,
    maintainAspectRatio,
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
          },
          ...defaultTickProps,
          barPercentage: 0.6,
        },
      ],
      yAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
            zeroLineWidth: 1,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
    layout: {
      padding: {
        // To prevent the top label getting cut off
        right: theme.spacing(1),
      },
    },
    ...getTooltipOptionProps(),
  }

  const optionsForBar = {
    responsive: true,
    maintainAspectRatio,
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
            zeroLineWidth: 1,
          },
          ...defaultTickProps,
          barPercentage: 0.6,
        },
      ],
    },
    legend: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
    layout: {
      padding: {
        // To prevent the top label getting cut off
        top: theme.spacing(1),
      },
    },
    ...getTooltipOptionProps(),
  }

  return (
    <>
      {isVertical ? (
        <>
          {type === CHART_TYPE.line && (
            <Line data={nextData} options={options} datasetKeyProvider={datasetKeyProvider} />
          )}
          {type === CHART_TYPE.bar && (
            <Bar data={nextData} options={optionsForBar} datasetKeyProvider={datasetKeyProvider} />
          )}
        </>
      ) : (
        <HorizontalBar data={nextData} options={optionsHorizontal} datasetKeyProvider={datasetKeyProvider} />
      )}
    </>
  )
}

export default LineChart
