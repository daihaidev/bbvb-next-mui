import React from 'react'
import Link from 'next/link'
import { Box, Grid, Typography, Button, Theme } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import routes from '../../routes'
import { useAuth } from '../../auth'

const useStyles = makeStyles((theme: Theme) => ({
  heroDescriptionContainer: {
    paddingTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
    },
  },
  heroDescription: {
    fontWeight: 400,
    lineHeight: '30px',
  },
  heroImageContainer: {
    paddingLeft: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(4),
      paddingLeft: 0,
    },
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}))

const HomeHero = () => {
  const classes = useStyles()
  const { user } = useAuth()
  return (
    <Box pt={4}>
      <Grid container spacing={2}>
        <Grid item lg={4} md={6} xs={12}>
          <Box className={classes.heroDescriptionContainer}>
            <Box mb={2} lineHeight="30px">
              <Typography variant="h1">The Future of Personal Investing</Typography>
            </Box>
            <Box mb={3}>
              <Typography variant="h3" className={classes.heroDescription}>
                BetaBlocks enables you to manage your investments like a professional portfolio manager, helping your
                investments grow in a sustainable way.
              </Typography>
            </Box>
            <Box>
              <Link href={user ? routes.PERFORMANCE : routes.REGISTER} passHref>
                <Button color="primary" variant="contained">
                  GET STARTED
                </Button>
              </Link>
            </Box>
          </Box>
        </Grid>
        <Grid item lg={8} md={6} xs={12}>
          <Box className={classes.heroImageContainer}>
            <img className={classes.heroImage} src="others/home/mac-book.png" alt="Register" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HomeHero
