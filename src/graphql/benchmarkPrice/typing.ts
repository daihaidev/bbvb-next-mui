import { GetBenchmarkPriceQuery, ListBenchmarkPricesQuery } from '@onextech/btb-api'

export type BenchmarkPriceInterface = GetBenchmarkPriceInterface | ListBenchmarkPriceInterface
export type GetBenchmarkPriceInterface = GetBenchmarkPriceQuery['getBenchmarkPrice']
export type ListBenchmarkPriceInterface = ListBenchmarkPricesQuery['listBenchmarkPrices']['items'][number]
