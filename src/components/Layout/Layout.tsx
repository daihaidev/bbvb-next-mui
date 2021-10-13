import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Helmet } from 'react-helmet'
import { Box, Theme } from '@material-ui/core'
import clsx from 'clsx'
import NavBar from './NavBar'
import Footer from './Footer'
import Header from './Header'
import Breadcrumbs from './Breadcrumbs'
import routes from '../../routes'

interface LayoutStyles {
  isHome: boolean
}

interface LayoutProps {
  className?: string
  title: string
  contentClassName?: string
  footer?: React.ComponentProps<typeof Footer>
  isHome?: boolean
  hideNav?: boolean
}

const useStyles = makeStyles<Theme, LayoutStyles>((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    overflowX: 'hidden',
    [theme.breakpoints.up('md')]: {
      flexDirection: ({ isHome }) => (isHome ? 'column' : 'row'),
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  backButtonWrapper: {
    width: '100%',
    padding: theme.spacing(5, 0, 0, 5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
}))

const Layout: React.FC<LayoutProps> = (props) => {
  const { className, contentClassName, title, children, footer, isHome, hideNav = false } = props
  const classes = useStyles({ isHome })

  return (
    <Box>
      <div className={clsx(classes.root, className)}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Header isHome={isHome} />
        <Box className={classes.mainWrapper}>
          <NavBar isHome={isHome} />
          <main className={clsx(classes.mainContent, contentClassName)}>
            {!isHome && !hideNav && <Breadcrumbs routes={routes} />}
            {children}
          </main>
          {isHome && <Footer {...footer} />}
        </Box>
      </div>
    </Box>
  )
}

export default Layout
