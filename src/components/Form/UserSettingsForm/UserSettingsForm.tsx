import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { Box, Grid, Typography, Theme, Button, Snackbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { TextField } from '@onextech/gvs-kit/core'
import { BenchmarkTypeInput, InvestmentExperienceEnum } from '@onextech/btb-api'
import { Alert } from '@material-ui/lab'
import DateField from '../../DateField'
import Form from '../index'
import {
  INVESTMENT_EXPERIENCE_OPTIONS,
  TRADING_PLATFORM_OPTIONS,
  CURRENCY_OPTIONS,
} from '../../OnboardingModal/constants'
import { useAuth } from '../../../auth'
import ReferralMethodField from '../../../views/User/ReferralMethodField'
import BenchmarkField from '../../../views/Benchmark/BenchmarkField'
import { useUpdatePortfolio } from '../../../graphql/portfolio/mutations'
import { UserInterface } from '../../../graphql/user'

interface UserSettingsFormProps extends React.ComponentProps<typeof Form> {
  onSuccess?: () => void
}

interface UserSettingsFormValues extends Omit<UserInterface, 'dob'> {
  name: string
  email: string
  investmentExperience: InvestmentExperienceEnum
  tradingPlatform: string
  dob: string | Date
  acquisitionChannels: string[]
  baseCurrency: string
  baseBenchmark: BenchmarkTypeInput
}

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(3, 0),
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(3),
    },
    boxShadow: '0 1px 3px 0 rgba(63, 63, 68, 0.15), 0 0 0 1px rgba(63, 63, 68, 0.05)',
  },
  input: {
    '& > .MuiOutlinedInput-input': {
      fontSize: theme.typography.pxToRem(16),
    },
  },
  customField: {
    '& > .MuiInputBase-root': {
      fontSize: theme.typography.pxToRem(16),
    },
  },
  listbox: {
    padding: 0,
    '& .MuiAutocomplete-option': {
      fontSize: theme.typography.pxToRem(16),
    },
  },
  submitButton: {
    fontSize: theme.typography.pxToRem(12),
    textTransform: 'uppercase',
    backgroundColor: theme.palette.success.dark,
    color: theme.palette.success.contrastText,
    alignSelf: 'flex-start',
    display: 'flex',
  },
  contentContainer: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      marginBottom: theme.spacing(2.5),
    },
  },
  headerContainer: {
    borderBottom: `1px solid ${theme.palette.border.secondary}`,
  },
  twoContainer: {
    [theme.breakpoints.down('sm')]: {
      '& > *': {
        paddingRight: theme.spacing(0),
      },
      '& > :not(:first-child)': {
        marginTop: theme.spacing(3),
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > :first-child': {
        paddingRight: theme.spacing(3),
      },
      '& > :not(:first-child)': {
        marginTop: 0,
      },
    },
  },
  title: {
    fontSize: theme.typography.pxToRem(16),
  },
  desc: {
    fontSize: theme.typography.pxToRem(14),
  },
  errorText: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 400,
    color: theme.palette.error.main,
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
  label: {
    backgroundColor: theme.palette.background.paper,
    paddingRight: theme.spacing(0.75),
  },
}))

const UserSettingsFormSchema = yup.object().shape({
  name: yup.string().required('This field is required.'),
  email: yup
    .string()
    .email('Please enter a valid email.')
    .required('This field is required.'),
  investmentExperience: yup.string(),
  tradingPlatform: yup.string(),
  dob: yup
    .date()
    .typeError('Please input a date.')
    .max(new Date(), 'Invalid date.'),
  acquisitionChannels: yup.array().of(yup.string()),
  baseCurrency: yup.string(),
  baseBenchmark: yup.object().shape({
    benchmarkID: yup.string(),
    title: yup.string(),
  }),
})

const UserSettingsForm: React.FC<UserSettingsFormProps> = (props) => {
  const classes = useStyles(props)
  const { onSuccess } = props

  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false)
  const handleCloseSnackbar = () => setIsOpenSnackbar(false)

  const { user, updateUser } = useAuth()
  const [portfolio] = user?.portfolios?.items || []
  const { baseCurrency, baseBenchmark } = portfolio || {}

  const { handleUpdatePortfolio } = useUpdatePortfolio()

  const defaultValues = {
    ...user,
    baseCurrency,
    baseBenchmark,
  }

  const form = useForm<UserSettingsFormValues>({ defaultValues, validationSchema: UserSettingsFormSchema })
  const { control, handleSubmit, errors, reset, formState } = form
  const { isSubmitting, dirty } = formState

  // Load destructured default values when ready
  useEffect(() => {
    reset(defaultValues)
  }, [user])

  const onSubmit = async (values) => {
    if (!dirty) return onSuccess?.()

    const { baseCurrency, baseBenchmark, dob, ...rest } = values
    const { benchmarkID, title } = baseBenchmark || {}

    const nextUser = {
      ...rest,
      dob: dob.toISOString(),
    }

    const nextPortfolio = {
      id: portfolio.id,
      baseCurrency,
      baseBenchmark: {
        benchmarkID,
        title,
      },
    }

    await handleUpdatePortfolio(nextPortfolio)
    await updateUser(nextUser)

    setIsOpenSnackbar(true)
    if (onSuccess) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Box display="flex" alignItems="center" py={2} px={3} className={classes.headerContainer}>
        <Box mr={1}>
          <Typography className={classes.title}>Profile</Typography>
        </Box>
        <Typography color="textSecondary" className={classes.desc}>
          Manage your profile settings
        </Typography>
      </Box>

      {/* User Settings */}
      <Box className={classes.contentContainer}>
        <Controller
          as={TextField}
          control={control}
          name="name"
          placeholder="Full Name"
          error={Boolean(errors.name)}
          InputProps={{ className: classes.input }}
          helperText={<Typography className={classes.errorText}>{errors.name?.message}</Typography>}
        />

        <Grid container className={classes.twoContainer}>
          <Grid item xs={12} md={6}>
            <Controller
              as={TextField}
              control={control}
              name="email"
              error={Boolean(errors.email)}
              InputProps={{ className: classes.input }}
              helperText={<Typography className={classes.errorText}>{errors.email?.message}</Typography>}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              as={DateField}
              control={control}
              name="dob"
              label="Date of Birth"
              placeholder="Date of Birth"
              disableFuture
              error={Boolean(errors.dob)}
              InputProps={{ className: classes.input }}
              InputLabelProps={{ shrink: true }}
              helperText={<Typography className={classes.errorText}>{errors.dob?.message}</Typography>}
            />
          </Grid>
        </Grid>
        <Grid container className={classes.twoContainer}>
          <Grid item xs={12} md={6}>
            <Controller
              as={TextField}
              control={control}
              options={INVESTMENT_EXPERIENCE_OPTIONS}
              name="investmentExperience"
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              as={TextField}
              control={control}
              options={TRADING_PLATFORM_OPTIONS}
              name="tradingPlatform"
              label="Current Broker/Trading Platform"
              InputProps={{ className: classes.input }}
            />
          </Grid>
        </Grid>

        <Controller
          as={ReferralMethodField}
          control={control}
          name="acquisitionChannels"
          label="How did you hear about BetaBlocks?"
          placeholder="Select one or more..."
          TextFieldProps={{
            name: 'baseBenacquisitionChannelschmark',
            InputLabelProps: { shrink: true, classes: { root: classes.label } },
            className: classes.customField,
          }}
          ListboxProps={{ className: classes.listbox }}
        />
      </Box>

      {/* Portfolio Settings */}
      <Box display="flex" alignItems="center" py={2} px={3} className={classes.headerContainer}>
        <Box mr={1}>
          <Typography className={classes.title}>Portfolio</Typography>
        </Box>
        <Typography color="textSecondary" className={classes.desc}>
          Manage your portfolio settings
        </Typography>
      </Box>
      <Box className={classes.contentContainer}>
        <Controller
          as={TextField}
          control={control}
          options={CURRENCY_OPTIONS}
          name="baseCurrency"
          label="Currency"
          InputProps={{ className: classes.input }}
        />
        <Controller
          as={BenchmarkField}
          control={control}
          name="baseBenchmark"
          placeholder="Portfolio Benchmark"
          TextFieldProps={{
            name: 'baseBenchmark',
            InputLabelProps: { shrink: true, classes: { root: classes.label } },
            className: classes.customField,
          }}
        />
        <Box px={3} py={1} clone>
          <Button className={classes.submitButton} variant="contained" type="submit" disabled={isSubmitting}>
            Save Changes
          </Button>
        </Box>
      </Box>
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
          Profile successfully updated!
        </Alert>
      </Snackbar>
    </form>
  )
}

export default UserSettingsForm
