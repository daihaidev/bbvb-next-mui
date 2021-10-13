import React from 'react'
import clsx from 'clsx'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { makeStyles } from '@material-ui/core/styles'
import { Button, ButtonProps, Typography, Theme } from '@material-ui/core'

interface BackButtonProps extends Omit<ButtonProps, 'color'> {
  color?: string
}

interface BackButtonStyles {
  color?: string
}

const useStyles = makeStyles<Theme, BackButtonStyles>((theme) => ({
  root: {
    '&, & .MuiButton-startIcon': {
      color: ({ color }) => color || theme.palette.primary.light,
    },
    '& .MuiButton-startIcon': {
      borderRadius: theme.shape.borderRadius,
      border: ({ color }) => `1px solid ${color || theme.palette.primary.light}`,
      padding: theme.spacing(0.625, 0.25, 0.625, 1),
    },
  },
}))

const BackButton: React.FC<BackButtonProps> = (props) => {
  const { className, color, ...rest } = props
  const classes = useStyles({ color })

  return (
    <Button className={clsx(classes.root, className)} startIcon={<ArrowBackIosIcon />} size="small" {...rest}>
      <Typography variant="body2" color="inherit">
        Back
      </Typography>
    </Button>
  )
}

export default BackButton
