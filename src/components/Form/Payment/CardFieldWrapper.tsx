import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { FormControl, InputLabel } from '@material-ui/core'

type CardFieldWrapper = React.ComponentProps<typeof FormControl> & {
  label?: React.ReactNode
}

const Wrapper = withStyles((theme) => ({
  root: {
    '& > .MuiInputLabel-root': {
      position: 'unset',
    },
    '& .StripeElement': {
      '&:hover, &$--focus': {
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        paddingBottom: theme.spacing(1.5),
      },
      '&$--invalid': {
        borderBottom: `2px solid ${theme.palette.error.main}`,
        paddingBottom: theme.spacing(1.5),
      },
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.625),
      borderBottom: `1px solid ${theme.palette.text.disabled}`,
      '& > .InputElement': {
        color: 'red',
        '&::placeholder': {
          color: 'purple',
        },
      },
    },
  },
}))(FormControl)

const CardFieldWrapper: React.FC<CardFieldWrapper> = (props) => {
  const { children, label, ...rest } = props

  return (
    <Wrapper {...rest}>
      {label && <InputLabel shrink>{label}</InputLabel>}
      {children}
    </Wrapper>
  )
}

export default CardFieldWrapper
