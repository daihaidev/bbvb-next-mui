import React from 'react'
import Router from 'next/router'
import * as yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { ArrayField, TextField, MoneyField } from '@onextech/gvs-kit/core'
import { Button, Divider, Grid, Typography, Theme } from '@material-ui/core'
import AssetField from '../../views/Asset/AssetField'
import { AssetInterface } from '../../graphql/asset/typing'
import BenchmarkField from '../../views/Benchmark/BenchmarkField'
import { BenchmarkInterface } from '../../graphql/benchmark/typing'

interface PortfolioFormProps {
  record: PortfolioFormValues
  onSuccess?: (values: PortfolioFormValues) => void
}

interface Asset {
  asset: AssetInterface
  price?: number
  quantity?: number
  tradedAt?: string
}

export interface PortfolioFormValues {
  baseBenchmark: BenchmarkInterface
  assets: Asset[]
}

const PortfolioFormSchema = yup.object().shape({
  baseBenchmark: yup.object().shape({
    id: yup.string(),
    title: yup.string(),
  }),
  assets: yup.array().of(
    yup.object().shape({
      asset: yup.object().required('Asset is required'),
      price: yup.number().required('Price is required'),
      quantity: yup.number().required('Quantity is required'),
      tradedAt: yup.string().required('Date & time is required'),
    })
  ),
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
  arrayField: {
    '& li:not(:only-child):not(:last-child)': {
      marginBottom: theme.spacing(1.5),
    },
  },
  input: {
    '& > .MuiOutlinedInput-input': {
      fontSize: theme.typography.pxToRem(16),
    },
  },
  divider: {
    margin: theme.spacing(1, 0, 3),
  },
  submitButton: {
    fontSize: theme.typography.pxToRem(12),
    textTransform: 'uppercase',
    padding: theme.spacing(1, 0),
  },
  errorText: {
    color: theme.palette.error.main,
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
  label: {
    backgroundColor: theme.palette.background.paper,
    paddingRight: theme.spacing(0.75),
  },
}))

const PortfolioForm: React.FC<PortfolioFormProps> = (props) => {
  const { record, onSuccess } = props
  const classes = useStyles()

  const { control, handleSubmit, errors, reset } = useForm<PortfolioFormValues>({
    defaultValues: record,
    validationSchema: PortfolioFormSchema,
  })

  const assetsFieldArray = useFieldArray({ name: 'assets', control })

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
      {/* Portfolio Benchmark */}
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

      <ArrayField className={classes.arrayField} hideLabel name="assets" fieldArray={assetsFieldArray}>
        {({ index, name }) => {
          return (
            <Grid container spacing={1}>
              <Grid item xs={8} sm={4}>
                <Controller
                  as={AssetField}
                  control={control}
                  name={`${name}[${index}].asset`}
                  label="Asset"
                  TextFieldProps={{
                    name: `${name}[${index}].asset`,
                    InputLabelProps: { shrink: true, classes: { root: classes.label } },
                    className: classes.customField,
                  }}
                  ListboxProps={{ className: classes.listbox }}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <Controller
                  as={MoneyField}
                  control={control}
                  name={`${name}[${index}].price`}
                  inputProps={{ prefix: '' }}
                  className={classes.customField}
                  InputLabelProps={{ shrink: true, classes: { root: classes.label } }}
                />
              </Grid>
              <Grid item xs={3} sm={2}>
                <Controller
                  as={TextField}
                  control={control}
                  name={`${name}[${index}].quantity`}
                  label="Qty"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ className: classes.input }}
                />
              </Grid>
              <Grid item xs={9} sm={4}>
                <Controller
                  as={TextField}
                  control={control}
                  name={`${name}[${index}].tradedAt`}
                  label="Trade At"
                  type="datetime-local"
                  InputProps={{ className: classes.input }}
                />
              </Grid>
            </Grid>
          )
        }}
      </ArrayField>
      {Boolean(errors.assets) && (
        <Typography className={classes.errorText} variant="subtitle1">
          Fill in all fields
        </Typography>
      )}

      <Divider className={classes.divider} />

      <Button className={classes.submitButton} variant="contained" color="primary" type="submit" fullWidth>
        Next
      </Button>
    </form>
  )
}

export default PortfolioForm
