import { GetPortfolioQuery, ListPortfoliosQuery } from '@onextech/btb-api'

export type PortfolioInterface = GetPortfolioInterface | ListPortfolioInterface
export type GetPortfolioInterface = GetPortfolioQuery['getPortfolio']
export type ListPortfolioInterface = ListPortfoliosQuery['listPortfolios']['items'][number]
export type PortfolioAssetType = GetPortfolioInterface['assets'][number]
