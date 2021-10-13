import React from 'react'
import { IconButton, IconButtonProps } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

interface NextButtonProps extends IconButtonProps {}

const NextButton: React.FC<NextButtonProps> = (props) => {
  return (
    <IconButton {...props}>
      <NavigateNextIcon />
    </IconButton>
  )
}

export default NextButton
