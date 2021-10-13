import React from 'react'
import { Container } from '@material-ui/core'
import Layout from '../../components/Layout/Layout'
import HomePageLayout from './HomePageLayout'

const Home: React.FC = () => {
  return (
    <Layout isHome title="Home">
      <Container>
        <HomePageLayout />
      </Container>
    </Layout>
  )
}

export default Home
