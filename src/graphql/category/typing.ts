import { GetCategoryQuery, ListCategorysQuery } from '@onextech/etc-api'

export type CategoryInterface = GetCategoryInterface | ListCategoryInterface
export type GetCategoryInterface = GetCategoryQuery['getCategory']
export type ListCategoryInterface = ListCategorysQuery['listCategorys']['items'][number]
