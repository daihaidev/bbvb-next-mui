import React from 'react'
import { Box, CircularProgress } from '@material-ui/core'

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = (props) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <CircularProgress />
    </Box>
  )
}

export default Loading
