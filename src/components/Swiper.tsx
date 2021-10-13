import React from 'react'
import ReactIdSwiper, { ReactIdSwiperProps } from 'react-id-swiper'
import { makeStyles } from '@material-ui/styles'
import { Box, BoxProps } from '@material-ui/core'

interface SwiperProps extends ReactIdSwiperProps {
  wrapper?: BoxProps
  slidesPerView?: number | 'auto' // not declared in library
  spaceBetween?: number // not declared in library
  freeMode?: boolean // not declared in library
}

const useStyles = makeStyles({
  root: {
    position: 'relative',
  },
})

const Swiper: React.FC<SwiperProps> = (props) => {
  const { children, wrapper, ...rest } = props
  const classes = useStyles()

  return (
    <Box className={classes.root} {...wrapper}>
      <ReactIdSwiper rebuildOnUpdate {...rest}>
        {children}
      </ReactIdSwiper>
    </Box>
  )
}

export default Swiper
