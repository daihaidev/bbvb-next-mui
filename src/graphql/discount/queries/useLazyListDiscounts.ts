import gql from 'graphql-tag'
import { LazyQueryHookOptions, useLazyQuery } from '@apollo/react-hooks'
import { ListDiscountsQuery, ListDiscountsQueryVariables, listDiscounts } from '@onextech/etc-api'
import { usePagination } from '@onextech/gvs-kit/hooks'
import { DEFAULT_LIMIT } from '../../constants'

const useLazyListDiscounts = (args: LazyQueryHookOptions<ListDiscountsQuery, ListDiscountsQueryVariables> = {}) => {
  const { variables = {}, ...rest } = args

  // Fire query
  const query = gql(listDiscounts)
  const nextVariables = { limit: DEFAULT_LIMIT, ...variables }
  const [handleListDiscounts, { loading, error, data, fetchMore }] = useLazyQuery(query, {
    ...rest,
    variables: nextVariables,
  })

  // Extract data
  const { items, nextToken } = data?.listDiscounts || {}

  // Pagination
  const pagination = usePagination(nextToken, fetchMore, {
    query,
    variables: { ...nextVariables, nextToken },
    skip: loading,
  })

  return {
    loading,
    error,
    discounts: items,
    nextToken,
    pagination,
    handleListDiscounts,
  }
}

export default useLazyListDiscounts
