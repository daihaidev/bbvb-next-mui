import React from 'react'
import * as yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import { useForm, ErrorMessage, Controller } from 'react-hook-form'
import { TextField } from '@onextech/gvs-kit/core'
import { Box, Grid, Typography, Theme, Checkbox, Button, FormControlLabel } from '@material-ui/core'

import Router from 'next/router'
import Link from 'next/link'
import routes from '../../routes'
import { useAuth } from '../../auth'

interface RegisterFormProps {
  onRegisterSuccess?: () => void
}

interface RegisterFormValues {
  email: string
  password: string
  isTNC: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(5, 7),
    '& > *': {
      marginBottom: theme.spacing(1),
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0, 7),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(5, 7),
    },
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2.5),
    '& > .MuiOutlinedInput-root': {
      fontSize: theme.typography.pxToRem(16),
    },
    '& > span': {
      fontSize: theme.typography.pxToRem(12),
    },
  },
  input: {
    '& > .MuiOutlinedInput-input': {
      padding: theme.spacing(0.25, 2),
    },
  },
  errorText: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 400,
    color: theme.palette.error.main,
    alignSelf: 'flex-start',
    marginTop: theme.spacing(-2),
  },
  checkbox: {
    marginLeft: 0,
  },
  link: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  button: {
    width: '100%',
    height: 42,
  },
  registerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  separator: {
    borderColor: theme.palette.border.secondary,
    borderTop: '2px solid',
    width: '100%',
    marginBottom: theme.spacing(5),
  },
}))

const MIN_PASSWORD_LENGTH = 8

const registerFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Required.'),
  password: yup
    .string()
    .min(MIN_PASSWORD_LENGTH, `Whoops, looks like your password is too short..`)
    .required('Required.'),
  isTNC: yup.bool().oneOf([true], 'Please check the Terms & Conditions.'),
})

const RegisterForm: React.FC<RegisterFormProps> = (props) => {
  const { onRegisterSuccess } = props
  const classes = useStyles()

  const { control, handleSubmit, errors, setError } = useForm<RegisterFormValues>({
    validationSchema: registerFormSchema,
  })

  const { signUp } = useAuth()

  const onSubmit = async (values) => {
    const { email, password, isTNC } = values
    const errors = []

    if (!isTNC) {
      errors.push({ name: 'isTNC', type: 'required', message: 'Please check the Terms & Conditions.' })
      if (errors.length) return setError(errors)
    }

    const { error } = await signUp({ username: email, password })
    if (!error) {
      if (onRegisterSuccess) onRegisterSuccess()
      else {
        Router.push(routes.GET_STARTED)
      }
    } else {
      // Set Errors
      errors.push({ name: 'email', type: 'authentication', message: error.message })
      if (errors.length) return setError(errors)
    }
  }

  return (
    <div className={classes.root}>
      <Grid item lg={4} md={6} sm={12}>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Typography variant="h3">Get Started</Typography>
            <Typography variant="subtitle2">BetaBlocks gives you more ways to make your money work harder.</Typography>
            <div className={classes.separator} />
            <Controller
              as={TextField}
              control={control}
              name="email"
              variant="outlined"
              placeholder="Email Address"
              error={Boolean(errors.email)}
              className={classes.textField}
            />
            <ErrorMessage errors={errors} name="email">
              {({ message }) => <Typography className={classes.errorText}>{message}</Typography>}
            </ErrorMessage>
            <Controller
              as={TextField}
              control={control}
              id="password"
              name="password"
              type="password"
              variant="outlined"
              placeholder="Password"
              error={Boolean(errors.password)}
              className={classes.textField}
            />
            <ErrorMessage errors={errors} name="password">
              {({ message }) => <Typography className={classes.errorText}>{message}</Typography>}
            </ErrorMessage>
            <FormControlLabel
              control={
                <Controller
                  as={Checkbox}
                  name="isTNC"
                  control={control}
                  color="primary"
                  style={{ paddingLeft: '0' }}
                  onChange={([e]) => e.target.checked}
                />
              }
              label={
                <Typography variant="subtitle1">
                  I have read the <a href="#">Terms & Conditions</a>
                </Typography>
              }
              className={classes.checkbox}
            />
            <ErrorMessage errors={errors} name="isTNC">
              {({ message }) => <Typography className={classes.errorText}>{message}</Typography>}
            </ErrorMessage>
            <Button className={classes.button} variant="contained" color="primary" type="submit">
              SIGN UP
            </Button>
            <Typography variant="subtitle1">
              Have an account? <Link href={routes.LOGIN}>Sign In</Link>
            </Typography>
          </form>
        </Box>
      </Grid>
      <Grid item lg={8} xs={12}>
        <img className={classes.registerImage} src="others/register/register_image.png" alt="Register" />
      </Grid>
    </div>
  )
}

export default RegisterForm
