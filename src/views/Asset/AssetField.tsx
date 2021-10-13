import React from 'react'
import { Autocomplete, AutocompleteFieldProps } from '@onextech/gvs-kit/core'
import { ListAssetsQueryVariables } from '@onextech/btb-api'
import { useListAssets } from '../../graphql/asset/queries'
import config from '../../config'

const pk = 'assetID'

interface AssetFieldProps extends AutocompleteFieldProps {
  ListboxProps?: object
}

const AssetField: React.FC<AssetFieldProps> = (props) => {
  const { filter } = props

  const variables: ListAssetsQueryVariables = { limit: config.arbitraryQueryLimit }
  if (filter) variables.filter = filter
  const { loading, assets } = useListAssets({ variables })

  const options = assets?.map(({ id, title, ...rest }) => ({ ...rest, [pk]: id, title, id }))

  return <Autocomplete pk={pk} options={options} loading={loading} {...props} />
}

export default AssetField
