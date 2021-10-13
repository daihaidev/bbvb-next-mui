import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { ListProductsQuery, ListProductsQueryVariables, listProducts as listProductsQuery } from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const defaultFilter = { status: { eq: 'published' } }

const useListProducts = (args: QueryHookOptions<ListProductsQuery, ListProductsQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(listProductsQuery), {
    ...args,
    variables: {
      limit: DEFAULT_LIMIT,
      ...args?.variables,
      filter: { ...defaultFilter, ...args?.variables?.filter },
    },
  })

  const products = data?.listProducts?.items ?? []

  return {
    products,
    ...rest,
  }
}

export default useListProducts
