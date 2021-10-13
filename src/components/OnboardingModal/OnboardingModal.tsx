import React, { useState } from 'react'
import Router from 'next/router'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { Box, Button, Typography } from '@material-ui/core'
import nanoid from 'nanoid'
import { TradeTypeEnum, CashRecordTypeEnum, InvestmentExperienceEnum } from '@onextech/btb-api'
import { sortBy, round } from 'lodash'
import PortalModal from '../PortalModal'
import UserDetailsForm, { UserDetailsFormValues } from './UserDetailsForm'
import CashForm, { CashFormValues } from './CashForm'
import PortfolioForm, { PortfolioFormValues } from './PortfolioForm'
import { ONBOARDING_STEPS, TRADING_PLATFORM_OPTIONS, CURRENCY_OPTIONS } from './constants'
import { useCreatePortfolio } from '../../graphql/portfolio/mutations'
import { useAuth } from '../../auth'

type OnboardingModalProps = React.ComponentProps<typeof PortalModal>

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3, 2),
  },
  header: {
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: theme.spacing(1.25),
  },
  subHeader: {
    color: theme.palette.text.hint,
    textAlign: 'center',
    marginBottom: theme.spacing(6),
  },
  backButton: {
    padding: theme.spacing(1.5),
    color: theme.palette.secondary.dark,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.main,
    },
  },
}))

const defaultUserDefails = {
  name: '',
  investmentExperience: InvestmentExperienceEnum.none,
  tradingPlatform: TRADING_PLATFORM_OPTIONS[0],
  dob: new Date(new Date().setHours(0, 0, 0, 0)),
  acquisitionChannels: [],
}

const defaultCashForm = {
  baseCurrency: CURRENCY_OPTIONS[0],
  cash: null,
}

const defaultPorfolioForm = {
  baseBenchmark: null,
  assets: [],
}

const OnboardingModal: React.FC<OnboardingModalProps> = (props) => {
  const classes = useStyles()
  const { close } = props

  // Hooks
  const { user, updateUser } = useAuth()
  const { handleCreatePortfolio } = useCreatePortfolio()

  const [step, setStep] = useState(ONBOARDING_STEPS.GET_STARTED)
  const [formValues, setFormValues] = useState({
    userDetails: defaultUserDefails,
    cashForm: defaultCashForm,
    portfolioForm: defaultPorfolioForm,
  })

  const handleUserDetailsFormSubmit = (values: UserDetailsFormValues) => {
    setFormValues({
      ...formValues,
      userDetails: values,
    })
    setStep(ONBOARDING_STEPS.CASH)
  }
  const handleCashFormSubmit = (values: CashFormValues) => {
    setFormValues({
      ...formValues,
      cashForm: values,
    })
    setStep(ONBOARDING_STEPS.PORTFOLIO)
  }
  const handlePortfolioFormSubmit = async (values: PortfolioFormValues) => {
    const userID = user?.id
    if (userID) {
      const currentTime = new Date().toISOString()
      const { userDetails, cashForm } = formValues

      const { baseBenchmark, assets } = values
      const nextAssets = assets.map((item) => {
        const { asset, price, quantity, tradedAt } = item
        const { id: assetID, title, ticker, sector, subSector, beta, divYld, strategy, subStrategy } = asset

        const nextTrade = {
          id: nanoid(),
          createdAt: currentTime,
          updatedAt: currentTime,

          tradedAt: new Date(tradedAt).toISOString(),
          price,
          quantity,
          type: TradeTypeEnum.BUY,
        }

        return {
          id: nanoid(),
          assetID,
          title,
          ticker,
          sector,
          subSector,
          netPrice: price,
          netQuantity: quantity,
          trades: [nextTrade],
          beta,
          divYld,
          strategy,
          subStrategy,
        }
      })

      const { baseCurrency, cash } = cashForm

      const totalMarketValue = round(
        assets.reduce((sum, item) => {
          const { asset, quantity } = item

          // TODO: Confirm with backend whether can assume 'prices' is already sorted, if not might impact performance the longer the prices is
          const prices = sortBy(asset?.prices?.items, ({ createdAt }) => new Date(createdAt))
          const lastPrice = prices[prices.length - 1]?.value || 0
          const nextMarketValue = quantity * lastPrice

          return sum + nextMarketValue
        }, 0),
        2
      )
      const startingNAV = round(cash + totalMarketValue, 2)

      const nextCashRecord = {
        createdAt: currentTime,
        type: CashRecordTypeEnum.TOPUP,
        asset: null,
        value: cash,
      }

      // Create a new Portfolio
      const nextPortfolio = {
        userID,

        assets: nextAssets,
        baseCurrency,
        baseBenchmark: !baseBenchmark
          ? null
          : {
              benchmarkID: baseBenchmark?.id,
              title: baseBenchmark?.title,
            },
        startingNAV,

        cash,
        cashRecords: [nextCashRecord],
      }

      await handleCreatePortfolio(nextPortfolio)

      const nextUser = {
        ...userDetails,
        dob: userDetails.dob.toISOString(),
      }

      // Update User data
      await updateUser({ ...nextUser })
    }

    Router.push('/management/performance')
    close()
  }

  const renderStep = (step) => {
    switch (step) {
      case ONBOARDING_STEPS.GET_STARTED:
        return <UserDetailsForm onSuccess={handleUserDetailsFormSubmit} record={formValues.userDetails} />
      case ONBOARDING_STEPS.CASH:
        return <CashForm onSuccess={handleCashFormSubmit} record={formValues.cashForm} />
      case ONBOARDING_STEPS.PORTFOLIO:
        return <PortfolioForm onSuccess={handlePortfolioFormSubmit} record={formValues.portfolioForm} />
      default:
        return <UserDetailsForm onSuccess={handleUserDetailsFormSubmit} record={formValues.userDetails} />
    }
  }

  const isShowBackButton = step === ONBOARDING_STEPS.CASH || step === ONBOARDING_STEPS.PORTFOLIO

  const handleClickBack = (step) => {
    switch (step) {
      case ONBOARDING_STEPS.CASH:
        return setStep(ONBOARDING_STEPS.GET_STARTED)
      case ONBOARDING_STEPS.PORTFOLIO:
        return setStep(ONBOARDING_STEPS.CASH)
      default:
        setStep(step)
    }
  }

  return (
    <PortalModal width={step === ONBOARDING_STEPS.PORTFOLIO ? 900 : 430} hasCloseBtn={false} {...props}>
      {isShowBackButton && (
        <Button
          className={classes.backButton}
          startIcon={<ChevronLeftIcon />}
          onClick={() => {
            handleClickBack(step)
          }}
        >
          Back
        </Button>
      )}
      <Box className={classes.content}>
        <Typography className={classes.header} variant="h3">
          {step}
        </Typography>
        <Typography className={classes.subHeader} variant="subtitle1">
          {step === ONBOARDING_STEPS.PORTFOLIO
            ? 'Set your portfolio Benchmark'
            : 'BetaBlocks gives you more ways to make your money work harder.'}
        </Typography>
        {renderStep(step)}
      </Box>
    </PortalModal>
  )
}

export default OnboardingModal
