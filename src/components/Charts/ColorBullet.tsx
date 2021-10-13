import React from 'react'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import withStyles from '@material-ui/core/styles/withStyles'
import { Box, SvgIcon } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

interface ColorBulletProps {
  title: string
  color: string
}

const StyledSvgIcon = withStyles((theme: Theme) => ({
  root: {
    fontSize: theme.typography.pxToRem(8),
  },
}))(SvgIcon)

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.hint,
  },
}))

const ColoBullet = (props: ColorBulletProps) => {
  const { color, title } = props
  const classes = useStyles()
  return (
    <Box display="flex" alignItems="center" justifyContent="center" mr={1}>
      <StyledSvgIcon fontSize="small" style={{ color }}>
        <FiberManualRecordIcon />
      </StyledSvgIcon>
      <Box ml={0.5} className={classes.title}>
        {title}
      </Box>
    </Box>
  )
}

export default ColoBullet
