import React from 'react'
import { Box, Grid, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getGraphQLFilter } from '@onextech/gvs-kit/utils'
import { round, sumBy, groupBy } from 'lodash'
import moment, { DurationInputArg2 } from 'moment'
import { SectorEnum } from '@onextech/btb-api'
import Layout from '../../components/Layout/Layout'
import StatCard from '../../components/StatCard'
import PerformanceHistoryChart from './PerformanceHistoryChart'
import PerformanceStrategyChart from './PerformanceStrategyChart'
import PerformanceCompanyChart from './PerformanceCompanyChart'
import { useListPortfolios } from '../../graphql/portfolio/queries'
import { useListAssets } from '../../graphql/asset/queries'
import { useListReturnsByPortfolioID } from '../../graphql/return/queries'
import getCalculatedAssetsAndTotals from '../../utils/getCalculatedAssetsAndTotals'
import { useAuth } from '../../auth'
import { DEFAULT_TOTALS_AND_AVERAGES } from './constants'
import useListBenchmarkPricesByBenchmarkID from '../../graphql/benchmarkPrice/queries/useListBenchmarkPricesByBenchmarkID'
import config from '../../config'

export interface BenchmarkPricesWithReturns {
  createdAt: string
  absValue: number
  relValue: number
}

const currentTime = moment().format()
const queryMaxDateLimit = moment()
  .subtract(config.queryDateLimit.amount, config.queryDateLimit.unitOfTime as DurationInputArg2)
  .format()

const NEGATIVE = 'negative'
const POSITIVE = 'positive'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  contentWrapper: {
    padding: theme.spacing(2, 3),
  },
  statContainer: {
    borderBottom: `1px solid ${theme.palette.border.secondary}`,
    borderTop: `1px solid ${theme.palette.border.secondary}`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& > *': {
        padding: theme.spacing(2, 0),
        borderBottom: `1px solid ${theme.palette.border.secondary}`,
      },
    },
    [theme.breakpoints.up('md')]: {
      justifyContent: 'space-between',
      '& > *': {
        padding: theme.spacing(1, 0, 1, 2),
      },
      '& > :not(:first-child)': {
        borderLeft: `1px solid ${theme.palette.border.secondary}`,
      },
    },
  },
}))

const assetFilterFields = {
  assets: { op: 'eq', key: 'id' },
}

const Performance: React.FC = (props) => {
  const classes = useStyles(props)

  const { user } = useAuth()
  const userID = user?.id

  // List Portfolio by userID and take the first portfolio
  const { loading: portfolioLoading, portfolios } = useListPortfolios({
    variables: {
      filter: {
        userID: { eq: userID },
      },
    },
    skip: !userID,
  })
  const [portfolio] = portfolios || []
  const portfolioID = portfolio?.id

  // List Assets by assetIDs from Portfolio
  const filters = { assets: portfolio?.assets?.map(({ assetID }) => assetID) }
  const filter = getGraphQLFilter(assetFilterFields)(filters)
  const { loading: assetsLoading, assets } = useListAssets({ variables: { filter }, skip: !portfolio })
  const nextLoading = portfolioLoading || assetsLoading

  // List Portfolio Returns
  const { loading: returnLoading, returns } = useListReturnsByPortfolioID({
    variables: {
      portfolioID,
    },
    skip: !portfolioID,
  })

  // List Benchmark Prices
  const benchmarkID = portfolio?.baseBenchmark?.benchmarkID
  const { loading: benchmarkPriceLoading, benchmarkPrices } = useListBenchmarkPricesByBenchmarkID({
    variables: {
      benchmarkID,
      createdAt: {
        between: [queryMaxDateLimit, currentTime],
      },
    },
    skip: !benchmarkID,
  })

  // CALCULATIONS
  const { assets: calculatedAssets = [], totalsAndAverages = DEFAULT_TOTALS_AND_AVERAGES } =
    !portfolio || !assets?.length ? {} : getCalculatedAssetsAndTotals(portfolio, assets)
  const { nav, totalGainLoss, totalGainLossPercent } = totalsAndAverages || {}

  const benchmarkPricesLength = benchmarkPrices?.length || 0
  const { value: lastBenchmarkPrice = 0 } = benchmarkPrices?.[benchmarkPricesLength - 1] || {}
  const { value: prevLastBenchmarkPrice = 1 } = benchmarkPrices?.[benchmarkPricesLength - 2] || {}

  const portfolioReturn = returns?.length > 1 ? returns[returns.length - 1]?.relValue : 0
  const benchmarkReturn = lastBenchmarkPrice / prevLastBenchmarkPrice - 1
  const dailyActiveVsBenchmarkByPercent = portfolioReturn - benchmarkReturn

  const PERFORMANCE_STATS = [
    {
      title: 'Net Asset Value',
      value: nav,
      isPercentage: false,
      performance: nav < 0 ? NEGATIVE : POSITIVE,
    },
    {
      title: 'Benchmark Price',
      value: lastBenchmarkPrice || 0,
      isPercentage: false,
      performance: lastBenchmarkPrice < 0 ? NEGATIVE : POSITIVE,
    },
    {
      title: 'Daily Performance in $',
      value: totalGainLoss,
      isPercentage: false,
      performance: totalGainLoss < 0 ? NEGATIVE : POSITIVE,
    },
    {
      title: 'Daily Performance by %',
      value: round(totalGainLossPercent, 2),
      isPercentage: true,
      performance: totalGainLossPercent < 0 ? NEGATIVE : POSITIVE,
    },
    {
      title: 'Daily Active vs Benchmark by %',
      value: round(dailyActiveVsBenchmarkByPercent, 2),
      isPercentage: true,
      performance: dailyActiveVsBenchmarkByPercent < 0 ? NEGATIVE : POSITIVE,
    },
  ]

  // Processing Benchmark Returns
  const benchmarkPricesWithReturns = benchmarkPrices?.map(({ createdAt, value }, index) => ({
    createdAt,
    absValue: value, // Benchmark price
    relValue: index === 0 ? 0 : value / benchmarkPrices[index - 1].value - 1, // Benchmark Return
  }))

  const benchmarkWeightsBySector =
    benchmarkPrices?.[0]?.benchmark?.sectors?.reduce(
      (acc, { title, weight }) => ({
        ...acc,
        [title]: weight,
      }),
      {}
    ) || {}

  // All calculated properties below are percentages stored in decimal format
  const scaledBenchmarkPrice = lastBenchmarkPrice / (lastBenchmarkPrice / nav)
  const calculatedAssetsGroupedBySectors = groupBy(calculatedAssets, 'sector')

  const performanceBySector = Object.values(SectorEnum).map((sectorName) => {
    // Portfolio return here uses 'absGainLossPercent' instead of 'weight'
    const portReturn = sumBy(calculatedAssetsGroupedBySectors[sectorName], 'weight')
    const port = {
      relValue: portReturn,
      absValue: portReturn * nav,
    }

    const benchReturn = (benchmarkWeightsBySector[sectorName] || 0) * benchmarkReturn
    const bench = {
      relValue: benchReturn,
      absValue: benchReturn * scaledBenchmarkPrice,
    }

    const active = {
      relValue: port.relValue - bench.relValue,
      absValue: port.absValue - bench.absValue,
    }

    // TODO: Confirm with Joel for 'absGainLoss.absValue'
    const absGainLossReturn = sumBy(calculatedAssetsGroupedBySectors[sectorName], 'absGainLossPercent')
    const absGainLoss = {
      relValue: absGainLossReturn,
      absValue: absGainLossReturn * nav,
    }

    return {
      sector: sectorName,
      port,
      bench,
      active,
      absGainLoss,
    }
  })

  return (
    <Layout contentClassName={classes.contentWrapper} title="Performance">
      <Box className={classes.root}>
        {/* Stats */}
        <Grid container className={classes.statContainer}>
          {PERFORMANCE_STATS.map((stat) => (
            <Grid item key={stat.title}>
              <StatCard stat={stat} />
            </Grid>
          ))}
        </Grid>
        <Grid container>
          {/* Performance History */}
          <Grid item xs={12} md={7}>
            <PerformanceHistoryChart
              loading={nextLoading || benchmarkPriceLoading || returnLoading}
              returns={returns}
              benchmarkPricesWithReturns={benchmarkPricesWithReturns}
              title="Performance History"
            />
          </Grid>
          {/* Performance by Strategy */}
          <Grid item xs={12} md={5}>
            <PerformanceStrategyChart loading={nextLoading} assets={calculatedAssets} />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <PerformanceCompanyChart
                loading={nextLoading || benchmarkPriceLoading || returnLoading}
                performanceBySector={performanceBySector}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
}

export default Performance
