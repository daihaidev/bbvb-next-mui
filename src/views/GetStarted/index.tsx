import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import Layout from '../../components/Layout/Layout'
import OnboardingModal from '../../components/OnboardingModal'

const useStyles = makeStyles((theme: Theme) => ({
  contentWrapper: {
    padding: theme.spacing(2, 3),
  },
}))

const GetStarted: React.FC = () => {
  const classes = useStyles()

  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)

  useEffect(() => {
    setIsOnboardingModalOpen(true)
  }, [])

  return (
    <Layout contentClassName={classes.contentWrapper} title="Getting Started">
      <OnboardingModal open={isOnboardingModalOpen} close={() => setIsOnboardingModalOpen(false)} />
    </Layout>
  )
}

export default GetStarted
