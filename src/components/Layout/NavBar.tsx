import React, { useState } from 'react'
import Link from 'next/link'
import kebabCase from 'lodash/kebabCase'
import MenuIcon from '@material-ui/icons/Menu'
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined'
import ShowChartOutlinedIcon from '@material-ui/icons/ShowChartOutlined'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Box, Button, IconButton, Theme, Typography, Menu, MenuItem } from '@material-ui/core'
import Router from 'next/router'
import NavLink from './NavLink'
import NavDrawer from './NavDrawer'
import LoginSignupModal from '../LoginSignupModal'
import { useAuth } from '../../auth'
import routes from '../../routes'

interface NavBarStyles {
  isHome: boolean
}

interface NavBarProps {
  onBackBtnClick?: () => void
  isHome: boolean
}

const useStyles = makeStyles<Theme, NavBarStyles>((theme) => ({
  root: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    height: 32,
    width: 32,
    fontSize: theme.typography.body2.fontSize,
    backgroundColor: theme.palette.secondary.dark,
    marginRight: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    },
  },
  mobileNavWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logo: {
    maxWidth: 150,
    objectFit: 'contain',
  },
  navBarContainer: {
    height: '100%',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
  },
  navBarLink: {
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(0.25, 1),
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  navBarLinksWrapper: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      marginBottom: theme.spacing(3),
    },
  },
  menuWrapper: {
    '& .MuiPaper-root': {
      borderRadius: 4,
    },
    '& .MuiMenuItem-root': {
      fontSize: theme.typography.pxToRem(16),
    },
  },
  menuIcon: {
    color: theme.palette.primary.contrastText,
  },
  closeButton: {
    padding: theme.spacing(1.5, 0),
  },
  secondaryHamburgerLink: {
    color: theme.palette.primary.main,
  },
  secondaryLinkButton: {
    padding: 0,
    marginTop: theme.spacing(2),
  },
  hiddenSmDownNavbar: {
    minWidth: 210,
    backgroundColor: theme.palette.background.dark,
    padding: theme.spacing(4, 2),
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    [theme.breakpoints.up('md')]: {
      display: ({ isHome }) => (isHome ? 'none' : 'flex'),
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  hiddenMdUpNavbar: {
    width: '100%',
    backgroundColor: theme.palette.background.dark,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}))

const LogoutNavLink = ({ label, className, ...rest }) => {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <LoginSignupModal
      toggle={() => (
        <Button onClick={handleSignOut}>
          <Typography variant="body2" className={className}>
            {label}
          </Typography>
        </Button>
      )}
      {...rest}
    />
  )
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const { isHome } = props

  const classes = useStyles({ isHome })

  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    Router.push('/')
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const navLinks = [
    {
      label: 'Performance',
      route: '/management/performance',
      icon: BarChartOutlinedIcon,
    },
    {
      label: 'Portfolio',
      route: routes.PORTFOLIO,
      icon: DashboardOutlinedIcon,
    },
    {
      label: 'Portfolio Builder',
      route: routes.PORTFOLIO_BUILDER,
      icon: FlashOnOutlinedIcon,
    },
    {
      label: 'Risk Manager',
      route: '/management/risk-manager',
      icon: ShowChartOutlinedIcon,
    },
    {
      label: 'Settings',
      route: '/management/settings',
      icon: SettingsOutlinedIcon,
    },
  ]

  const defaultMobileLinks = [
    {
      label: 'Menu',
      render: (
        <IconButton onClick={toggleDrawer} aria-label="open drawer" size="medium">
          <MenuIcon className={classes.menuIcon} />
        </IconButton>
      ),
    },
    {
      label: 'Home',
      render: (
        <Link href="/" passHref>
          <Box component="a" className={classes.logoWrapper}>
            <img src="/logo.png" alt="logo" className={classes.logo} />
          </Box>
        </Link>
      ),
    },
  ]
  const mobileLinks = !user
    ? [
        ...defaultMobileLinks,
        {
          label: 'Get Started',
          render: (
            <Link href={user ? routes.PERFORMANCE : routes.REGISTER} passHref>
              <Typography variant="h6" className={classes.navBarLink}>
                Get Started
              </Typography>
            </Link>
          ),
        },
      ]
    : [
        ...defaultMobileLinks,
        {
          label: 'Log Out',
          render: (
            <>
              <Avatar src={user?.media?.[0].src} className={classes.avatar} onClick={handleOpenMenu}>
                {user?.name?.charAt(0)}
              </Avatar>
              <Menu
                id="user-icon-menu"
                className={classes.menuWrapper}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                transformOrigin={{
                  vertical: -45,
                  horizontal: 0,
                }}
              >
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </>
          ),
        },
      ]

  const defaultHamburgerNavLinks = [
    {
      label: 'Close',
      render: (
        <IconButton className={classes.closeButton} color="primary" onClick={toggleDrawer} aria-label="close drawer">
          <CloseIcon fontSize="large" />
        </IconButton>
      ),
    },
    ...navLinks,
  ]
  const hamburgerNavLinks = !user
    ? [
        ...defaultHamburgerNavLinks,
        {
          label: 'Get Started',
          route: user ? routes.PERFORMANCE : routes.REGISTER,
        },
        {
          label: 'Log In',
          route: routes.LOGIN,
        },
        {
          label: 'Learn',
          route: '#',
        },
      ]
    : [
        ...defaultHamburgerNavLinks,
        {
          label: 'Sign Out',
          render: (
            <Button className={classes.secondaryLinkButton} variant="text">
              <LogoutNavLink label="Sign Out" className={classes.secondaryHamburgerLink} />
            </Button>
          ),
        },
      ]

  const renderNavLink = (navLink) => {
    const { route, render, ...rest } = navLink
    return route ? <NavLink {...rest} route={route} key={navLink.route} /> : render
  }

  return (
    <Box className={classes.root}>
      {/* Nav Links @ SM and below */}
      <Box className={classes.hiddenMdUpNavbar}>
        <Box className={classes.mobileNavWrapper}>
          {mobileLinks.map((navLink) => {
            return <React.Fragment key={kebabCase(navLink?.label)}>{renderNavLink(navLink)}</React.Fragment>
          })}
        </Box>
      </Box>

      {/* Nav Links @ MD and above */}
      <Box className={classes.hiddenSmDownNavbar}>
        {/* Page Links */}
        <Box className={classes.navBarLinksWrapper}>
          {navLinks.map((navLink) => {
            return <React.Fragment key={kebabCase(navLink?.label)}>{renderNavLink(navLink)}</React.Fragment>
          })}
        </Box>
      </Box>
      {/* Nav Drawer */}
      <NavDrawer open={isDrawerOpen} onClose={toggleDrawer} links={hamburgerNavLinks} />
    </Box>
  )
}

export default NavBar
