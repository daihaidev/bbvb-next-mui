import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress } from '@material-ui/core'
import { theme } from '../theme'

const useStyles = makeStyles({
  loader: {
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'absolute',
    zIndex: theme.zIndex.mobileStepper,
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.8)',
  },
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
})

interface CircularLoaderProps {
  loading?: boolean
}

const CircularLoader: React.FC<CircularLoaderProps> = (props) => {
  const { loading = true, children } = props
  const classes = useStyles(props)

  return (
    <div className={classes.wrapper}>
      {children}
      {loading && (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      )}
    </div>
  )
}

export default CircularLoader
