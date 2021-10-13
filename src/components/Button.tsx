import React from 'react'
import MUIButton, { ButtonProps } from '@material-ui/core/Button'

interface PageButtonProps extends ButtonProps {}

const Button: React.FC<PageButtonProps> = (props) => {
  return <MUIButton variant="contained" color="primary" {...props} />
}

export default Button
