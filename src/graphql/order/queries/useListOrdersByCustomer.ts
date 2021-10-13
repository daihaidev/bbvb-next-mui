import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import {
  ListOrdersByCustomerQuery,
  ListOrdersByCustomerQueryVariables,
  listOrdersByCustomer as listOrdersByCustomerQuery,
} from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListOrdersByCustomer = (
  args: QueryHookOptions<ListOrdersByCustomerQuery, ListOrdersByCustomerQueryVariables> = {}
) => {
  const { data, ...rest } = useQuery(gql(listOrdersByCustomerQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const orders = data?.listOrdersByCustomer?.items ?? []

  return {
    orders,
    ...rest,
  }
}

export default useListOrdersByCustomer
