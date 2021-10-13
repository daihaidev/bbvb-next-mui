import { GetProductQuery, ListProductsQuery } from '@onextech/etc-api'

export type ProductInterface = GetProductInterface | ListProductInterface
export type GetProductInterface = GetProductQuery['getProduct']
export type ListProductInterface = ListProductsQuery['listProducts']['items'][number]
