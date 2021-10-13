import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import {
  ListBenchmarkPricesByBenchmarkIdQuery,
  ListBenchmarkPricesByBenchmarkIdQueryVariables,
  listBenchmarkPricesByBenchmarkId as listBenchmarkPricesByBenchmarkIDQuery,
} from '@onextech/btb-api'
import { DEFAULT_LIMIT } from '../../constants'

const useListBenchmarkPricesByBenchmarkID = (
  args: QueryHookOptions<ListBenchmarkPricesByBenchmarkIdQuery, ListBenchmarkPricesByBenchmarkIdQueryVariables> = {}
) => {
  const { data, ...rest } = useQuery(gql(listBenchmarkPricesByBenchmarkIDQuery), {
    ...args,
    variables: { limit: DEFAULT_LIMIT, ...args.variables },
  })

  const benchmarkPrices = data?.listBenchmarkPricesByBenchmarkID?.items ?? []

  return {
    benchmarkPrices,
    ...rest,
  }
}

export default useListBenchmarkPricesByBenchmarkID
