import React from 'react'
import clsx from 'clsx'
import { Box, BoxProps, Container } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles<any, { background?: any }>(() => ({
  background: {
    backgroundRepeat: 'no-repeat',
    backgroundImage: ({ background = {} }) => `url(${background.src || ''})`,
    backgroundPosition: ({ background = {} }) => background.position || 'center',
    backgroundSize: ({ background = {} }) => background.size || 'cover',
    backgroundColor: ({ background = {} }) => background.color || '',
    // Adding overlay to background image @link: https://stackoverflow.com/a/36679903
    boxShadow: ({ background = {} }) => (background.overlay ? 'inset 0 0 0 50vw rgba(0, 0, 0, 0.4)' : 'unset'),
  },
}))

export interface BlockProps extends BoxProps {
  background?: {
    src: string
    size?: string
    position?: string
    overlay?: boolean
    color?: string
  }
  container?: boolean | React.ComponentProps<typeof Container>
}

const Block: React.FC<BlockProps> = (props) => {
  const { container, background, children, className, ...rest } = props
  const classes = useStyles({ background })

  const wrapperProps = {
    px: { xs: 0.75, md: 0 },
    className: clsx(background && classes.background, className),
    ...rest,
  }

  const content = container ? (
    <Container {...container}>
      <>{children}</>
    </Container>
  ) : (
    children
  )

  return <Box {...wrapperProps}>{content}</Box>
}

export default Block
