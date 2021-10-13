import React, { useState } from 'react'
import RouterLink from 'next/link'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography,
  colors,
} from '@material-ui/core'
import ShareIcon from '@material-ui/icons/Share'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import getInitials from '../utils/getInitials'
import Label from './Label'

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    paddingBottom: 0,
  },
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  description: {
    padding: theme.spacing(2, 3, 1, 3),
  },
  tags: {
    padding: theme.spacing(0, 3, 2, 3),
    '& > * + *': {
      marginLeft: theme.spacing(1),
    },
  },
  learnMoreButton: {
    marginLeft: theme.spacing(2),
  },
  likedButton: {
    color: colors.red[600],
  },
  shareButton: {
    marginLeft: theme.spacing(1),
  },
  details: {
    padding: theme.spacing(2, 3),
  },
}))

function ProjectCard({ project, className, ...rest }) {
  const classes = useStyles()
  const [liked, setLiked] = useState(project.liked)

  const handleLike = () => {
    setLiked(true)
  }

  const handleUnlike = () => {
    setLiked(false)
  }

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        avatar={
          <Avatar alt="Author" src={project.author.avatar}>
            {getInitials(project.author.name)}
          </Avatar>
        }
        className={classes.header}
        disableTypography
        subheader={
          <Typography variant="body2">
            by{' '}
            <RouterLink href="/profile/[id]/[tab]" as="/profile/1/timeline" passHref>
              <Link color="textPrimary" component="a" variant="h6">
                {project.author.name}
              </Link>
            </RouterLink>{' '}
            | Updated: {moment(project.updated_at).fromNow()}
          </Typography>
        }
        title={
          <RouterLink href="/management/projects/[id]/[tab]" as="/management/projects/1/overview" passHref>
            <Link color="textPrimary" component="a" variant="h5">
              {project.title}
            </Link>
          </RouterLink>
        }
      />
      <CardContent className={classes.content}>
        <div className={classes.description}>
          <Typography color="textSecondary" variant="subtitle2">
            We&apos;re looking for experienced Developers and Product Designers to come aboard and help us build
            succesful businesses through software.
          </Typography>
        </div>
        <div className={classes.tags}>
          {project.tags.map((tag) => (
            <Label color={tag.color} key={tag.text}>
              {tag.text}
            </Label>
          ))}
        </div>
        <Divider />
        <div className={classes.details}>
          <Grid alignItems="center" container justify="space-between" spacing={3}>
            <Grid item>
              <Typography variant="h5">${project.price}</Typography>
              <Typography variant="body2">Per Project</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5">{project.location}</Typography>
              <Typography variant="body2">Location</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5">{project.type}</Typography>
              <Typography variant="body2">Type</Typography>
            </Grid>
            <Grid item>
              {liked ? (
                <Tooltip title="Unlike">
                  <IconButton className={classes.likedButton} onClick={handleUnlike} size="small">
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Like">
                  <IconButton className={classes.likeButton} onClick={handleLike} size="small">
                    <FavoriteBorderIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Share">
                <IconButton className={classes.shareButton} size="small">
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <RouterLink href="/management/projects/1/overview" passHref>
                <Button className={classes.learnMoreButton} component="a" size="small">
                  Learn more
                </Button>
              </RouterLink>
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  )
}

ProjectCard.propTypes = {
  className: PropTypes.string,
  project: PropTypes.object.isRequired,
}

export default ProjectCard
