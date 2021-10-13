import React, { useState } from 'react'
import { Button, ButtonProps, Box, Typography, Snackbar } from '@material-ui/core'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined'
import { makeStyles } from '@material-ui/core/styles'
import { CashRecordTypeEnum } from '@onextech/btb-api'
import { addTypename } from '@onextech/gvs-kit/utils'
import { Alert } from '@material-ui/lab'
import * as colors from '@material-ui/core/colors'
import PortalModal from '../../components/PortalModal'
import { PortfolioInterface } from '../../graphql/portfolio/typings'
import CashForm, { CashFormValues } from '../../components/OnboardingModal/CashForm'
import { useUpdatePortfolio } from '../../graphql/portfolio/mutations'

const useStyles = makeStyles((theme) => ({
  addCashButton: {
    backgroundColor: colors.green['A700'],
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: colors.green['A700'],
      opacity: 0.9,
    },
    '& > .MuiButton-label': {
      textTransform: 'uppercase',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3, 2),
  },
  header: {
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: theme.spacing(1.25),
  },
  subHeader: {
    color: theme.palette.text.hint,
    textAlign: 'center',
    marginBottom: theme.spacing(6),
  },
  snackbar: {
    '& > .MuiAlert-standardSuccess': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      fontSize: theme.typography.pxToRem(14),
      padding: theme.spacing(0.5, 1.5),
      '& > .MuiAlert-icon': {
        color: theme.palette.primary.contrastText,
        '& > .MuiAlert-message': {
          fontWeight: 500,
        },
      },
    },
  },
}))

interface CashAddModalProps {
  ButtonProps?: ButtonProps
  portfolio: PortfolioInterface
}

const CashAddModal: React.FC<CashAddModalProps> = (props) => {
  const classes = useStyles()
  const { ButtonProps = {}, portfolio } = props

  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false)
  const handleCloseSnackbar = () => setIsOpenSnackbar(false)

  const record = {
    baseCurrency: portfolio?.baseCurrency,
    cash: null,
  }
  const { handleUpdatePortfolio } = useUpdatePortfolio()

  const handleSubmit = async (values: CashFormValues, hide) => {
    const { cash } = values
    const { id: portfolioID, cash: prevCash, cashRecords } = portfolio

    const nextCashRecord = addTypename(
      {
        createdAt: new Date().toISOString(),
        type: CashRecordTypeEnum.TOPUP,
        asset: null,
        value: cash,
      },
      'CashRecordType'
    )

    const nextValues = {
      cash: prevCash + cash,
      cashRecords: cashRecords.concat(nextCashRecord),
    }

    await handleUpdatePortfolio({ id: portfolioID, ...nextValues })
    setIsOpenSnackbar(true)
    hide()
  }

  return (
    <>
      <PortalModal
        hasCloseBtn={false}
        toggle={(show) => (
          <Button
            onClick={show}
            variant="contained"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            className={classes.addCashButton}
            {...ButtonProps}
          >
            Add Cash
          </Button>
        )}
      >
        {({ hide }) => (
          <Box py={5.5} px={3.875}>
            <Typography className={classes.header} variant="h3">
              Cash
            </Typography>
            <Typography className={classes.subHeader} variant="subtitle1">
              BetaBlocks gives you more ways to make your money work harder.
            </Typography>
            <CashForm onSuccess={async (values) => handleSubmit(values, hide)} record={record} submitBtnLabel="Add" />
          </Box>
        )}
      </PortalModal>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        className={classes.snackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Cash added successfully!
        </Alert>
      </Snackbar>
    </>
  )
}

export default CashAddModal
