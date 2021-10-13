import React from 'react'
import { Button, ButtonProps } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import AssetForm from './AssetForm'
import PortalModal from '../../components/PortalModal'
import { PortfolioInterface } from '../../graphql/portfolio/typings'

interface AssetAddModalProps {
  ButtonProps?: ButtonProps
  portfolio: PortfolioInterface
}

const AssetAddModal: React.FC<AssetAddModalProps> = (props) => {
  const { ButtonProps = {}, portfolio } = props

  return (
    <PortalModal
      toggle={(show) => (
        <Button onClick={show} size="small" startIcon={<AddIcon />} {...ButtonProps}>
          Add New Asset
        </Button>
      )}
    >
      {({ hide }) => <AssetForm onSubmit={hide} portfolio={portfolio} />}
    </PortalModal>
  )
}

export default AssetAddModal
