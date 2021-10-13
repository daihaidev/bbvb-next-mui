import { GetBenchmarkQuery, ListBenchmarksQuery } from '@onextech/btb-api'

export type BenchmarkInterface = GetBenchmarkInterface | ListBenchmarkInterface
export type GetBenchmarkInterface = GetBenchmarkQuery['getBenchmark']
export type ListBenchmarkInterface = ListBenchmarksQuery['listBenchmarks']['items'][number]
