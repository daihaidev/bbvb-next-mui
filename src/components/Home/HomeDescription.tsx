import React from 'react'
import { Box, Grid, Typography, Theme } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import HomeDescriptionRow from './HomeDescriptionRow'
import HomeSummaryBox from './HomeSummaryBox'

const useStyles = makeStyles((theme: Theme) => ({
  mainDescription: {
    textAlign: 'center',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  description: {
    padding: theme.spacing(0, 3),
    fontSize: theme.typography.pxToRem(16),
    color: theme.palette.text.light,
  },
}))

const features = [
  {
    title: 'Portfolio Builder',
    iconPath: '/others/home/noun-cubes.png',
    description:
      'An intuitive and interactive way to build your portfolio of assets by evaluating realtime exposures and changes before executing on the market.',
  },
  {
    title: 'Real-time Performance',
    iconPath: '/others/home/noun-coins.png',
    description:
      'BetaBlocks gives you the Ability to view and evaluate portfolio performance in realtime or historical across security, sector and strategy',
  },
  {
    title: 'Monitor Risk & Diversification',
    iconPath: '/others/home/noun-pie-chart.png',
    description:
      'BetaBlocks helps you monitor your investment and portfolio risks the same way an institutional portfolio manage would.',
  },
]

const benefits = [
  {
    title: 'Increase your net wealth',
    iconPath: '/others/home/noun-wealth.png',
    description:
      'Improve your netwealth over time in a sustainable way by taking advantage of cutting edge investment technology and methods',
  },
  {
    title: 'Learn how to diversify your investments',
    iconPath: '/others/home/noun-scale.png',
    description:
      'Diversify your investments by balancing your portfolio across compaines, sectors and strategies ensuring that you can withstand market shocks whilst maintaining asset growth',
  },
  {
    title: 'Simulate trades to gain confidence',
    iconPath: '/others/home/noun-investment-growth-chart.png',
    description:
      'Build “whatif” portfolios and simulate trades to show how effective your investment ideas and strategies could be.',
  },
]

const HomeDescription = () => {
  const classes = useStyles()
  return (
    <>
      <Box mt={8}>
        <HomeDescriptionRow title="How it works">
          <Grid container justify="center">
            <Grid item sm={8}>
              <Typography variant="h3" className={classes.mainDescription}>
                BetaBlocks revolutionizes the way to visualize your investment portfolio, through a customizable,
                intuitive platform to manage risks and performance, giving you the power to create a better financial
                future.
              </Typography>
            </Grid>
          </Grid>
        </HomeDescriptionRow>
      </Box>
      <HomeDescriptionRow title="Features">
        <Grid container justify="center">
          <Grid item sm={11} container spacing={6}>
            {features.map((feature) => (
              <Grid item md={4} sm={12} key={feature.title}>
                <HomeSummaryBox title={feature.title} iconPath={feature.iconPath} description={feature.description} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </HomeDescriptionRow>
      <HomeDescriptionRow title="Benefits">
        <Grid container justify="center">
          <Grid item sm={11} container spacing={6}>
            {benefits.map((benefit) => (
              <Grid item md={4} sm={12} key={benefit.title}>
                <HomeSummaryBox title={benefit.title} iconPath={benefit.iconPath} description={benefit.description} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </HomeDescriptionRow>
    </>
  )
}

export default HomeDescription
