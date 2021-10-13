import React, { useMemo, useEffect, useState, useRef } from 'react'
import { lowerCase, startCase, round } from 'lodash'
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
  Button,
  Snackbar,
} from '@material-ui/core'
import * as colors from '@material-ui/core/colors'
import { addTypename } from '@onextech/gvs-kit/utils'
import clsx from 'clsx'
import { useForm, Controller, ErrorMessage } from 'react-hook-form'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined'
import nanoid from 'nanoid'
import { TradeTypeEnum } from '@onextech/btb-api'
import { Alert } from '@material-ui/lab'

import AssetAddModal from '../Asset/AssetAddModal'
import { PortfolioInterface } from '../../graphql/portfolio/typings'
import printPercentage from '../../utils/printPercentage'
import printCurrency from '../../utils/printCurrency'
import { Asset, TotalsAndAverages } from '../../utils/getCalculatedAssetsAndTotals'
import HighlightNumberField from './HighlightNumberField'
import { useUpdatePortfolio } from '../../graphql/portfolio/mutations'
import { ConfirmationOptions, ConfirmationDialog } from './ConfirmationDialog'
import CircularLoader from '../../components/CircularLoader'
import HighlightPercentTrend from './HighlightPercentTrend'

interface PortfolioModellingTableFormValues {
  [key: string]: {
    newWeight?: number
    newMarketValue?: number
  }
}

interface PortfolioModellingTableStyles {
  isGrowthNegative?: boolean
}

const useStyles = makeStyles<Theme, PortfolioModellingTableStyles>((theme) => ({
  // Table Styles
  tableContainer: {
    maxHeight: 390,
    [theme.breakpoints.up('sm')]: {
      maxHeight: 440,
    },
    [theme.breakpoints.up('md')]: {
      maxHeight: 435,
    },
    [theme.breakpoints.up('lg')]: {
      maxHeight: 445,
    },
  },
  tableRoot: {
    [theme.breakpoints.up('md')]: {
      width: '100%',
      tableLayout: 'fixed',
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
      '&:last-child': {
        borderRight: `1px solid ${theme.palette.border.main}`,
      },
    },
  },
  lastRowWrapper: {
    '& > .MuiTableCell-root': {
      padding: theme.spacing(2, 1),
    },
  },
  currencyCell: {
    minWidth: 135,
  },
  inputCell: {
    minWidth: 160,
    borderLeft: `1px solid ${theme.palette.border.main}`,
    '& > .MuiInputBase-root': {
      height: '100%',
    },
  },
  actionCell: {
    '& > :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
    '& > .MuiButton-root': {
      borderRadius: 18,
    },
  },

  // Button Styles
  saveChangesButton: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.main,
    },
  },

  // Custom Component Styles
  highlightLabel: ({ isGrowthNegative }) => ({
    color: isGrowthNegative ? colors.red['A200'] : colors.green['A700'],
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 500,
  }),

  // Other Styles
  errorText: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 400,
    textTransform: 'none',
  },
  snackbar: {
    '& > .MuiAlert-standardSuccess': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      fontSize: theme.typography.pxToRem(14),
      padding: theme.spacing(0.5, 1.5),
      '& > .MuiAlert-icon': {
        color: theme.palette.primary.contrastText,
        '& > .MuiAlert-message': {
          fontWeight: 500,
        },
      },
    },
  },
}))

const HighlightNumber = (props) => {
  const { value, hasPlusSign } = props
  const classes = useStyles({ isGrowthNegative: value < 0 })

  const nextValue = value || 0
  const isValueNegative = value && value < 0
  const prefix = isValueNegative ? '-' : hasPlusSign ? '+' : ''

  return (
    <div>
      <Typography className={classes.highlightLabel}>{`${prefix}${Math.abs(nextValue)}`}</Typography>
    </div>
  )
}

function getNewMarketValue(weightPercent, marketValue, nav) {
  const weight = weightPercent / 100
  const restOfMarketValues = nav - marketValue
  return (weight * restOfMarketValues) / (1 - weight)
}

interface PortfolioModellingTableProps {
  loading: boolean
  portfolio: PortfolioInterface
  assets: Asset[]
  totalsAndAverages: TotalsAndAverages
}

const PortfolioModellingTable: React.FC<PortfolioModellingTableProps> = (props) => {
  // Put {} since PortfolioModellingTableProps doesn't have any of PortfolioFormValues properties
  const classes = useStyles({})
  const { loading, assets, totalsAndAverages, portfolio } = props
  const { avgBeta, nav, totalCashValue, totalCashValuePercent } = totalsAndAverages || {}
  const { baseCurrency } = portfolio || {}

  // Local State
  const [quantityChange, setQuantityChange] = useState({})
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false)
  const handleCloseSnackbar = () => setIsOpenSnackbar(false)

  // Hooks
  const { handleUpdatePortfolio } = useUpdatePortfolio()

  const defaultValues = useMemo(
    () =>
      assets?.reduce((acc, { ticker }) => {
        acc[ticker] = { newWeight: null, newMarketValue: null }
        return acc
      }, {}),
    [loading, assets]
  )

  const { control, handleSubmit, reset, setValue, errors, setError, clearError, formState } = useForm<
    PortfolioModellingTableFormValues
  >({ defaultValues })
  const { dirty, isSubmitting } = formState

  const handleResetForm = () => {
    reset(defaultValues)
    setQuantityChange(
      assets?.reduce((acc, { ticker }) => {
        acc[ticker] = 0
        return acc
      }, {})
    )
  }

  const handleChange = (value, asset: Asset, fieldName) => {
    const { ticker, marketValue, lastPrice, netQuantity } = asset

    // To prevent a cycle of 'setValue'
    if (typeof value === 'number') {
      // Reset 'formError' error if there's any
      if (errors.formError) clearError('formError')

      // Reset the other field to make sure user only using 1 input field at a time for each asset
      const fieldToReset = fieldName === 'newMarketValue' ? 'newWeight' : 'newMarketValue'
      setValue(`${ticker}.${fieldToReset}`, undefined)

      const newMarketValue = fieldName === 'newMarketValue' ? value : getNewMarketValue(value, marketValue, nav)
      // TODO: Confirm whether allow oversell and overbuy or undersell and underbuy
      const nextQuantityChange = Math.round(newMarketValue / lastPrice) - netQuantity
      setQuantityChange((prevQuantityChange) => ({
        ...prevQuantityChange,
        [ticker]: nextQuantityChange,
      }))
    }

    return value
  }

  // Reset Form and local state 'quantityChange' when 'assets' loaded
  useEffect(() => {
    handleResetForm()
  }, [loading, assets])

  // CONFIRMATION DIALOG SERVICE
  const [confirmationState, setConfirmationState] = useState<ConfirmationOptions | null>(null)

  const resolver = useRef<{
    resolve: () => void
    reject: () => void
  }>()

  const handleShowConfirmation = (options: ConfirmationOptions) => {
    setConfirmationState(options)
    return new Promise<void>((resolve, reject) => {
      resolver.current = { resolve, reject }
    })
  }

  const handleDialogClose = () => {
    if (confirmationState.catchOnCancel && resolver.current) {
      resolver.current.reject()
    }

    setConfirmationState(null)
  }

  const handleDialogSubmit = () => {
    if (resolver.current) {
      resolver.current.resolve()
    }

    setConfirmationState(null)
  }

  const getPortfolioInput = (
    values: PortfolioModellingTableFormValues[],
    portfolioInput,
    errors,
    typeOfTrade: TradeTypeEnum
  ) => {
    const currentTime = new Date().toISOString()

    if (errors.length > 0) return portfolioInput

    return addTypename(
      Object.entries(values).reduce((acc, [ticker, value]) => {
        // Skip if there is an error
        if (errors.length > 0) return acc

        const tradeType = quantityChange[ticker] < 0 ? TradeTypeEnum.SELL : TradeTypeEnum.BUY

        // Skip if tradeType for this asset doesn't match the requested type of trade
        if (tradeType !== typeOfTrade) return acc

        const { newWeight, newMarketValue } = value as PortfolioModellingTableFormValues

        // Find asset index
        const assetIndex = assets?.findIndex(({ ticker: currentTicker }) => ticker === currentTicker)
        const { title, netPrice, netQuantity, trades, lastPrice: price } = assets[assetIndex]

        const quantity =
          typeof newWeight !== 'number' && typeof newMarketValue !== 'number' ? 0 : Math.abs(quantityChange[ticker])

        // Skip if no quantity change
        if (!quantity) return acc

        // Set Error if the asset quantity to sell exceeds the quantity the user currently has for that asset
        if (tradeType === TradeTypeEnum.SELL && quantity > netQuantity) {
          errors.push({
            name: 'formError',
            type: 'limitExceeded',
            message: `Currently, there is not enough ${ticker} asset to sell on the portfolio.`,
          })
          if (errors.length) setError(errors)

          return acc
        }

        // Update Cash
        const tradeValue = round(quantity * price, 2)
        const nextCash = round(tradeType === TradeTypeEnum.BUY ? acc.cash - tradeValue : acc.cash + tradeValue, 2)

        // Update Cash Records
        const newCashRecord = addTypename(
          {
            createdAt: currentTime,
            type: tradeType,
            asset: {
              id: nanoid(),
              title,
              ticker,
            },
            value: tradeValue,
          },
          'CashRecordType'
        )
        const nextCashRecords = acc.cashRecords.concat(newCashRecord)

        // Create new Trade
        const nextTrade = addTypename(
          {
            id: nanoid(),
            createdAt: currentTime,
            updatedAt: currentTime,
            tradedAt: currentTime,

            price,
            quantity,
            type: tradeType,
          },
          'TradeType'
        )

        // Recalculate netQuantity and netPrice
        const newNetQuantity = tradeType === TradeTypeEnum.BUY ? netQuantity + quantity : netQuantity - quantity

        // TODO: Confirm with Joel on how this should be calculated for selling assets
        const newNetPrice = round((netPrice * netQuantity + price * quantity) / newNetQuantity, 2)

        // Find the asset in 'acc'
        const foundAsset = acc.assets[assetIndex]

        // Update the asset of the found index
        acc.assets[assetIndex] = {
          ...foundAsset,
          netPrice: newNetPrice,
          netQuantity: newNetQuantity,
          trades: (trades || []).concat(nextTrade),
        }

        return {
          ...acc,
          cash: nextCash,
          cashRecords: nextCashRecords,
        }
      }, portfolioInput),
      'UpdatePortfolioInput'
    )
  }

  const onSubmit = async (values) => {
    if (!dirty) return

    const { id, assets, cash, cashRecords } = portfolio
    const initialPortfolioInput = {
      id,
      assets: [...assets],
      cash,
      cashRecords: [...cashRecords],
    }

    const errors = []

    // SELL ASSETS
    const portfolioInputAfterSell = getPortfolioInput(values, initialPortfolioInput, errors, TradeTypeEnum.SELL)

    if (errors.length > 0) return

    // BUY ASSETS
    const portfolioInputAfterBuy = getPortfolioInput(values, portfolioInputAfterSell, errors, TradeTypeEnum.BUY)

    try {
      // Set Warning if cash balance becomes negative after buying assets
      if (portfolioInputAfterBuy.cash < 0) {
        await handleShowConfirmation({
          variant: 'danger',
          catchOnCancel: true,
          title: 'Insufficient Balance',
          description:
            'You are about to have a negative cash balance in your portfolio. Please click continue to proceed.',
        })
      }
    } catch (error) {
      errors.push({
        name: 'formError',
        type: 'limitExceeded',
        message: `Transaction is cancelled due to insufficient balance.`,
      })

      if (errors.length) {
        handleResetForm()
        setError(errors)
      }

      return
    }

    if (errors.length > 0) return

    // Remove portfolio asset with 0 quantity
    const filteredAssets = portfolioInputAfterBuy.assets.filter(({ netQuantity }) => netQuantity > 0)
    portfolioInputAfterBuy.assets = filteredAssets

    // Update Portfolio
    await handleUpdatePortfolio(portfolioInputAfterBuy)
    setIsOpenSnackbar(true)
    handleResetForm()
  }

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <CircularLoader loading={loading || isSubmitting}>
        <Paper elevation={0}>
          <Toolbar disableGutters className={classes.toolbar}>
            <Typography variant="h5">Portfolio</Typography>
            <Box>
              <AssetAddModal portfolio={portfolio} />
            </Box>
          </Toolbar>
          <TableContainer
            className={classes.tableContainer}
            onScroll={handleScroll(totalRowRef)}
            ref={portfolioTableRef}
          >
            <Table className={classes.tableRoot} stickyHeader>
              {/* Header */}
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Beta</TableCell>
                  <TableCell>Strategy</TableCell>
                  <TableCell>Sector</TableCell>
                  <TableCell align="right">LastPrice</TableCell>
                  <TableCell align="right" className={classes.currencyCell}>
                    Market Value
                  </TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="center">New Weight (%)</TableCell>
                  <TableCell align="center">New Market Value ($)</TableCell>
                </TableRow>
              </TableHead>

              {/* Body */}
              <TableBody>
                {assets?.map((asset, i) => {
                  const {
                    title,
                    ticker,
                    sector,
                    subSector,
                    netQuantity,
                    lastPrice,
                    marketValue,
                    weight,
                    beta,
                    weightedBeta,
                    strategy,
                    subStrategy,
                  } = asset

                  return (
                    <TableRow className={classes.tableRowWrapper} key={`${ticker}-${i}`}>
                      <TableCell>
                        <div>{title}</div>
                        <div>{ticker}</div>
                      </TableCell>
                      <TableCell>
                        <div>{beta}</div>
                        <div>{weightedBeta?.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <div>{strategy}</div>
                        <div>{subStrategy}</div>
                      </TableCell>
                      <TableCell>
                        <div>{startCase(lowerCase(sector?.replace('_', ' ')))}</div>
                        <div>{subSector}</div>
                      </TableCell>
                      <TableCell align="right">
                        <div>{lastPrice}</div>
                        <div>{baseCurrency}</div>
                      </TableCell>
                      <TableCell align="right" className={classes.currencyCell}>
                        <div>{printCurrency({ amount: marketValue })}</div>
                        <div>{printPercentage(weight)}</div>
                      </TableCell>
                      <TableCell align="right">
                        <div>{netQuantity}</div>
                        {quantityChange[ticker] ? <HighlightNumber value={quantityChange[ticker]} hasPlusSign /> : '-'}
                      </TableCell>
                      <Controller
                        name={`${ticker}.newWeight`}
                        control={control}
                        as={HighlightNumberField}
                        isNumericString
                        suffix="%"
                        className={classes.inputCell}
                        threshold={weight}
                        align="center"
                        onChange={([val]) => handleChange(val, asset, 'newWeight')}
                        autoComplete="off"
                      />
                      <Controller
                        name={`${ticker}.newMarketValue`}
                        control={control}
                        as={HighlightNumberField}
                        decimalScale={2}
                        fixedDecimalScale
                        thousandSeparator
                        prefix="$"
                        className={classes.inputCell}
                        threshold={marketValue}
                        align="center"
                        onChange={([val]) => handleChange(val, asset, 'newMarketValue')}
                        autoComplete="off"
                      />
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
                  <TableCell>
                    <div>Cash</div>
                    <div>Cash</div>
                  </TableCell>
                  <TableCell align="right">{baseCurrency}</TableCell>
                  <TableCell align="right" className={classes.currencyCell}>
                    <div>{printCurrency({ amount: totalCashValue })}</div>
                    <HighlightPercentTrend percentValue={totalCashValuePercent} />
                  </TableCell>
                  <TableCell colSpan={1} />
                  <TableCell colSpan={2}>
                    <ErrorMessage errors={errors} name="formError">
                      {({ message }) => (
                        <Typography color="error" className={classes.errorText}>
                          {message}
                        </Typography>
                      )}
                    </ErrorMessage>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals */}
          <TableContainer onScroll={handleScroll(portfolioTableRef)} ref={totalRowRef}>
            <Table className={classes.tableRoot}>
              <TableRow className={clsx(classes.tableRowWrapper, classes.lastRowWrapper)}>
                <TableCell className={classes.totalCell}>Total</TableCell>
                <TableCell>{avgBeta?.toFixed(2)}</TableCell>
                <TableCell className={classes.lastRowSpacing} colSpan={3} />
                <TableCell align="right" className={classes.lastRowCurrencyCell}>
                  {printCurrency({ amount: nav })}
                </TableCell>
                <TableCell align="right" colSpan={3} className={classes.actionCell}>
                  {dirty && (
                    <>
                      <Button onClick={handleResetForm} disabled={isSubmitting}>
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutlineOutlinedIcon />}
                        disabled={isSubmitting}
                        className={classes.saveChangesButton}
                      >
                        Save Changes
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>
        </Paper>
      </CircularLoader>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        className={classes.snackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Changes saved successfully!
        </Alert>
      </Snackbar>
      <ConfirmationDialog
        open={Boolean(confirmationState)}
        onSubmit={handleDialogSubmit}
        onClose={handleDialogClose}
        {...confirmationState}
      />
    </form>
  )
}

export default PortfolioModellingTable
