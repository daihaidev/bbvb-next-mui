import React from 'react'
import clsx from 'clsx'
import { Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Block, { BlockProps } from './Block'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '60vh',
    minHeight: 300,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      height: '80vh',
    },
  },
  box: {},
}))

const Hero: React.FC<BlockProps> = (props) => {
  const { children, className, ...rest } = props
  const classes = useStyles(props)

  return (
    <Block className={clsx(classes.root, className)} container bgcolor="white" px={0} {...rest}>
      <Box px={{ xs: 0.75, md: 0 }}>
        {/* TODO: Add Fade effect */}
        {children}
      </Box>
    </Block>
  )
}

export default Hero
