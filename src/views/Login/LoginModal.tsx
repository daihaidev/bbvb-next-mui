import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PortalModal from '../../components/PortalModal'
import LoginForm from './LoginForm'
import { useAuth } from '../../auth'

type LoginModalProps = React.ComponentProps<typeof PortalModal>

const useStyles = makeStyles((theme) => ({
  contentWrapper: {
    maxWidth: 355,
    margin: theme.spacing(5),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(2, 5),
    },
  },
  header: {
    color: theme.palette.primary.main,
    maxWidth: 334,
    marginBottom: theme.spacing(1.5),
  },
  subHeader: {
    maxWidth: 329,
    marginBottom: theme.spacing(5.5),
    fontFamily: theme.typography.fontFamily,
    fontWeight: 400,
  },
}))

const LoginModal: React.FC<LoginModalProps> = (props) => {
  const { closeLoginModal } = useAuth()
  const classes = useStyles(props)

  const onLoginSuccess = () => {
    closeLoginModal()
  }

  return (
    <PortalModal open close={closeLoginModal}>
      <Box className={classes.contentWrapper}>
        <Typography variant="h3" className={classes.header}>
          Welcome back.
        </Typography>
        <Typography variant="h6" className={classes.subHeader}>
          Enter your details below to access your shopping cart.
        </Typography>

        <LoginForm onLoginSuccess={onLoginSuccess} />
      </Box>
    </PortalModal>
  )
}

export default LoginModal
