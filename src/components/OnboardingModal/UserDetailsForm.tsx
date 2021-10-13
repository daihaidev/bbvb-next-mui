import React from 'react'
import Router from 'next/router'
import * as yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import { useForm, Controller, ErrorMessage } from 'react-hook-form'
import { TextField } from '@onextech/gvs-kit/core'
import { Button, Divider, Theme, Typography } from '@material-ui/core'
import { InvestmentExperienceEnum } from '@onextech/btb-api'
import { INVESTMENT_EXPERIENCE_OPTIONS, TRADING_PLATFORM_OPTIONS } from './constants'
import DateField from '../DateField'
import ReferralMethodField from '../../views/User/ReferralMethodField'

interface UserDetailsFormProps {
  record: UserDetailsFormValues
  onSuccess?: (values: UserDetailsFormValues) => void
}

export interface UserDetailsFormValues {
  name: string
  investmentExperience: InvestmentExperienceEnum
  tradingPlatform: string
  dob: Date
  acquisitionChannels: string[]
}

const userDetailsFormSchema = yup.object().shape({
  name: yup.string().required('This field is required'),
  investmentExperience: yup.string(),
  tradingPlatform: yup.string(),
  dob: yup.date().max(new Date(), 'Invalid date'),
  acquisitionChannels: yup.array().of(yup.string()),
})

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      marginBottom: theme.spacing(2.5),
    },
  },
  input: {
    '& > .MuiOutlinedInput-input': {
      fontSize: theme.typography.pxToRem(16),
      minHeight: 22,
    },
  },
  autoCompleteField: {
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
  // TODO: Fix the default typography font-size then replace all ErrorMessage with helperText
  errorText: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 400,
    color: theme.palette.error.main,
    alignSelf: 'flex-start',
    marginTop: theme.spacing(-2),
    marginLeft: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(1, 0, 3),
  },
  submitButton: {
    fontSize: theme.typography.pxToRem(12),
    textTransform: 'uppercase',
    padding: theme.spacing(1, 0),
  },
  label: {
    backgroundColor: theme.palette.background.paper,
    paddingRight: theme.spacing(0.25),
  },
}))

const UserDetailsForm: React.FC<UserDetailsFormProps> = (props) => {
  const { record, onSuccess } = props
  const classes = useStyles()

  const { control, handleSubmit, errors, reset } = useForm<UserDetailsFormValues>({
    defaultValues: record,
    validationSchema: userDetailsFormSchema,
  })

  const onSubmit = async (values) => {
    if (onSuccess) onSuccess(values)
    else {
      Router.push('/')
    }
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
      {/* Full Name */}
      <Controller
        as={TextField}
        control={control}
        name="name"
        label="Full Name"
        placeholder="Full Name"
        InputProps={{ className: classes.input }}
        error={Boolean(errors.name)}
      />
      <ErrorMessage errors={errors} name="name">
        {({ message }) => <Typography className={classes.errorText}>{message}</Typography>}
      </ErrorMessage>

      {/* Investment Experience */}
      <Controller
        as={TextField}
        control={control}
        options={INVESTMENT_EXPERIENCE_OPTIONS}
        name="investmentExperience"
        placeholder="Investment Experience"
        InputProps={{ className: classes.input }}
        error={Boolean(errors.investmentExperience)}
      />
      <ErrorMessage errors={errors} name="investmentExperience">
        {({ message }) => <Typography className={classes.errorText}>{message}</Typography>}
      </ErrorMessage>

      {/* Current Platform */}
      <Controller
        as={TextField}
        control={control}
        options={TRADING_PLATFORM_OPTIONS}
        name="tradingPlatform"
        label="Current Broker/Trading Platform"
        InputProps={{ className: classes.input }}
        error={Boolean(errors.tradingPlatform)}
      />
      <ErrorMessage errors={errors} name="tradingPlatform">
        {({ message }) => <Typography className={classes.errorText}>{message}</Typography>}
      </ErrorMessage>

      {/* Date of Birth */}
      <Controller
        as={DateField}
        control={control}
        name="dob"
        label="Date of Birth"
        InputProps={{ className: classes.input }}
        error={Boolean(errors.dob)}
      />
      <ErrorMessage errors={errors} name="dob">
        {({ message }) => <Typography className={classes.errorText}>{message}</Typography>}
      </ErrorMessage>

      {/* Referral Method */}
      <Controller
        as={ReferralMethodField}
        control={control}
        name="acquisitionChannels"
        label="How did you hear about BetaBlocks?"
        placeholder="Select one or more..."
        error={Boolean(errors.acquisitionChannels)}
        TextFieldProps={{
          name: 'baseBenacquisitionChannelschmark',
          InputLabelProps: { shrink: true, classes: { root: classes.label } },
          className: classes.autoCompleteField,
        }}
        ListboxProps={{ className: classes.listbox }}
      />
      <ErrorMessage errors={errors} name="acquisitionChannels">
        {({ message }) => <Typography className={classes.errorText}>{message}</Typography>}
      </ErrorMessage>

      <Divider className={classes.divider} />

      <Button className={classes.submitButton} variant="contained" color="primary" type="submit" fullWidth>
        Next
      </Button>
    </form>
  )
}

export default UserDetailsForm
