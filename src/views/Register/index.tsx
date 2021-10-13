import React from 'react'
import Link from 'next/link'
import { Box, Container, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import RegisterForm from './RegisterForm'
import Layout from '../../components/Layout/Layout'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  signInWrapper: {
    display: 'flex',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  signInLink: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  container: {
    width: '100%',
  },
}))

const Register: React.FC = (props) => {
  const classes = useStyles(props)

  return (
    <Layout isHome title="Home">
      <div className={classes.container}>
        <RegisterForm />
      </div>
    </Layout>
  )
}

export default Register
