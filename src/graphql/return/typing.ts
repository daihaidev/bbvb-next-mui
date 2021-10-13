import { GetReturnQuery, ListReturnsQuery } from '@onextech/btb-api'

export type ReturnInterface = GetReturnInterface | ListReturnInterface
export type GetReturnInterface = GetReturnQuery['getReturn']
export type ListReturnInterface = ListReturnsQuery['listReturns']['items'][number]
