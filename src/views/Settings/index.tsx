import React from 'react'
import { Box, Divider, Grid, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Layout from '../../components/Layout/Layout'
import UserSummaryCard from '../../components/UserSummaryCard'
import UserSettingsForm from '../../components/Form/UserSettingsForm/UserSettingsForm'

const useStyles = makeStyles((theme: Theme) => ({
  contentWrapper: {
    padding: theme.spacing(2, 3),
  },
}))

const Settings: React.FC = (props) => {
  const classes = useStyles(props)

  return (
    <Layout contentClassName={classes.contentWrapper} title="Settings">
      <Box mt={2}>
        <Divider />
      </Box>
      <Box pt={2}>
        <Grid container>
          <Grid item xs={12} md={3}>
            <UserSummaryCard />
          </Grid>
          <Grid item xs={12} md={8}>
            <UserSettingsForm />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
}

export default Settings
