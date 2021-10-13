import React from 'react'
import { IconButton, IconButtonProps } from '@material-ui/core'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'

interface PreviousButtonProps extends IconButtonProps {}

const PreviousButton: React.FC<PreviousButtonProps> = (props) => {
  return (
    <IconButton {...props}>
      <NavigateBeforeIcon />
    </IconButton>
  )
}

export default PreviousButton
