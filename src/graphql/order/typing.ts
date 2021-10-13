import { GetOrderQuery, ListOrdersQuery } from '@onextech/etc-api'

export type OrderInterface = GetOrderInterface | ListOrderInterface
export type GetOrderInterface = GetOrderQuery['getOrder']
export type ListOrderInterface = ListOrdersQuery['listOrders']['items'][number]

export type OrderLineType = OrderInterface['lines'][number]
