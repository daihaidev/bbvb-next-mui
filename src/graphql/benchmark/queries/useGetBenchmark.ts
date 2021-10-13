import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import { GetBenchmarkQuery, GetBenchmarkQueryVariables, getBenchmark as getBenchmarkQuery } from '@onextech/btb-api'
import { DEFAULT_LIMIT } from '../../constants'

const useGetBenchmark = (args: QueryHookOptions<GetBenchmarkQuery, GetBenchmarkQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(getBenchmarkQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args?.variables },
  })

  const benchmark = data?.getBenchmark

  return {
    benchmark,
    ...rest,
  }
}

export default useGetBenchmark
