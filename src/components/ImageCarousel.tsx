import React from 'react'
import { Box, BoxProps } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { S3Image } from '@onextech/gvs-kit/core'
import clsx from 'clsx'
import Swiper from './Swiper'

interface ImageCarouselProps extends BoxProps {
  images: Array<React.ImgHTMLAttributes<HTMLImageElement>>
}

const useStyles = makeStyles((theme) => ({
  imageWrapper: {
    backgroundColor: theme.palette.background.light,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customBullet: {
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.secondary.main}`,
    '&.swiper-pagination-bullet-active': {
      backgroundColor: theme.palette.secondary.light,
      border: 'none',
    },
  },
  image: {
    width: '100%',
    objectFit: 'cover',
  },
}))

const ImageCarousel: React.FC<ImageCarouselProps> = (props) => {
  const { images, className, ...rest } = props
  const classes = useStyles(props)

  const params = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (index, className) => {
        return `<span class="${clsx(className, classes.customBullet)}"></span>`
      },
    },
  }

  return (
    <Swiper {...params}>
      {images.map((image) => (
        <Box key={image.src} className={clsx(className, classes.imageWrapper)}>
          <S3Image className={classes.image} path={image.src} />
        </Box>
      ))}
    </Swiper>
  )
}

export default ImageCarousel
