import React from 'react'
import { Box, Typography, CardMedia, Theme } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'

interface HomeSummaryBoxProps {
  title: string
  iconPath: string
  description: string
}

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: theme.typography.pxToRem(21),
  },
  description: {
    padding: theme.spacing(0, 3),
    fontSize: theme.typography.pxToRem(16),
    color: theme.palette.text.light,
  },
  rowIcon: {
    height: '56px',
    width: '58px',
  },
}))

const HomeSummaryBox = (props: HomeSummaryBoxProps) => {
  const { title, iconPath, description } = props
  const classes = useStyles()
  return (
    <Box width={1}>
      <Box width={1} mb={3} display="flex" alignItems="center" justifyContent="center">
        <CardMedia image={iconPath} className={classes.rowIcon} />
      </Box>
      <Box width={1} mb={2} px={3} textAlign="center">
        <Typography variant="h5" className={classes.title}>
          {title}
        </Typography>
      </Box>
      <Box width={1} mb={2} className={classes.description} textAlign="center">
        {description}
      </Box>
    </Box>
  )
}

export default HomeSummaryBox
