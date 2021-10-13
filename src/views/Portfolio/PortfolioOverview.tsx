import React from 'react'
import { Typography, Theme, Box, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import OverviewListCard from '../../components/OverviewListCard'
import { PortfolioInterface } from '../../graphql/portfolio/typings'
import getNumberWithCommas from '../../utils/getNumberWithCommas'
import { TotalsAndAverages } from '../../utils/getCalculatedAssetsAndTotals'
import { BenchmarkInterface } from '../../graphql/benchmark/typing'
import { useListBenchmarkPrices } from '../../graphql/benchmarkPrice/queries'
import getPopulationVariance from '../../utils/getPopulationVariance'
import getAverage from '../../utils/getAverage'
import { ReturnInterface } from '../../graphql/return/typing'
import CircularLoader from '../../components/CircularLoader'

const useStyles = makeStyles((theme: Theme) => ({
  sectionTitle: {
    margin: theme.spacing(0, 1, 1, 0),
    lineHeight: 1,
  },
}))

interface PortfolioOverviewProps {
  loading: boolean
  portfolio: PortfolioInterface
  totalsAndAverages: TotalsAndAverages
  benchmark: BenchmarkInterface
  returns: ReturnInterface[]
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = (props) => {
  const classes = useStyles()
  const { loading, portfolio, totalsAndAverages, benchmark, returns } = props

  const { startingNAV, cash } = portfolio || {}
  const { nav, totalWeightedBeta, totalWeightedDivYld } = totalsAndAverages || {}
  const { prices } = benchmark || {}

  const startOfYear = moment()
    .startOf('years')
    .format()
  const numOfDays = returns?.length || 0

  const benchmarkID = benchmark?.id
  const { loading: benchmarkPricesLoading, benchmarkPrices } = useListBenchmarkPrices({
    variables: {
      filter: {
        benchmarkID: { eq: benchmarkID },
        createdAt: { eq: startOfYear },
      },
    },
    skip: !benchmarkID,
  })

  const benchmarkStartPrice = benchmarkPrices?.length > 0 ? benchmarkPrices[0]?.value : 1
  const benchmarkLastPrice = prices?.items?.length ? prices.items[prices.items.length - 1].value : 0

  // All percentages below are stored in decimal format
  const ytdReturn = benchmarkLastPrice / benchmarkStartPrice - 1
  const volatility = Math.sqrt(getPopulationVariance(returns, 'relValue') * numOfDays)

  const rfr = 0.0098
  const meanReturn = getAverage(returns, 'relValue') * numOfDays
  const excessReturn = meanReturn - rfr
  const sharpeRatio = excessReturn / volatility

  const PORTFOLIO_STATS = [
    {
      title: 'Net Asset Value',
      value: getNumberWithCommas(nav),
      isPercentage: false,
      hasPositiveIcon: false,
      hasNegativeIcon: false,
    },
    {
      title: 'Starting NAV',
      value: getNumberWithCommas(startingNAV),
      isPercentage: false,
      hasPositiveIcon: false,
      hasNegativeIcon: false,
    },
    {
      title: 'Cash',
      value: getNumberWithCommas(cash),
      isPercentage: false,
      hasPositiveIcon: cash >= 0,
      hasNegativeIcon: cash < 0,
    },
    {
      title: 'YTD Return',
      value: getNumberWithCommas(ytdReturn * 100),
      isPercentage: true,
      hasPositiveIcon: false,
      hasNegativeIcon: true,
    },
    {
      title: 'Benchmark Level',
      value: getNumberWithCommas(benchmarkLastPrice),
      isPercentage: false,
      hasPositiveIcon: false,
      hasNegativeIcon: false,
    },
    {
      title: 'Yield',
      value: getNumberWithCommas(totalWeightedDivYld * 100),
      isPercentage: true,
      hasPositiveIcon: false,
      hasNegativeIcon: false,
    },
    {
      title: 'Sharpe Ratio',
      value: sharpeRatio.toFixed(2),
      isPercentage: false,
      hasPositiveIcon: false,
      hasNegativeIcon: false,
    },
    {
      title: 'Beta',
      value: totalWeightedBeta?.toFixed(2) || '',
      isPercentage: false,
      hasPositiveIcon: false,
      hasNegativeIcon: false,
    },
    {
      title: 'Volatility',
      value: getNumberWithCommas(volatility * 100),
      isPercentage: false,
      hasPositiveIcon: false,
      hasNegativeIcon: false,
    },
  ]

  return (
    <CircularLoader loading={loading || benchmarkPricesLoading}>
      <Box height="100%" py={2}>
        <Box>
          <Typography className={classes.sectionTitle} variant="h5">
            Overview
          </Typography>
        </Box>
        <Box height="100%" display="flex" flexDirection="column" justifyContent="space-between">
          {PORTFOLIO_STATS.map((stat) => (
            <Grid item key={stat.title}>
              <OverviewListCard stat={stat} />
            </Grid>
          ))}
        </Box>
      </Box>
    </CircularLoader>
  )
}

export default PortfolioOverview
