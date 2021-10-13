import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { ListCategorysQuery, ListCategorysQueryVariables, listCategorys as listCategorysQuery } from '@onextech/etc-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListCategories = (args: QueryHookOptions<ListCategorysQuery, ListCategorysQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(listCategorysQuery), {
    ...args,
    variables: {
      limit: DEFAULT_LIMIT,
      ...args?.variables,
    },
  })

  const categories = data?.listCategorys?.items ?? []

  return {
    categories,
    ...rest,
  }
}

export default useListCategories
