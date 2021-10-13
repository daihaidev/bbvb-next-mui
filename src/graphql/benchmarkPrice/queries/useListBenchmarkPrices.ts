import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import {
  ListBenchmarkPricesQuery,
  ListBenchmarkPricesQueryVariables,
  listBenchmarkPrices as listBenchmarkPricesQuery,
} from '@onextech/btb-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListBenchmarkPrices = (
  args: QueryHookOptions<ListBenchmarkPricesQuery, ListBenchmarkPricesQueryVariables> = {}
) => {
  const { data, ...rest } = useQuery(gql(listBenchmarkPricesQuery), {
    ...args,
    variables: {
      limit: DEFAULT_LIMIT,
      ...args?.variables,
      filter: { ...args?.variables?.filter },
    },
  })

  const benchmarkPrices = data?.listBenchmarkPrices?.items ?? []

  return {
    benchmarkPrices,
    ...rest,
  }
}

export default useListBenchmarkPrices
