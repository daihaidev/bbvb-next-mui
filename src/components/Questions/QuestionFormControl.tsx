import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { FormControl } from '@material-ui/core'

const StyledFormControl = withStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      '& > :not(:first-child)': {
        marginTop: theme.spacing(1),
      },
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      '& > .MuiFormLabel-root': {
        width: '75%',
      },
    },
  },
}))(FormControl)

type QuestionFormControlProps = React.ComponentProps<typeof FormControl>

const QuestionFormControl: React.FC<QuestionFormControlProps> = (props) => {
  return <StyledFormControl fullWidth {...props} />
}

export default QuestionFormControl
