import { GetVariantQuery, ListVariantsQuery } from '@onextech/etc-api'
import { ProductInterface } from '../product'

export type VariantInterface =
  | GetVariantInterface
  | ListVariantInterface
  | ProductInterface['variants']['items'][number]
export type GetVariantInterface = GetVariantQuery['getVariant']
export type ListVariantInterface = ListVariantsQuery['listVariants']['items'][number]
