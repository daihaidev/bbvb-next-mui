import React from 'react'
import ReactDOM from 'react-dom'
import { Card, CardActions, CardContent, CardHeader, Divider, IconButton, Modal, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import ToggleContent from './ToggleContent'

// TODO@Joel: Type PortalModal
// interface ModalProps extends Omit<'toggle' | 'isOpen'> {
//   title?: string | React.ReactNode
//   toggle?: (show: () => void) => React.ReactNode
//   footer?: (hide: () => void) => React.ReactNode
//   footerProps?: ModalFooterProps
//   hasClose?: boolean
//   shouldCloseOnOverlayClick?: boolean
//   children: React.FunctionComponent<{ hide: () => void; isShown: boolean }> | React.ReactNode
// }

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.dark,
    },
  },
  root: {
    width: ({ width }: { width: number }) => width || 400,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%',
  },
  actions: {
    justifyContent: 'flex-end',
  },
}))

const PortalModal: React.FC<any> = (props) => {
  const {
    footer,
    toggle,
    title,
    children,
    shouldCloseOnOverlayClick = true,
    hasCloseBtn = true,
    className,
    open,
    close,
  } = props
  const classes = useStyles(props)

  // Hide toggle render if `open` prop is passed through as this usually means we want to set the control externally
  const toggleProps = { open, toggle: typeof open === 'undefined' ? toggle : () => null }

  return (
    <ToggleContent
      {...toggleProps}
      content={({ hide, isShown, toggleHandler }) => {
        const nextHide = () => {
          hide()
          if (close) {
            close()
          }
        }

        return ReactDOM.createPortal(
          <Modal
            open={isShown}
            onClose={!isShown || shouldCloseOnOverlayClick ? toggleHandler : null}
            onBackdropClick={() => close?.()}
          >
            <Card className={clsx(classes.root, className)}>
              {hasCloseBtn && (
                <IconButton aria-label="Close" onClick={nextHide} className={classes.closeBtn}>
                  <CloseIcon />
                </IconButton>
              )}
              {title && <CardHeader title={title} />}
              <Divider />
              {typeof children === 'function' ? (
                children({ isShown, hide: nextHide })
              ) : (
                <CardContent>{children}</CardContent>
              )}
              <Divider />
              {footer && <CardActions className={classes.actions}>{footer(nextHide)}</CardActions>}
            </Card>
          </Modal>,
          document.getElementById('modal-root')
        )
      }}
    />
  )
}

export default PortalModal
