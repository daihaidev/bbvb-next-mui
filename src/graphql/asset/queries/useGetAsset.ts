import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { GetAssetQuery, GetAssetQueryVariables, getAsset as getAssetQuery } from '@onextech/btb-api'
import { DEFAULT_LIMIT } from '../../constants'

const useGetAsset = (args: QueryHookOptions<GetAssetQuery, GetAssetQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(getAssetQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const asset = data?.getAsset

  return {
    asset,
    ...rest,
  }
}

export default useGetAsset
