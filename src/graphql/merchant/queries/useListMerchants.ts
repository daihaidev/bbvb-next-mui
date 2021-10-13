import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { ListMerchantsQuery, ListMerchantsQueryVariables, listMerchants as listMerchantsQuery } from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListMerchants = (args: QueryHookOptions<ListMerchantsQuery, ListMerchantsQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(listMerchantsQuery), {
    ...args,
    variables: {
      limit: DEFAULT_LIMIT,
      ...args?.variables,
    },
  })

  const merchants = data?.listMerchants?.items ?? []

  return {
    merchants,
    ...rest,
  }
}

export default useListMerchants
