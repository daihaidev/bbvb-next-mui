import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { ListCartItemsQuery, ListCartItemsQueryVariables, listCartItems as listCartItemsQuery } from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListCartItems = (args: QueryHookOptions<ListCartItemsQuery, ListCartItemsQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(listCartItemsQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const cartItems = data?.listCartItems?.items ?? []

  return {
    cartItems,
    ...rest,
  }
}

export default useListCartItems
