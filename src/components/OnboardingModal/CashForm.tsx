import React from 'react'
import Router from 'next/router'
import * as yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import { useForm, Controller, ErrorMessage } from 'react-hook-form'
import { TextField, MoneyField } from '@onextech/gvs-kit/core'
import { Button, Divider, Grid, Typography, Theme } from '@material-ui/core'
import { CURRENCY_OPTIONS } from './constants'

interface CashFormProps {
  record: CashFormValues
  onSuccess?: (values: CashFormValues) => void
  submitBtnLabel?: string
}

export interface CashFormValues {
  baseCurrency: string
  cash: number
}

const cashFormSchema = yup.object().shape({
  cash: yup
    .number()
    .typeError('Please put a number')
    .min(1, 'Starting cash must be higher than 0')
    .required('Starting cash is required'),
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
    },
  },
  errorText: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 400,
    color: theme.palette.error.main,
    alignSelf: 'flex-start',
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
  customField: {
    '& > .MuiInputBase-root': {
      fontSize: theme.typography.pxToRem(16),
    },
  },
  label: {
    backgroundColor: theme.palette.background.paper,
    paddingRight: theme.spacing(0.75),
  },
}))

const CashForm: React.FC<CashFormProps> = (props) => {
  const { record, onSuccess, submitBtnLabel = 'Next' } = props
  const classes = useStyles()

  const { control, handleSubmit, errors, reset } = useForm<CashFormValues>({
    defaultValues: record,
    validationSchema: cashFormSchema,
  })

  const onSubmit = async (values) => {
    if (onSuccess) {
      await onSuccess(values)
    } else {
      Router.push('/')
    }
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
      <Grid container spacing={1}>
        {/* Currency Options */}
        <Grid item xs={4}>
          <Controller
            as={TextField}
            control={control}
            options={CURRENCY_OPTIONS}
            name="baseCurrency"
            label="Currency"
            InputProps={{ className: classes.input }}
          />
        </Grid>
        <Grid item xs={8}>
          <Controller
            as={MoneyField}
            control={control}
            name="cash"
            placeholder="Cash Amount"
            inputProps={{ prefix: '' }}
            className={classes.customField}
            InputLabelProps={{ shrink: true, classes: { root: classes.label } }}
            error={errors.cash}
          />
          <ErrorMessage errors={errors} name="cash">
            {({ message }) => <Typography className={classes.errorText}>{message}</Typography>}
          </ErrorMessage>
        </Grid>
      </Grid>

      <Divider className={classes.divider} />

      <Button className={classes.submitButton} variant="contained" color="primary" type="submit" fullWidth>
        {submitBtnLabel}
      </Button>
    </form>
  )
}

export default CashForm
