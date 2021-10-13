import React from 'react'
import { Typography } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import RhfTextField from '../Form/Rhf/RhfTextField'
import RhfSubmitButton from '../Form/Rhf/RhfSubmitButton'
import RhfForm from '../Form/Rhf/RhfForm'
import { logEvent } from '../../lib/GoogleAnalytics'
import { useAuth } from '../../auth'

interface SignupFormProps {
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

const SignupForm: React.FC<SignupFormProps> = (props) => {
  const { onSubmitted } = props
  const classes = useStyles({})
  const { signUp } = useAuth()

  const onSubmit = async (data) => {
    const { email, password } = data
    const onSignUp = await signUp({ username: email, password })
    if (onSignUp) {
      const { user }: any = onSignUp
      if (onSubmitted) onSubmitted(user)
      logEvent({ action: 'signup', category: 'acquisition' })
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
        inputProps={{ minlength: '8' }}
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
        inputProps={{ minlength: '8' }}
      />
      <RhfSubmitButton className={classes.submitButton} fullWidth>
        <Typography color="inherit" variant="h5" className={classes.submitButtonTitle}>
          Sign Up
        </Typography>
        <Typography color="inherit" className={classes.submitButtonSubtitle}>
          And see your medication
        </Typography>
      </RhfSubmitButton>
    </RhfForm>
  )
}

export default SignupForm
