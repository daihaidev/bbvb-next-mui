import React from 'react'
import { Bubble } from 'react-chartjs-2'
import 'chartjs-plugin-datalabels'
import * as colors from '@material-ui/core/colors'
import { useTheme } from '@material-ui/core/styles'

interface ModelLine {
  data: Array<{
    x: number
    y: number
    r: number
  }>
  label: string
  color: string
}

interface BubbleChartProps {
  lines: ModelLine[]
  labels?: string[]
}

const getChartConfig = (label, color) => ({
  label,
  fill: false,
  lineTension: 0.1,
  backgroundColor: color,
  borderColor: color,
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.5,
  borderJoinStyle: 'miter',
  pointBorderColor: color,
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: color,
  pointHoverBorderColor: 'rgba(220,220,220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 3,
  pointHitRadius: 10,
})

const BubbleChart: React.FC<BubbleChartProps> = (props) => {
  const { lines, labels } = props

  const theme = useTheme()

  const nextData = {
    labels,
    datasets: lines.map((line) => ({
      ...getChartConfig(line.label, line.color),
      data: line.data,
    })),
  }

  const optionsHorizontal = {
    type: 'bubble',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
            zeroLineWidth: 1,
          },
          ticks: {
            beginAtZero: true,
            callback: (value) => {
              return `${value}%`
            },
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    plugins: {
      datalabels: {
        color: colors.grey[900],
        font: {
          weight: 600,
        },
        formatter(value, context) {
          return context.chart.data.datasets?.[context.datasetIndex]?.label || value
        },
      },
    },
    layout: {
      padding: {
        // FIXME: This is a hotfix until the updated scale is confirmed
        // To prevent the top label getting cut off
        top: theme.spacing(4),
      },
    },
  }

  return <Bubble data={nextData} options={optionsHorizontal} />
}

export default BubbleChart
