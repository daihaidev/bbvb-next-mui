import React from 'react'
import { Box, Theme } from '@material-ui/core'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import { Doughnut } from 'react-chartjs-2'
import 'chartjs-plugin-datalabels'

interface ModelDoughnut {
  data: number[]
  color: string
}

interface DoughnutChartProps {
  doughnuts: ModelDoughnut[]
  labels: string[]
}

const datasetKeyProvider = () => {
  return Math.random()
}

const useStyles = makeStyles((theme: Theme) => ({
  sumContainer: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  bottomContainer: {
    position: 'relative',
  },
  bottomList: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(0.5, 0),
    alignItems: 'center',
  },
  listIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    margin: theme.spacing(0, 1),
  },
  listText: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: theme.typography.pxToRem(12),
  },
  total: {
    fontWeight: 700,
    fontSize: theme.typography.pxToRem(14),
  },
  marketValue: {
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(12),
  },
}))

const DoughnutChart: React.FC<DoughnutChartProps> = (props) => {
  const { doughnuts, labels } = props
  const classes = useStyles(props)
  const theme = useTheme()
  const getSum = () =>
    doughnuts[0].data
      .reduce((total, num) => total + num, 0)
      .toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
  const nextData = {
    labels,
    datasets: doughnuts.map((obj) => ({
      ...obj,
      backgroundColor: [
        theme.palette.chart.red,
        theme.palette.chart.yellow,
        theme.palette.chart.orange,
        theme.palette.chart.green,
        theme.palette.chart.blue,
      ],
      hoverBackgroundColor: [
        theme.palette.chart.red,
        theme.palette.chart.yellow,
        theme.palette.chart.orange,
        theme.palette.chart.green,
        theme.palette.chart.blue,
      ],
    })),
  }
  // TODO: Allow additional options as props
  const options = {
    cutoutPercentage: 85,
    legend: { display: false },
    maintainAspectRatio: false,
    spanGaps: false,
    plugins: {
      datalabels: {
        display: false,
      },
    },
  }

  return (
    <Box>
      <Box position="relative" height="150px">
        <Doughnut data={nextData} options={options} datasetKeyProvider={datasetKeyProvider} />
        <Box position="absolute" className={classes.sumContainer}>
          <div className={classes.total}>{getSum()}</div>
          <div className={classes.marketValue}>Market Value</div>
        </Box>
      </Box>
      <Box className={classes.bottomContainer}>
        {nextData.datasets[0].data.map((obj, index) => (
          <div className={classes.bottomList}>
            <div
              className={classes.listIcon}
              style={{ backgroundColor: `${nextData.datasets[0].backgroundColor[index]}` }}
            />
            <div className={classes.listText}>
              <div>{`${nextData.labels[index]}`}</div>
              <div>{`${obj.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</div>
            </div>
          </div>
        ))}
      </Box>
    </Box>
  )
}

export default DoughnutChart
