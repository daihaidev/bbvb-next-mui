import React from 'react'
import { Box, Grid, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getGraphQLFilter } from '@onextech/gvs-kit/utils'
import Layout from '../../components/Layout/Layout'
import routes from '../../routes'
import Breadcrumbs from '../../components/Layout/Breadcrumbs'
import PortfolioCompanyChart from '../Portfolio/PortfolioCompanyChart'
import PortfolioStrategyChart, { StrategyTypeEnum } from '../Portfolio/PortfolioStrategyChart'
import { useListAssets } from '../../graphql/asset/queries'
import { useAuth } from '../../auth'
import { useGetBenchmark } from '../../graphql/benchmark/queries'
import getCalculatedAssetsAndTotals from '../../utils/getCalculatedAssetsAndTotals'
import { DEFAULT_TOTALS_AND_AVERAGES } from '../Performance/constants'
import CashAddModal from '../Cash/CashAddModal'
import PortfolioModellingTable from './PortfolioModellingTable'
import useListPortfolios from '../../graphql/portfolio/queries/useListPortfolios'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  contentWrapper: {
    padding: theme.spacing(2, 3),
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
  portfolioModellingTableWrapper: {
    borderTop: `1px solid ${theme.palette.border.main}`,
    borderBottom: `1px solid ${theme.palette.border.main}`,
    marginBottom: theme.spacing(2.5),
  },
}))

const assetFilterFields = {
  assets: { op: 'eq', key: 'id' },
}

const PortfolioBuilder: React.FC = (props) => {
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

  // CALCULATIONS
  const { assets: calculatedAssets = [], totalsAndAverages = DEFAULT_TOTALS_AND_AVERAGES } =
    !portfolio || !assets?.length ? {} : getCalculatedAssetsAndTotals(portfolio, assets)

  return (
    <Layout contentClassName={classes.contentWrapper} title="Portfolio" hideNav>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Breadcrumbs routes={routes} />
        </Box>
        <CashAddModal portfolio={portfolio} />
      </Box>
      <Box className={classes.root}>
        <Grid container>
          {/* Portfolio Table */}
          <Grid item xs={12}>
            <Box className={classes.portfolioModellingTableWrapper}>
              <PortfolioModellingTable
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

          {/* Company Sector Weights */}
          <Grid item xs={12}>
            <Box className={classes.companySector}>
              <PortfolioCompanyChart
                loading={nextLoading || benchmarkLoading}
                assets={calculatedAssets}
                benchmark={benchmark}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
}

export default PortfolioBuilder
