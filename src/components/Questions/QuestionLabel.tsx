import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { FormLabel } from '@material-ui/core'

interface QuestionTitleProps extends React.ComponentProps<typeof FormLabel> {
  typography?: React.ComponentProps<typeof Typography>
}

const StyledTypography = withStyles((theme) => ({
  root: {
    fontWeight: 500,
    color: 'inherit',
  },
}))(Typography)

const QuestionLabel: React.FC<QuestionTitleProps> = (props) => {
  const { typography, children, ...rest } = props
  return (
    <FormLabel {...rest}>
      <StyledTypography variant="h6" {...typography}>
        {children}
      </StyledTypography>
    </FormLabel>
  )
}

export default QuestionLabel
