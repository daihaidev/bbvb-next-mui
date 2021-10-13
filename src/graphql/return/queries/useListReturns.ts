import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { ListReturnsQuery, ListReturnsQueryVariables, listReturns as listReturnsQuery } from '@onextech/btb-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListReturns = (args: QueryHookOptions<ListReturnsQuery, ListReturnsQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(listReturnsQuery), {
    ...args,
    variables: {
      limit: DEFAULT_LIMIT,
      ...args?.variables,
      filter: { ...args?.variables?.filter },
    },
  })

  const returns = data?.listReturns?.items ?? []

  return {
    returns,
    ...rest,
  }
}

export default useListReturns
