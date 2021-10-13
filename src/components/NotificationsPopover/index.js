import React from 'react'
import RouterLink from 'next/link'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Popover, CardHeader, CardActions, Divider, Button, colors } from '@material-ui/core'
import NotificationList from './NotificationList'
import Placeholder from './Placeholder'

const useStyles = makeStyles(() => ({
  root: {
    width: 350,
    maxWidth: '100%',
  },
  actions: {
    backgroundColor: colors.grey[50],
    justifyContent: 'center',
  },
}))

function NotificationsPopover({ notifications, anchorEl, ...rest }) {
  const classes = useStyles()

  return (
    <Popover
      {...rest}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <div className={classes.root}>
        <CardHeader title="Notifications" />
        <Divider />
        {notifications.length > 0 ? <NotificationList notifications={notifications} /> : <Placeholder />}
        <Divider />
        <CardActions className={classes.actions}>
          <RouterLink href="#" passHref>
            <Button component="a" size="small">
              See all
            </Button>
          </RouterLink>
        </CardActions>
      </div>
    </Popover>
  )
}

NotificationsPopover.propTypes = {
  anchorEl: PropTypes.any,
  className: PropTypes.string,
  notifications: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}

export default NotificationsPopover
