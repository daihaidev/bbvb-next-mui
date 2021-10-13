import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { GetPortfolioQuery, GetPortfolioQueryVariables, getPortfolio as getPortfolioQuery } from '@onextech/btb-api'
import { DEFAULT_LIMIT } from '../../constants'

const useGetPortfolio = (args: QueryHookOptions<GetPortfolioQuery, GetPortfolioQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(getPortfolioQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const portfolio = data?.getPortfolio

  return {
    portfolio,
    ...rest,
  }
}

export default useGetPortfolio
