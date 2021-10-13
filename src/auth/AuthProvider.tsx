import React, { useEffect, useState, createContext, useContext } from 'react'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/react-hooks'
import { UserTypeEnum, getUser as getUserQuery } from '@onextech/btb-api'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import {
  currentAuthenticatedUser,
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  forgotPassword as authForgotPassword,
  forgotPasswordSubmit as authForgotPasswordSubmit,
} from './Auth'
import withApollo from '../withApollo'
import { useCreateUser, useUpdateUser } from '../graphql/user/mutations'
import { UserInterface } from '../graphql/user/typing'
import LoginModal from '../views/Login/LoginModal'
import RegisterModal from '../views/Register/RegisterModal'

const useStyles = makeStyles((theme) => ({
  loginSuccess: {
    '&.MuiAlert-standardSuccess': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    '&.MuiAlert-standardSuccess .MuiAlert-icon': {
      color: theme.palette.primary.contrastText,
    },
  },
}))

interface Auth {
  user?: UserInterface
  loading?: boolean
  signIn?: typeof authSignIn
  signUp?: typeof authSignUp
  signOut?: typeof authSignOut
  forgotPassword?: typeof authForgotPassword
  forgotPasswordSubmit?: typeof authForgotPasswordSubmit
  updateUser?: (values: any) => void
  openLoginModal?: () => void
  closeLoginModal?: () => void
  openRegisterModal?: () => void
  closeRegisterModal?: () => void
  switchModal?: () => void
  shouldAuthModalOpen?: boolean
  isLoginModalOpen?: boolean
  isRegisterModalOpen?: boolean
}

const AuthContext = createContext<Auth>({})

export const useAuth = ({ isAuthRoute = false } = {}) => {
  const context = useContext(AuthContext)
  const router = useRouter()
  const [loading, setLoading] = useState(isAuthRoute)

  const { isLoginModalOpen, isRegisterModalOpen, openLoginModal, shouldAuthModalOpen } = context
  const isNotLoggedInOnAuthRoute = isAuthRoute && shouldAuthModalOpen
  useEffect(() => {
    if (isNotLoggedInOnAuthRoute) {
      openLoginModal?.()
      setLoading(false)
    }
  }, [isNotLoggedInOnAuthRoute])

  useEffect(() => {
    const isAuthModalOpen = isLoginModalOpen || isRegisterModalOpen
    if (isNotLoggedInOnAuthRoute && !isAuthModalOpen && !loading) router.push('/login')
  }, [isLoginModalOpen, isRegisterModalOpen, loading])

  return context
}

const AuthProvider = (props) => {
  const { children } = props
  const [cognitoUser, setCognitoUser] = useState(null)
  const [dbUser, setDBUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // auth route states (only used when isAuthRoute is true)
  const [shouldAuthModalOpen, setShouldAuthModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  // state for login success snackbar
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const handleOpen = () => setIsOpen(true)

  const apollo = useApolloClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { user: cognitoUser } = await currentAuthenticatedUser()
      if (cognitoUser) {
        setCognitoUser(cognitoUser)
        const onQuery = await apollo.query({ query: gql(getUserQuery), variables: { id: cognitoUser.sub } })
        const dbUser = onQuery?.data?.getUser
        setDBUser(dbUser)
      } else {
        setShouldAuthModalOpen(true)
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const signIn = async (values) => {
    const { user, error } = await authSignIn(values)
    if (user) {
      setCognitoUser(user)
      const onQuery = await apollo.query({ query: gql(getUserQuery), variables: { id: user.sub } })
      const dbUser = onQuery?.data?.getUser
      if (dbUser) {
        setDBUser(dbUser)
        setShouldAuthModalOpen(false)
      }
      handleOpen()
    }
    return { user, error }
  }

  const { handleCreateUser } = useCreateUser()

  const signUp = async (values) => {
    const { user, error } = await authSignUp(values)
    if (user) {
      await authSignIn(values)
      const onCreateUser = await handleCreateUser({
        id: user.sub,
        email: user.email,
        username: user.email,
        name: values?.attributes?.name,
        type: UserTypeEnum.user,
      })
      const dbUser = onCreateUser?.data?.createUser
      setDBUser(dbUser)
      setLoading(false)
      setShouldAuthModalOpen(false)
      handleOpen()
    }
    return { user, error }
  }

  const signOut = async () => {
    const isSignedOut = await authSignOut()
    if (isSignedOut) {
      setCognitoUser(null)
      setDBUser(null)
      setShouldAuthModalOpen(true)
    }
    return isSignedOut
  }

  const { handleUpdateUser } = useUpdateUser()

  const updateUser = async (values) => {
    const onUpdateUser = await handleUpdateUser({
      ...values,
      id: dbUser.id,
    })

    const nextDbUser = onUpdateUser?.data?.updateUser
    setDBUser(nextDbUser)
    setLoading(false)
    setShouldAuthModalOpen(false)
  }

  const forgotPassword = async (values) => {
    const { error } = (await authForgotPassword(values)) ?? {}
    return { error }
  }

  const forgotPasswordSubmit = async (values) => {
    const { error } = (await authForgotPasswordSubmit(values)) ?? {}
    return { error }
  }

  const auth = {
    user: dbUser,
    loading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    forgotPasswordSubmit,
    updateUser,
    openLoginModal: () => setIsLoginModalOpen(true),
    closeLoginModal: () => setIsLoginModalOpen(false),
    openRegisterModal: () => setIsRegisterModalOpen(true),
    closeRegisterModal: () => setIsRegisterModalOpen(false),
    switchModal: () => {
      setIsLoginModalOpen(!isLoginModalOpen)
      setIsRegisterModalOpen(!isRegisterModalOpen)
    },
    shouldAuthModalOpen,
    isLoginModalOpen,
    isRegisterModalOpen,
  }

  const classes = useStyles()

  return (
    <AuthContext.Provider value={auth}>
      <>
        <Snackbar
          open={isOpen}
          onClose={handleClose}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success" className={classes.loginSuccess} onClose={handleClose}>
            Login Success
          </Alert>
        </Snackbar>
        {children}
        {/* TODO: Add auth modals */}
        {isLoginModalOpen && <LoginModal />}
        {isRegisterModalOpen && <RegisterModal />}
      </>
    </AuthContext.Provider>
  )
}

export default withApollo()(AuthProvider)
