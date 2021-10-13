import React from 'react'
import { Grid, Box } from '@material-ui/core'
import HomeHero from '../../components/Home/HomeHero'
import HomeDescription from '../../components/Home/HomeDescription'

const HomePageLayout = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box mb={8}>
          <HomeHero />
        </Box>
        <HomeDescription />
      </Grid>
    </Grid>
  )
}

export default HomePageLayout
