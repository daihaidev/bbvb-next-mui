import React, { useRef } from 'react'
import { startCase, lowerCase } from 'lodash'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Paper,
  Toolbar,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from '@material-ui/core'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import * as colors from '@material-ui/core/colors'
import clsx from 'clsx'
import AssetAddModal from '../Asset/AssetAddModal'
import { PortfolioInterface } from '../../graphql/portfolio/typings'
import printPercentage from '../../utils/printPercentage'
import printCurrency from '../../utils/printCurrency'
import { Asset, TotalsAndAverages } from '../../utils/getCalculatedAssetsAndTotals'
import CircularLoader from '../../components/CircularLoader'
import HighlightPercentTrend from '../PortfolioBuilder/HighlightPercentTrend'

interface PortfolioTableStyles {
  isGrowthNegative?: boolean
}

const useStyles = makeStyles<Theme, PortfolioTableStyles>((theme) => ({
  tableContainer: {
    maxHeight: 450,
    [theme.breakpoints.up('sm')]: {
      maxHeight: 500,
    },
    [theme.breakpoints.up('lg')]: {
      maxHeight: 425,
    },
  },
  tableRoot: {
    [theme.breakpoints.up('md')]: {
      width: '100%',
      tableLayout: 'fixed',
    },
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(1),
  },
  tableHead: {
    '& > .MuiTableRow-root > .MuiTableCell-root': {
      borderBottom: 'none',
      padding: theme.spacing(1),
      fontSize: theme.typography.pxToRem(14),
      color: theme.palette.text.hint,
    },
  },
  tableRowWrapper: {
    '& > .MuiTableCell-root': {
      borderBottom: 'none',
      borderTop: `1px solid ${theme.palette.border.main}`,
      padding: theme.spacing(1),
      fontSize: theme.typography.pxToRem(14),
      fontWeight: 500,
      '& > :not(:first-child)': {
        fontWeight: 400,
      },
    },
  },
  lastRowWrapper: {
    '& > .MuiTableCell-root': {
      padding: theme.spacing(2, 1),
    },
  },
  totalCell: {
    [theme.breakpoints.only('xs')]: {
      minWidth: 90,
    },
  },
  lastRowSpacing: {
    [theme.breakpoints.only('xs')]: {
      minWidth: 380,
    },
  },
  gainLossGrowthLabel: ({ isGrowthNegative }) => ({
    color: isGrowthNegative ? colors.red['A200'] : colors.green['A700'],
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 500,
  }),
  gainLossGrowthWrapper: ({ isGrowthNegative }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: isGrowthNegative ? colors.red['A200'] : colors.green['A700'],
    '& > .MuiSvgIcon-root': {
      fontSize: theme.typography.pxToRem(20),
      marginRight: theme.spacing(0.5),
    },
  }),
}))

const GainLossTrend = ({ gainLossPercent }) => {
  const classes = useStyles({ isGrowthNegative: gainLossPercent < 0 })

  return (
    <div className={classes.gainLossGrowthWrapper}>
      {gainLossPercent > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
      <Typography className={classes.gainLossGrowthLabel}>{printPercentage(gainLossPercent)}</Typography>
    </div>
  )
}

interface PortfolioTableProps {
  loading: boolean
  portfolio: PortfolioInterface
  assets: Asset[]
  totalsAndAverages: TotalsAndAverages
}

const PortfolioTable: React.FC<PortfolioTableProps> = (props) => {
  // Put {} since PortfolioTableProps doesn't have any of PortfolioFormValues properties
  const classes = useStyles({})
  const { loading, assets, totalsAndAverages, portfolio } = props
  const { baseCurrency } = portfolio || {}

  const {
    avgBeta,
    totalDivYld,
    totalWeightedDivYld,
    nav,
    totalGainLoss,
    totalGainLossPercent,
    totalCashValue,
    totalCashValuePercent,
  } = totalsAndAverages || {}

  // Refs for syncing horizontal scrolling between them
  const portfolioTableRef = useRef<HTMLElement>(null)
  const totalRowRef = useRef<HTMLElement>(null)
  // Listens to current scroll position and set the same for target
  const handleScroll = (targetRef: React.MutableRefObject<HTMLElement>) => (e: React.UIEvent<HTMLDivElement>) => {
    if (targetRef.current && targetRef.current.scrollLeft !== e.currentTarget.scrollLeft) {
      targetRef.current.scrollLeft = e.currentTarget.scrollLeft // eslint-disable-line no-param-reassign
    }
  }

  return (
    <CircularLoader loading={loading}>
      <Paper elevation={0}>
        <Toolbar disableGutters className={classes.toolbar}>
          <Typography variant="h5">Portfolio</Typography>
          <Box>
            <AssetAddModal portfolio={portfolio} />
          </Box>
        </Toolbar>
        <TableContainer className={classes.tableContainer} onScroll={handleScroll(totalRowRef)} ref={portfolioTableRef}>
          <Table className={classes.tableRoot} stickyHeader>
            {/* Header */}
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Beta</TableCell>
                <TableCell>Strategy</TableCell>
                <TableCell>Sector</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Traded Price</TableCell>
                <TableCell align="right">Last Price</TableCell>
                <TableCell align="right" className={classes.currencyCell}>
                  Market Value
                </TableCell>
                <TableCell align="right" className={classes.currencyCell}>
                  Gain/Loss
                </TableCell>
                <TableCell align="right">Dividend Yield</TableCell>
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {assets?.map((asset) => {
                const {
                  title,
                  ticker,
                  sector,
                  subSector,
                  netPrice,
                  netQuantity,
                  lastPrice,
                  marketValue,
                  weight,
                  gainLoss,
                  gainLossPercent,
                  beta,
                  weightedBeta,
                  divYld, // TODO: Confirm whether db stores the percent amount or decimal amount (currently assumed percent amount)
                  weightedDivYld,
                  strategy,
                  subStrategy,
                } = asset

                return (
                  <TableRow className={classes.tableRowWrapper}>
                    <TableCell>
                      <div>{title}</div>
                      <div>{ticker}</div>
                    </TableCell>
                    <TableCell>
                      <div>{beta}</div>
                      <div>{weightedBeta.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div>{strategy}</div>
                      <div>{subStrategy}</div>
                    </TableCell>
                    <TableCell>
                      <div>{startCase(lowerCase(sector?.replace('_', ' ')))}</div>
                      <div>{subSector}</div>
                    </TableCell>
                    <TableCell align="right">{netQuantity}</TableCell>
                    <TableCell align="right">
                      <div>{netPrice}</div>
                      <div>{baseCurrency}</div>
                    </TableCell>
                    <TableCell align="right">
                      <div>{lastPrice}</div>
                      <div>{baseCurrency}</div>
                    </TableCell>
                    <TableCell align="right" className={classes.currencyCell}>
                      <div>{printCurrency({ amount: marketValue })}</div>
                      <div>{printPercentage(weight)}</div>
                    </TableCell>
                    <TableCell align="right" className={classes.currencyCell}>
                      <div>{printCurrency({ amount: gainLoss, hasPlusSign: true })}</div>
                      <GainLossTrend gainLossPercent={gainLossPercent} />
                    </TableCell>
                    <TableCell align="right">
                      <div>{printPercentage(divYld)}</div>
                      <div>{printPercentage(weightedDivYld)}</div>
                    </TableCell>
                  </TableRow>
                )
              })}

              {/* Cash */}
              <TableRow className={clsx(classes.tableRowWrapper, classes.lastRowWrapper)}>
                <TableCell>
                  <div>Cash</div>
                  <div>Cash</div>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">
                  <div>Cash</div>
                  <div>Cash</div>
                </TableCell>
                <TableCell align="right">{baseCurrency}</TableCell>
                <TableCell align="right" className={classes.currencyCell}>
                  <div>{printCurrency({ amount: totalCashValue })}</div>
                  <HighlightPercentTrend percentValue={totalCashValuePercent} />
                </TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals */}
        <TableContainer onScroll={handleScroll(portfolioTableRef)} ref={totalRowRef}>
          <Table className={classes.tableRoot}>
            <TableRow className={clsx(classes.tableRowWrapper, classes.lastRowWrapper)}>
              <TableCell className={classes.totalCell}>Total</TableCell>
              <TableCell>{avgBeta.toFixed(2)}</TableCell>
              <TableCell className={classes.lastRowSpacing} colSpan={5} />
              <TableCell align="right">{printCurrency({ amount: nav })}</TableCell>
              <TableCell align="right">
                <div>{printCurrency({ amount: totalGainLoss })}</div>
                <GainLossTrend gainLossPercent={totalGainLossPercent} />
              </TableCell>
              <TableCell align="right">
                <div>{printPercentage(totalDivYld)}</div>
                <div>{printPercentage(totalWeightedDivYld)}</div>
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      </Paper>
    </CircularLoader>
  )
}

export default PortfolioTable
