import React, { useState, useRef } from 'react'
import { Controller, useForm, ErrorMessage } from 'react-hook-form'
import { Typography, Grid, Button, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, MoneyField } from '@onextech/gvs-kit/core'
import nanoid from 'nanoid'
import { TradeTypeEnum, UpdatePortfolioInput } from '@onextech/btb-api'
import { omitTypename, addTypename } from '@onextech/gvs-kit/utils'
import * as colors from '@material-ui/core/colors'
import * as yup from 'yup'
import { round } from 'lodash'
import AssetField from './AssetField'
import { PortfolioInterface } from '../../graphql/portfolio/typings'
import useUpdatePortfolio from '../../graphql/portfolio/mutations/useUpdatePortfolio'
import { AssetInterface } from '../../graphql/asset/typing'
import { ConfirmationOptions } from '../PortfolioBuilder/ConfirmationDialog'

interface AssetFormValues {
  asset: AssetInterface
  price: number
  quantity: number
  tradedAt: string
  formSubmit?: string
}

const AssetFormSchema = yup.object().shape({
  asset: yup.object().required('Asset is required.'),
  price: yup
    .number()
    .typeError('Please put a number.')
    .min(1, 'Price must be higher than 0.')
    .required('Price is required.'),
  quantity: yup
    .number()
    .typeError('Please put a number.')
    .min(1, 'Quantity must be higher than 0.')
    .required('Quantity is required.'),
  tradedAt: yup.date().required('Trade Date & Time is required.'),
})

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5.5, 3.625, 6.25),
  },
  textField: {
    '& > .MuiInputBase-root': {
      fontSize: theme.typography.pxToRem(16),
    },
  },
  errorText: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 400,
    textTransform: 'none',
  },
  listbox: {
    padding: 0,
    '& .MuiAutocomplete-option': {
      fontSize: theme.typography.pxToRem(16),
    },
  },
  buyButton: {
    backgroundColor: colors.green['A700'],
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: colors.green['A700'],
      opacity: 0.9,
    },
  },
  sellButton: {
    backgroundColor: colors.red[500],
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: colors.red[500],
      opacity: 0.9,
    },
  },
  fieldsWrapper: {
    marginTop: theme.spacing(5.25),
  },
  buttonWrapper: {
    marginTop: theme.spacing(5),
  },
}))

interface AssetFormProps {
  onSubmit: () => void
  portfolio: PortfolioInterface
}

const AssetForm: React.FC<AssetFormProps> = (props) => {
  const classes = useStyles()
  const { onSubmit, portfolio } = props

  // Init form
  const form = useForm<AssetFormValues>({ validationSchema: AssetFormSchema })
  const { handleSubmit, control, errors, setError, clearError, formState } = form
  const { isSubmitting } = formState

  // Hooks
  const { handleUpdatePortfolio } = useUpdatePortfolio()

  // CONFIRMATION DIALOG SERVICE
  const [confirmationState, setConfirmationState] = useState<ConfirmationOptions | null>(null)

  const resolver = useRef<{
    resolve: () => void
    reject: () => void
  }>()

  const handleShowConfirmation = (options: ConfirmationOptions) => {
    setConfirmationState(options)

    setError([
      {
        name: 'formSubmit',
        type: 'limitExceeded',
        message: 'You are about to have a negative cash balance in your portfolio. Please click continue to proceed.',
      },
    ])

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

  // Submit form
  const beforeSubmit = (onSubmit) => async (values, tradeType) => {
    const currentTime = new Date().toISOString()
    const portfolioID = portfolio.id
    const errors = []

    const { asset, ...rest } = values
    const { quantity, price, tradedAt: tradedDate } = rest
    const tradedAt = tradedDate.toISOString()

    // Find asset index
    const assetIndex = portfolio?.assets?.findIndex(({ assetID }) => assetID === asset?.id)
    const isNewAsset = !portfolio?.assets || assetIndex < 0

    if (tradeType === TradeTypeEnum.SELL) {
      // Set Error if trying to sell assets which are not on the portfolio
      if (isNewAsset) {
        errors.push({
          name: 'asset',
          type: 'assetNotFound',
          message: `Unable to sell assets which are not on the portfolio.`,
        })
        if (errors.length) return setError(errors)
      }

      // Set Error if the asset quantity to sell exceeds the quantity the user currently has for that asset
      const { netQuantity } = portfolio?.assets?.[assetIndex]
      if (quantity > netQuantity) {
        errors.push({
          name: 'quantity',
          type: 'limitExceeded',
          message: `Only have ${netQuantity} quantity to sell.`,
        })
        if (errors.length) return setError(errors)
      }
    }

    // Update Cash
    const tradeValue = round(quantity * price, 2)
    const nextCash = round(
      tradeType === TradeTypeEnum.BUY ? (portfolio?.cash || 0) - tradeValue : (portfolio?.cash || 0) + tradeValue,
      2
    )

    try {
      // Set Warning if cash balance becomes negative after buying assets
      if (tradeType === TradeTypeEnum.BUY && nextCash < 0) {
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
        name: 'formSubmit',
        type: 'limitExceeded',
        message: `Transaction is cancelled due to insufficient balance.`,
      })

      if (errors.length) {
        setError(errors)
      }

      return
    }

    const newCashRecord = addTypename(
      {
        createdAt: currentTime,
        type: tradeType,
        asset: {
          id: nanoid(),
          title: asset.title,
          ticker: asset.ticker,
        },
        value: tradeValue,
      },
      'CashRecordType'
    )
    const nextCashRecords = (portfolio?.cashRecords || []).concat(newCashRecord)

    // Create new Trade
    const nextTrade = addTypename(
      {
        ...rest,
        id: nanoid(),
        createdAt: currentTime,
        updatedAt: currentTime,
        tradedAt,

        type: tradeType,
      },
      'TradeType'
    )

    if (isNewAsset) {
      const { id: assetID, title, ticker, sector, subSector, beta, divYld, strategy, subStrategy } = asset

      // Create new asset
      const newAsset = addTypename(
        {
          id: nanoid(),
          assetID,
          title,
          ticker,
          sector,
          subSector,
          strategy,
          subStrategy,
          netPrice: rest.price,
          netQuantity: rest.quantity,
          trades: [nextTrade],
          beta,
          divYld,
        },
        'AssetType'
      )

      // Update portfolio.assets
      const nextValues: UpdatePortfolioInput = omitTypename({
        id: portfolioID,
        assets: (portfolio?.assets || []).concat(newAsset),
        cash: nextCash,
        cashRecords: nextCashRecords,
      })

      await handleUpdatePortfolio(nextValues)

      return onSubmit(values)
    }

    // If already exist in the portfolio, find the asset
    const foundAsset = portfolio?.assets?.[assetIndex]
    const { netPrice, netQuantity, trades } = foundAsset || {}

    // Recalculate netQuantity and netPrice
    const newNetQuantity = tradeType === TradeTypeEnum.BUY ? netQuantity + quantity : netQuantity - quantity

    // TODO: Confirm with Joel on how this should be calculated for selling assets
    const newNetPrice = (netPrice * netQuantity + price * quantity) / newNetQuantity

    // Copy previous assets
    const nextAssets = [...portfolio?.assets]

    // Update the asset of the found index
    nextAssets[assetIndex] = {
      ...foundAsset,
      netPrice: Number(newNetPrice.toFixed(2)),
      netQuantity: newNetQuantity,
      trades: (trades || []).concat(nextTrade),
    }

    // Remove portfolio asset with 0 quantity
    const filteredPortfolioAssets = nextAssets.filter(({ netQuantity }) => netQuantity > 0)

    // Update portfolio.assets
    const nextValues: UpdatePortfolioInput = omitTypename({
      id: portfolioID,
      assets: filteredPortfolioAssets,
      cash: nextCash,
      cashRecords: nextCashRecords,
    })

    await handleUpdatePortfolio(nextValues)

    return onSubmit(values)
  }

  return (
    <form className={classes.root}>
      <Typography variant="h3">Add Trade Entry</Typography>
      <Typography variant="subtitle1">Add a new trade entry for an asset</Typography>
      <Grid container spacing={2} className={classes.fieldsWrapper}>
        <Grid item xs={12}>
          <Controller
            as={AssetField}
            control={control}
            name="asset"
            TextFieldProps={{
              name: 'asset',
              InputLabelProps: { shrink: true },
              className: classes.textField,
              error: Boolean(errors.asset),
            }}
            ListboxProps={{ className: classes.listbox }}
          />
          <ErrorMessage errors={errors} name="asset">
            {({ message }) => (
              <Typography color="error" className={classes.errorText}>
                {message}
              </Typography>
            )}
          </ErrorMessage>
        </Grid>
        <Grid item xs md={7}>
          <Controller
            as={MoneyField}
            control={control}
            name="price"
            className={classes.textField}
            error={Boolean(errors.price)}
            onChange={([val]) => {
              if (errors.formSubmit) clearError('formSubmit')
              return val
            }}
          />
          <ErrorMessage errors={errors} name="price">
            {({ message }) => (
              <Typography color="error" className={classes.errorText}>
                {message}
              </Typography>
            )}
          </ErrorMessage>
        </Grid>
        <Grid item xs md={5}>
          <Controller
            as={TextField}
            control={control}
            name="quantity"
            type="number"
            className={classes.textField}
            error={Boolean(errors.quantity)}
            onChange={([e]) => {
              if (errors.formSubmit) clearError('formSubmit')
              return e.target.value
            }}
          />
          <ErrorMessage errors={errors} name="quantity">
            {({ message }) => (
              <Typography color="error" className={classes.errorText}>
                {message}
              </Typography>
            )}
          </ErrorMessage>
        </Grid>
        <Grid item xs={12}>
          <Controller
            as={TextField}
            control={control}
            name="tradedAt"
            label="Trade Date & Time"
            type="datetime-local"
            className={classes.textField}
            error={Boolean(errors.tradedAt)}
          />
          <ErrorMessage errors={errors} name="tradedAt">
            {({ message }) => (
              <Typography color="error" className={classes.errorText}>
                {message}
              </Typography>
            )}
          </ErrorMessage>
        </Grid>
        <Grid item xs={12}>
          <ErrorMessage errors={errors} name="formSubmit">
            {({ message }) => (
              <Box clone textAlign="center">
                <Typography color="error" className={classes.errorText}>
                  {message}
                </Typography>
              </Box>
            )}
          </ErrorMessage>
        </Grid>

        {/* Buttons */}
        {!confirmationState ? (
          <>
            <Grid item xs={6} className={classes.buttonWrapper}>
              <Button
                onClick={handleSubmit((values) => beforeSubmit(onSubmit)(values, TradeTypeEnum.SELL))}
                size="large"
                fullWidth
                variant="contained"
                className={classes.sellButton}
                disabled={isSubmitting}
              >
                Sell
              </Button>
            </Grid>
            <Grid item xs={6} className={classes.buttonWrapper}>
              <Button
                onClick={handleSubmit((values) => beforeSubmit(onSubmit)(values, TradeTypeEnum.BUY))}
                size="large"
                fullWidth
                variant="contained"
                className={classes.buyButton}
                disabled={isSubmitting}
              >
                Buy
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={6} className={classes.buttonWrapper}>
              <Button onClick={handleDialogClose} size="large" fullWidth autoFocus>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6} className={classes.buttonWrapper}>
              <Button onClick={handleDialogSubmit} color="primary" variant="contained" size="large" fullWidth>
                Continue
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </form>
  )
}

export default AssetForm
