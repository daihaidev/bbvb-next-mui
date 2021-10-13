import { GetAssetQuery, ListAssetsQuery } from '@onextech/btb-api'

export type AssetInterface = GetAssetInterface | ListAssetInterface
export type GetAssetInterface = GetAssetQuery['getAsset']
export type ListAssetInterface = ListAssetsQuery['listAssets']['items'][number]
