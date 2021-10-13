import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import {
  ListPortfoliosQuery,
  ListPortfoliosQueryVariables,
  listPortfolios as listPortfoliosQuery,
} from '@onextech/btb-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListPortfolios = (args: QueryHookOptions<ListPortfoliosQuery, ListPortfoliosQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(listPortfoliosQuery), {
    ...args,
    variables: {
      limit: DEFAULT_LIMIT,
      ...args?.variables,
      filter: { ...args?.variables?.filter },
    },
  })

  const portfolios = data?.listPortfolios?.items ?? []

  return {
    portfolios,
    ...rest,
  }
}

export default useListPortfolios
