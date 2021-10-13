import React from 'react'
import { Box, Grid, Theme, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getGraphQLFilter } from '@onextech/gvs-kit/utils'
import moment, { DurationInputArg2 } from 'moment'
import Layout from '../../components/Layout/Layout'
import TopFiveAssetsChart from './TopFiveAssetsChart'
import RiskBetaLandscapeChart from './RiskBetaLandscapeChart'
import getCalculatedAssetsAndTotals from '../../utils/getCalculatedAssetsAndTotals'
import { useAuth } from '../../auth'
import { useListPortfolios } from '../../graphql/portfolio/queries'
import { useListAssets } from '../../graphql/asset/queries'
import PerformanceHistoryChart from '../Performance/PerformanceHistoryChart'
import { useListReturnsByPortfolioID } from '../../graphql/return/queries'
import useListBenchmarkPricesByBenchmarkID from '../../graphql/benchmarkPrice/queries/useListBenchmarkPricesByBenchmarkID'
import config from '../../config'

const currentTime = moment().format()
const queryMaxDateLimit = moment()
  .subtract(config.queryDateLimit.amount, config.queryDateLimit.unitOfTime as DurationInputArg2)
  .format()

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
        padding: theme.spacing(2, 0, 2, 2),
      },
      '& > :not(:first-child)': {
        borderLeft: `1px solid ${theme.palette.border.secondary}`,
      },
    },
  },
  chartContainer: {
    marginBottom: theme.spacing(5),
  },
  topContainer: {
    '& > canvas': {
      height: '355px !important',
    },
  },
  landScapeContainer: {
    '& > canvas': {
      height: '500px !important',
    },
  },
}))

const assetFilterFields = {
  assets: { op: 'eq', key: 'id' },
}

const RiskManager: React.FC = (props) => {
  const classes = useStyles()

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

  // List Portfolio Returns
  const { loading: returnLoading, returns } = useListReturnsByPortfolioID({
    variables: {
      portfolioID,
    },
    skip: !portfolioID,
  })

  // List Assets by assetIDs from Portfolio
  const filters = { assets: portfolio?.assets?.map(({ assetID }) => assetID) }
  const filter = getGraphQLFilter(assetFilterFields)(filters)
  const { loading: assetsLoading, assets } = useListAssets({ variables: { filter }, skip: !portfolio })
  const nextLoading = portfolioLoading || assetsLoading

  // CALCULATIONS
  const { assets: calculatedAssets = [] } =
    !portfolio || !assets?.length ? {} : getCalculatedAssetsAndTotals(portfolio, assets)

  // Processing Benchmark Returns
  const benchmarkPricesWithReturns = benchmarkPrices?.map(({ createdAt, value }, index) => ({
    createdAt,
    absValue: value, // Benchmark price
    relValue: index === 0 ? 0 : value / benchmarkPrices[index - 1].value - 1, // Benchmark Return
  }))

  return (
    <Layout contentClassName={classes.contentWrapper} title="RiskManager">
      <Box className={classes.root}>
        <Divider />
        <Grid container className={classes.chartContainer}>
          <Grid item xs={12} md={7} className={classes.topContainer}>
            <PerformanceHistoryChart
              loading={portfolioLoading || benchmarkPriceLoading || returnLoading}
              returns={returns}
              benchmarkPricesWithReturns={benchmarkPricesWithReturns}
              title="Returns Analysis"
            />
          </Grid>
          <Grid item xs={12} md={5} className={classes.topContainer}>
            <TopFiveAssetsChart loading={nextLoading} assets={calculatedAssets} />
          </Grid>
        </Grid>
        <Divider />
        <Grid container>
          <Grid item xs={12} md={12}>
            <Box mt={3.5} className={classes.landScapeContainer}>
              <RiskBetaLandscapeChart loading={nextLoading} assets={calculatedAssets} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
}

export default RiskManager
