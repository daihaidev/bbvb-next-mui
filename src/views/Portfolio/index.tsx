import React from 'react'
import { Box, Grid, Theme, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import { getGraphQLFilter } from '@onextech/gvs-kit/utils'
import { sumBy, groupBy } from 'lodash'
import Link from 'next/link'
import Layout from '../../components/Layout/Layout'
import routes from '../../routes'
import Breadcrumbs from '../../components/Layout/Breadcrumbs'
import PortfolioOverview from './PortfolioOverview'
import PortfolioCompanyChart from './PortfolioCompanyChart'
import PortfolioStrategyChart, { StrategyTypeEnum } from './PortfolioStrategyChart'
import PortfolioTable from './PortfolioTable'
import { useListPortfolios } from '../../graphql/portfolio/queries'
import { useListAssets } from '../../graphql/asset/queries'
import { useAuth } from '../../auth'
import { useGetBenchmark } from '../../graphql/benchmark/queries'
import CompanySectorAnalysis from './CompanySectorAnalysisTable'
import getCalculatedAssetsAndTotals from '../../utils/getCalculatedAssetsAndTotals'
import { DEFAULT_TOTALS_AND_AVERAGES } from '../Performance/constants'
import { useListReturnsByPortfolioID } from '../../graphql/return/queries'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  header: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  contentWrapper: {
    padding: theme.spacing(2, 3),
  },
  builderButton: {
    padding: theme.spacing(1),
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.main,
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1, 2),
    },
  },
  overviewContainer: {
    paddingRight: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.border.main}`,
    borderRight: `1px solid ${theme.palette.border.main}`,
  },
  companySector: {
    borderTop: `1px solid ${theme.palette.border.main}`,
    height: '100%',
    padding: theme.spacing(0, 2),
  },
  widgetSector: {
    marginTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.border.main}`,
    borderBottom: `1px solid ${theme.palette.border.main}`,
    height: 310,
    padding: theme.spacing(2, 1),
  },
  portfolioTableWrapper: {
    borderTop: `1px solid ${theme.palette.border.main}`,
    borderBottom: `1px solid ${theme.palette.border.main}`,
    margin: theme.spacing(3.25, 0, 2.5),
  },
}))

const assetFilterFields = {
  assets: { op: 'eq', key: 'id' },
}

const Performance: React.FC = (props) => {
  const classes = useStyles(props)

  const { user } = useAuth()
  const userID = user?.id

  // Get Portfolio
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

  // Get Benchmark used by Portfolio
  const benchmarkID = portfolio?.baseBenchmark?.benchmarkID
  const { loading: benchmarkLoading, benchmark } = useGetBenchmark({
    variables: { id: benchmarkID },
    skip: !benchmarkID,
  })

  // Get Portfolio Returns
  const { loading: returnLoading, returns } = useListReturnsByPortfolioID({
    variables: {
      portfolioID,
    },
    skip: !portfolioID,
  })

  // CALCULATIONS
  const { assets: calculatedAssets = [], totalsAndAverages = DEFAULT_TOTALS_AND_AVERAGES } =
    !portfolio || !assets?.length ? {} : getCalculatedAssetsAndTotals(portfolio, assets)

  const benchmarkWeightsBySector =
    benchmark?.sectors?.reduce(
      (acc, { title, weight }) => ({
        ...acc,
        [title]: weight,
      }),
      {}
    ) || {}

  // All calculated properties below are percentages stored in decimal format
  const sectorsAnalysis = Object.entries(groupBy(calculatedAssets, 'sector')).map(([sector, assets]) => {
    const port = sumBy(assets, 'weight')
    const bench = benchmarkWeightsBySector[sector] || 0
    const active = port - bench
    const absReturns = sumBy(assets, 'absGainLossPercent')

    return {
      sector,
      port,
      bench,
      active,
      absReturns,
    }
  })

  return (
    <Layout contentClassName={classes.contentWrapper} title="Portfolio" hideNav>
      <Box className={classes.header} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Breadcrumbs routes={routes} />
        </Box>
        <Link href={routes.PORTFOLIO_BUILDER} passHref>
          <Button className={classes.builderButton} endIcon={<ArrowRightAltIcon />}>
            Portfolio Builder
          </Button>
        </Link>
      </Box>
      <Box className={classes.root}>
        <Grid container>
          {/* Overview */}
          <Grid item xs={12} md={4}>
            <Box height="100%" className={classes.overviewContainer}>
              <PortfolioOverview
                loading={nextLoading || benchmarkLoading || returnLoading}
                portfolio={portfolio}
                totalsAndAverages={totalsAndAverages}
                benchmark={benchmark}
                returns={returns}
              />
            </Box>
          </Grid>

          {/* Company Sector Weights */}
          <Grid item xs={12} md={8}>
            <Box className={classes.companySector}>
              <PortfolioCompanyChart
                loading={nextLoading || benchmarkLoading}
                assets={calculatedAssets}
                benchmark={benchmark}
              />
            </Box>
          </Grid>

          {/* Portfolio Table */}
          <Grid item xs={12}>
            <Box className={classes.portfolioTableWrapper}>
              <PortfolioTable
                loading={nextLoading}
                portfolio={portfolio}
                assets={calculatedAssets}
                totalsAndAverages={totalsAndAverages}
              />
            </Box>
          </Grid>

          {/* Strategy Charts */}
          <Grid item xs={12} container>
            <Grid item xs={12} md={6}>
              <Box display="flex" className={classes.widgetSector}>
                <PortfolioStrategyChart
                  title="Strategy Weights"
                  loading={nextLoading}
                  assets={calculatedAssets}
                  type={StrategyTypeEnum.Strategy}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" className={classes.widgetSector}>
                <PortfolioStrategyChart
                  title="Sub-Strategy Weights"
                  loading={nextLoading}
                  assets={calculatedAssets}
                  type={StrategyTypeEnum.SubStrategy}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Company Sector Analysis Table */}
          <Grid item xs={12}>
            <CompanySectorAnalysis loading={nextLoading || benchmarkLoading} sectorsAnalysis={sectorsAnalysis} />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
}

export default Performance
