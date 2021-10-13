import React from 'react'
import { Typography } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import RhfForm from '../Form/Rhf/RhfForm'
import RhfTextField from '../Form/Rhf/RhfTextField'
import RhfSubmitButton from '../Form/Rhf/RhfSubmitButton'
import { logEvent } from '../../lib/GoogleAnalytics'
import { useAuth } from '../../auth'

interface LoginFormProps {
  onSubmitted?: (hide?: any) => void
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > :not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
  textField: {
    backgroundColor: '#e7ebf9',
    fontWeight: 600,
    color: theme.palette.primary.light,
    '&:not(.Mui-disabled)': {
      '& input::placeholder': {
        color: theme.palette.primary.light,
        opacity: 1,
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },
  },
  submitButton: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      display: 'block',
    },
  },
  submitButtonTitle: {
    fontWeight: 'bold',
  },
  submitButtonSubtitle: {
    textTransform: 'capitalize',
  },
}))

const LoginForm: React.FC<LoginFormProps> = (props) => {
  const { onSubmitted } = props
  const classes = useStyles({})
  const { signIn } = useAuth()

  const onSubmit = async (data) => {
    const { email, password } = data
    const onSignIn = await signIn({ username: email, password })
    if (onSignIn) {
      const { user } = onSignIn
      if (onSubmitted) onSubmitted(user)
      logEvent({ action: 'login', category: 'acquisition' })
    }
  }

  return (
    <RhfForm className={classes.root} onSubmit={onSubmit}>
      <RhfTextField
        name="email"
        placeholder="Enter your email address"
        label="Email"
        type="email"
        variant="outlined"
        required
        fullWidth
        className={classes.textField}
      />
      <RhfTextField
        name="password"
        placeholder="Create your password"
        label="Password"
        type="password"
        variant="outlined"
        required
        fullWidth
        className={classes.textField}
      />
      <RhfSubmitButton className={classes.submitButton} color="primary" fullWidth>
        <Typography color="inherit" variant="h5" className={classes.submitButtonTitle}>
          Login
        </Typography>
        <Typography color="inherit" className={classes.submitButtonSubtitle}>
          And see your medication
        </Typography>
      </RhfSubmitButton>
    </RhfForm>
  )
}

export default LoginForm
