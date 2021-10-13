import React from 'react'
import { Box, Typography } from '@material-ui/core'

interface HomeDescriptionRowProps {
  title: string
  children: React.ReactNode
}

const HomeDescriptionRow = (props: HomeDescriptionRowProps) => {
  const { title, children } = props

  return (
    <Box mb={6}>
      <Box width={1} textAlign="center" mb={6}>
        <Typography variant="h2">{title}</Typography>
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}

export default HomeDescriptionRow
