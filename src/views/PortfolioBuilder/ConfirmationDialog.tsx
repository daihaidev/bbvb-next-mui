import * as React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'

export interface ConfirmationOptions {
  catchOnCancel?: boolean
  variant: 'danger' | 'info'
  title: string
  description: string
}

interface ConfirmationDialogProps extends ConfirmationOptions {
  open: boolean
  onSubmit: () => void
  onClose: () => void
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
  const { title, variant, description, open, onSubmit, onClose } = props

  return (
    <Dialog open={open}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {variant === 'danger' && (
          <>
            <Button onClick={onClose} autoFocus>
              Cancel
            </Button>
            <Button color="primary" variant="contained" onClick={onSubmit}>
              Continue
            </Button>
          </>
        )}

        {variant === 'info' && (
          <Button color="primary" onClick={onSubmit}>
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
