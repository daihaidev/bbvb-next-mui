import gql from 'graphql-tag'
import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import {
  ListBenchmarksQuery,
  ListBenchmarksQueryVariables,
  listBenchmarks as listBenchmarksQuery,
} from '@onextech/btb-api'
import { DEFAULT_LIMIT } from '../../constants'

const defaultFilter = { status: { eq: 'published' } }

const useListBenchmarks = (args: QueryHookOptions<ListBenchmarksQuery, ListBenchmarksQueryVariables> = {}) => {
  const { data, ...rest } = useQuery(gql(listBenchmarksQuery), {
    ...args,
    variables: {
      limit: DEFAULT_LIMIT,
      ...args?.variables,
      filter: { ...defaultFilter, ...args?.variables?.filter },
    },
  })

  const benchmarks = data?.listBenchmarks?.items ?? []

  return {
    benchmarks,
    ...rest,
  }
}

export default useListBenchmarks
