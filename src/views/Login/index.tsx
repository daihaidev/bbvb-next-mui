import React from 'react'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import LoginForm from './LoginForm'
import Layout from '../../components/Layout/Layout'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  signUpWrapper: {
    display: 'flex',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  signUpLink: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  container: {
    width: '100%',
  },
}))

const Login: React.FC = (props) => {
  const classes = useStyles(props)

  return (
    <Layout isHome title="Home">
      <div className={classes.container}>
        <LoginForm />
      </div>
    </Layout>
  )
}

export default Login
