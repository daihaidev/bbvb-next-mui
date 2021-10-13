import React from 'react'
import RouterLink from 'next/link'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Link, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  bubble: {
    flexGrow: 1,
    padding: theme.spacing(1),
    marginLeft: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  time: {
    marginLeft: 'auto',
  },
  message: {
    marginTop: theme.spacing(1),
  },
}))

function CommentBubble({ comment, className, ...rest }) {
  const classes = useStyles()

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <RouterLink href="/profile/[id]/[tab]" as="/profile/1/timeline" passHref alt="Person">
        <Avatar component="a" src={comment.author.avatar} />
      </RouterLink>
      <div className={classes.bubble}>
        <div className={classes.header}>
          <RouterLink href="/profile/[id]/[tab]" as="/profile/1/timeline" passHref>
            <Link color="textPrimary" component="a" variant="h6">
              {comment.author.name}
            </Link>
          </RouterLink>
          <Typography className={classes.time} variant="body2">
            {moment(comment.created_at).fromNow()}
          </Typography>
        </div>
        <Typography className={classes.message} variant="body1">
          {comment.message}
        </Typography>
      </div>
    </div>
  )
}

CommentBubble.propTypes = {
  className: PropTypes.string,
  comment: PropTypes.object.isRequired,
}

export default CommentBubble
