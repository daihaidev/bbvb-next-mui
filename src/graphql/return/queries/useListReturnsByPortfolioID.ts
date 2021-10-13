import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import {
  ListReturnsByPortfolioIdQuery,
  ListReturnsByPortfolioIdQueryVariables,
  listReturnsByPortfolioId as listReturnsByPortfolioIDQuery,
} from '@onextech/btb-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListReturnsByPortfolioID = (
  args: QueryHookOptions<ListReturnsByPortfolioIdQuery, ListReturnsByPortfolioIdQueryVariables> = {}
) => {
  const { data, ...rest } = useQuery(gql(listReturnsByPortfolioIDQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args.variables },
  })

  const returns = data?.listReturnsByPortfolioID?.items ?? []

  return {
    returns,
    ...rest,
  }
}

export default useListReturnsByPortfolioID
