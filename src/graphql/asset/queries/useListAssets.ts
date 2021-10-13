import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { ListAssetsQuery, ListAssetsQueryVariables, listAssets as listAssetsQuery } from '@onextech/btb-api'
import { DEFAULT_LIMIT } from '../../constants'

const defaultFilter = { status: { eq: 'published' } }

const useListAssets = (args: QueryHookOptions<ListAssetsQuery, ListAssetsQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(listAssetsQuery), {
    ...args,
    variables: {
      limit: DEFAULT_LIMIT,
      ...args?.variables,
      filter: { ...defaultFilter, ...args?.variables?.filter },
    },
  })

  const assets = data?.listAssets?.items ?? []

  return {
    assets,
    ...rest,
  }
}

export default useListAssets
