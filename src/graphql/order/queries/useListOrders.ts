import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { ListOrdersQuery, ListOrdersQueryVariables, listOrders as listOrdersQuery } from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListOrders = (args: QueryHookOptions<ListOrdersQuery, ListOrdersQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(listOrdersQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const orders = data?.listOrders?.items ?? []

  return {
    orders,
    ...rest,
  }
}

export default useListOrders
