import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Box, Container, Grid, IconButton, Typography, Theme, CardMedia } from '@material-ui/core'
import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import TwitterIcon from '@material-ui/icons/Twitter'
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import MailIcon from '@material-ui/icons/Mail'
import NavLink from './NavLink'
import { useAuth } from '../../auth'
import routes from '../../routes'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(7, 0),
    backgroundColor: theme.palette.background.dark,
    [theme.breakpoints.down('sm')]: {
      '& .MuiContainer-root': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
  },
  socialAndLinksContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(2),
    },
  },
  socialMediaLinksWrapper: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'flex-start',
    },
  },
  socialMediaIconWrapper: {
    border: `1px solid rgba(255, 255,255, 0.5)`,
    padding: theme.spacing(0.75),
    marginRight: theme.spacing(1.5),
  },
  socialMediaIcon: {
    fontSize: theme.typography.pxToRem(18),
    color: theme.palette.common.white,
  },
  pageLinksWrapper: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  pageLinkColumn: {},
  pageLinkWrapper: {
    color: theme.palette.common.white,
    marginBottom: theme.spacing(2),
    '& > a': {
      textDecoration: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  headerText: {
    fontSize: theme.typography.button.fontSize,
    fontWeight: 800,
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      marginTop: theme.spacing(4),
    },
  },
  bodyText: {
    fontSize: theme.typography.button.fontSize,
    opacity: 0.85,
    lineHeight: 1.3,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  contactDetailContainer: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  contactDetailWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'flex-start',
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
    },
    [theme.breakpoints.only('xs')]: {
      alignItems: 'center',
    },
  },
  contactIcon: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(1.5),
  },
  disclaimer: {
    fontSize: theme.typography.button.fontSize,
    color: theme.palette.common.white,
    opacity: 0.4,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  footerCaption: {
    fontSize: theme.typography.button.fontSize,
    color: theme.palette.common.white,
  },
  footerLogo: {
    height: '23px',
    width: '137px',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}))

export const renderNavLink = (navLink) => {
  const { route, render, color, ...rest } = navLink
  return route ? <NavLink {...rest} route={route} key={navLink.route} color={color} /> : render
}

const Footer: React.FC = () => {
  const { user } = useAuth()
  const classes = useStyles()

  const navLinks = [
    { label: 'Get Started', route: user ? routes.PERFORMANCE : routes.REGISTER },
    { label: 'Learn', route: '/' },
  ]

  // Filter out My Orders link if user is not logged in
  const nextNavLinks = user ? navLinks : navLinks.filter((link) => link.label !== 'Home')

  return (
    <footer className={classes.root}>
      <Container maxWidth="lg">
        <Grid container justify="space-between">
          {/* Social Media + Page Links */}
          <Grid item xs={12} md={4}>
            <Grid className={classes.socialAndLinksContainer} container>
              {/* Social Media Icons */}
              {/* TODO: Social Media Links */}
              <Grid item xs={12}>
                <Box mb={2}>
                  <CardMedia image="/logo_white.png" className={classes.footerLogo} />
                </Box>
                <Box mb={3} className={classes.footerCaption}>
                  BetaBlocks’s business concept is to offer financial data at the best quality in a sustainable way.
                  BetaBlocks was founded in 2020 grown into leading financial information platform. The content of this
                  site is copyright-protected.
                </Box>
              </Grid>
              <Grid className={classes.socialMediaLinksWrapper} item xs={12} md={4}>
                <IconButton className={classes.socialMediaIconWrapper}>
                  <FacebookIcon className={classes.socialMediaIcon} />
                </IconButton>
                <IconButton className={classes.socialMediaIconWrapper}>
                  <TwitterIcon className={classes.socialMediaIcon} />
                </IconButton>
                <IconButton className={classes.socialMediaIconWrapper}>
                  <InstagramIcon className={classes.socialMediaIcon} />
                </IconButton>
              </Grid>
              {/* Page Links */}
            </Grid>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box className={classes.pageLinksWrapper}>
              <Box className={classes.pageLinkColumn}>
                {nextNavLinks.slice(0, 3).map((navBarLink) => {
                  return (
                    <Box className={classes.pageLinkWrapper} key={navBarLink.label}>
                      {renderNavLink({ ...navBarLink, color: '#fff' })}
                    </Box>
                  )
                })}
              </Box>
              <Box className={classes.pageLinkColumn}>
                {nextNavLinks.slice(3).map((navBarLink) => {
                  return (
                    <Box className={classes.pageLinkWrapper} key={navBarLink.label}>
                      {renderNavLink(navBarLink)}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box width={1} my={3} borderBottom="1px solid grey" />
          </Grid>
          {/* Contact Us */}
          <Grid item xs={12} container justify="space-between">
            <Grid item md={8} sm={12}>
              <Box className={classes.contactInfo}>
                <Box className={classes.contactDetailWrapper}>
                  <PhoneInTalkIcon className={classes.contactIcon} />
                  <Box className={classes.footerCaption}>1800 132-0000</Box>
                </Box>
                <Box className={classes.contactDetailWrapper}>
                  <MailIcon className={classes.contactIcon} />
                  <Box className={classes.footerCaption}>hello@vandalay.com</Box>
                </Box>
                <Box className={classes.contactDetailWrapper}>
                  <LocationOnIcon className={classes.contactIcon} />
                  <Box className={classes.footerCaption}>Marina Bay Financial Center, Tower 3, Singapore 112852</Box>
                </Box>
              </Box>
            </Grid>
            <Grid item md={2} sm={12}>
              {/* Disclaimer */}
              <Typography variant="body2" className={classes.disclaimer}>
                © 2020 Vandalay Pte Ltd
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </footer>
  )
}

export default Footer
