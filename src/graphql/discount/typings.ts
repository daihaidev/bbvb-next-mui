import { GetDiscountQuery, ListDiscountsQuery } from '@onextech/etc-api'

export type DiscountInterface = GetDiscountInterface | ListDiscountInterface
export type GetDiscountInterface = GetDiscountQuery['getDiscount']
export type ListDiscountInterface = ListDiscountsQuery['listDiscounts']['items'][number]
