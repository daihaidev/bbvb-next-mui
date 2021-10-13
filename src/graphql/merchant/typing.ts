import { GetMerchantQuery, ListMerchantsQuery } from '@onextech/etc-api'

export type GetMerchantInterface = GetMerchantQuery['getMerchant']
export type ListMerchantInterface = ListMerchantsQuery['listMerchants']['items'][number]
export type MerchantInterface = GetMerchantInterface | ListMerchantInterface
