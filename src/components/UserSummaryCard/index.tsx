import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Avatar } from '@material-ui/core'
import moment from 'moment'
import { useAuth } from '../../auth'

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0 1px 3px 0 rgba(63, 63, 68, 0.15), 0 0 0 1px rgba(63, 63, 68, 0.05)',
  },
  address: {
    fontSize: theme.typography.pxToRem(14),
  },
  time: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.tertiary,
  },
  divider: {
    alignSelf: 'stretch',
    backgroundColor: theme.palette.border.secondary,
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
  },
  removePicButton: {
    textTransform: 'uppercase',
    marginTop: theme.spacing(2),
  },
  changePasswordButton: {
    textTransform: 'uppercase',
    padding: theme.spacing(0.75, 1),
    border: `1px solid ${theme.palette.error.main}`,
    color: theme.palette.error.main,
  },
}))

const UserSummaryCard: React.FC = (props) => {
  const classes = useStyles(props)

  const { user } = useAuth()
  const { createdAt } = user || {}

  return (
    <Box py={3} px={5} display="flex" flexDirection="column" alignItems="center" width="100%" className={classes.root}>
      <Box clone mb={2} width={52} height={52}>
        <Avatar src={user?.media?.[0].src}>{user?.name?.charAt(0)}</Avatar>
      </Box>
      <Typography>{user?.name}</Typography>

      {createdAt && (
        <Box textAlign="center" mt={1.2}>
          <Typography className={classes.time}>Joined {moment(createdAt).format('MMM YYYY')}</Typography>
        </Box>
      )}
    </Box>
  )
}

export default UserSummaryCard
