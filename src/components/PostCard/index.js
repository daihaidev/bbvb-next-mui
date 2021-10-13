import React from 'react'
import RouterLink from 'next/link'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  CardMedia,
  Avatar,
  Link,
  Typography,
  Divider,
} from '@material-ui/core'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import Reactions from './Reactions'
import CommentBubble from './CommentBubble'
import CommentForm from './CommentForm'

const useStyles = makeStyles((theme) => ({
  root: {},
  subheader: {
    display: 'flex',
    alignItems: 'center',
  },
  accessTimeIcon: {
    color: theme.palette.text.secondary,
    fontSize: '14px',
    height: 14,
    width: 14,
    marginRight: 6,
  },
  content: {
    paddingTop: 0,
  },
  message: {
    marginBottom: theme.spacing(2),
  },
  mediaArea: {
    marginBottom: theme.spacing(2),
  },
  media: {
    height: 400,
    backgroundPosition: 'initial',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}))

function PostCard({ post, className, ...rest }) {
  const classes = useStyles()

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        avatar={
          <RouterLink alt="Person" href="/profile/[id]/[tab]" as="/profile/1/timeline">
            <Avatar className={classes.avatar} component="a" src={post.author.avatar} />
          </RouterLink>
        }
        disableTypography
        subheader={
          <div className={classes.subheader}>
            <AccessTimeIcon className={classes.accessTimeIcon} />
            <Typography variant="body2">{moment(post.created_at).fromNow()}</Typography>
          </div>
        }
        title={
          <RouterLink href="/profile/[id]/[tab]" as="/profile/1/timeline" passHref>
            <Link color="textPrimary" component="a" variant="h6">
              {post.author.name}
            </Link>
          </RouterLink>
        }
      />
      <CardContent className={classes.content}>
        <Typography className={classes.message} variant="body1">
          {post.message}
        </Typography>
        {post.media && (
          <CardActionArea className={classes.mediaArea}>
            <CardMedia className={classes.media} image={post.media} />
          </CardActionArea>
        )}
        <Reactions className={classes.reactions} post={post} />
        <Divider className={classes.divider} />
        {post.comments && (
          <div className={classes.comments}>
            {post.comments.map((comment) => (
              <CommentBubble comment={comment} key={comment.id} />
            ))}
          </div>
        )}
        <Divider className={classes.divider} />
        <CommentForm />
      </CardContent>
    </Card>
  )
}

PostCard.propTypes = {
  className: PropTypes.string,
  post: PropTypes.object.isRequired,
}

export default PostCard
