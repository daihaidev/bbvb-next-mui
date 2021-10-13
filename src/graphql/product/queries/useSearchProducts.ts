import gql from 'graphql-tag'
import { QueryHookOptions, useQuery } from '@apollo/react-hooks'
import {
  SearchProductsQuery,
  SearchProductsQueryVariables,
  searchProducts as searchProductsQuery,
} from '@onextech/etc-api'
import { usePagination } from '@onextech/gvs-kit/hooks'
import { DEFAULT_LIMIT } from '../../constants'

const defaultVariables = {
  limit: DEFAULT_LIMIT,
  nextToken: null,
}

const useSearchProducts = (args: QueryHookOptions<SearchProductsQuery, SearchProductsQueryVariables> = {}) => {
  const { variables, skip } = args

  const query = gql(searchProductsQuery)
  const nextVariables = { ...defaultVariables, ...variables }

  const { loading, error, data, fetchMore } = useQuery<SearchProductsQuery, SearchProductsQueryVariables>(query, {
    variables: nextVariables,
    skip,
  })

  // Extract data
  const { items = [], nextToken } = data?.searchProducts || {}

  // Pagination
  const pagination = usePagination(nextToken, fetchMore, {
    query,
    variables: { ...nextVariables, nextToken },
    skip: loading,
  })

  return {
    loading,
    error,
    products: items,

    // Pagination
    pagination,
  }
}

export default useSearchProducts
