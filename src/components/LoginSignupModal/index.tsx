import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Box, Typography } from '@material-ui/core'
import useTheme from '@material-ui/core/styles/useTheme'
import PortalModal from '../PortalModal'
import Block from '../Block'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'

type LoginSignupModalProps = React.ComponentProps<typeof PortalModal>

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90vw',
    maxHeight: '95vh',
  },
  content: {
    margin: theme.spacing(6),
    '& > :not(:first-child)': {
      marginTop: theme.spacing(3),
    },
  },
  header: {
    '& > :not(:first-child)': {
      marginTop: theme.spacing(1.5),
    },
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: theme.palette.primary.main,
    fontWeight: 500,
    textAlign: 'center',
  },
  info: {
    color: theme.palette.primary.main,
    textAlign: 'center',
  },
  bodyContainer: {
    '& > :not(:first-child)': {
      marginTop: theme.spacing(1.5),
    },
  },
  sectionHeader: {
    color: theme.palette.text.hint,
    fontWeight: 'bold',
  },
  sectionDivider: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    textAlign: 'center',
  },
}))

const LoginSignupModal: React.FC<LoginSignupModalProps> = (props) => {
  const { onSuccess } = props
  const classes = useStyles({})
  const theme = useTheme()

  const handleLoginSignup = (hide) => (user) => {
    if (user) {
      hide()
      if (onSuccess) onSuccess(user)
    }
  }

  return (
    <PortalModal className={classes.root} width={theme.breakpoints.values.sm} {...props}>
      {({ hide }) => (
        <Box className={classes.content}>
          <Box className={classes.header}>
            <Typography variant="h5" className={classes.title}>
              SIGN UP or LOGIN
            </Typography>
            <Typography variant="h6" className={classes.subtitle}>
              to find out your medication
            </Typography>
            <Typography className={classes.info}>
              We need this information so that we can reach you for feedback.
            </Typography>
          </Box>
          <Block container={{ maxWidth: 'xs', disableGutters: true, className: classes.bodyContainer }}>
            <Typography className={classes.sectionHeader}>New User?</Typography>
            <SignupForm onSubmitted={handleLoginSignup(hide)} />
            <Typography className={classes.sectionDivider}>Or</Typography>
            <Typography className={classes.sectionHeader}>Already have an account?</Typography>
            <LoginForm onSubmitted={handleLoginSignup(hide)} />
          </Block>
        </Box>
      )}
    </PortalModal>
  )
}

export default LoginSignupModal
