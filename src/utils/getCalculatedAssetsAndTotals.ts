import { sortBy, sumBy } from 'lodash'
import { AssetInterface } from '../graphql/asset/typing'
import { PortfolioInterface, PortfolioAssetType } from '../graphql/portfolio/typings'
import getAverage from './getAverage'

export interface Asset extends PortfolioAssetType {
  lastPrice?: number
  marketValue?: number
  weight?: number
  gainLoss?: number
  gainLossPercent?: number
  absGainLossPercent?: number
  contributionToReturn?: number
  weightedBeta?: number
  weightedDivYld?: number
}

export interface TotalsAndAverages {
  avgBeta?: number
  totalDivYld?: number
  totalTradedValue?: number
  totalMarketValue?: number
  nav?: number
  totalGainLoss?: number
  totalCashValue?: number
  totalCashValuePercent?: number
  totalWeightedBeta?: number
  totalWeightedDivYld?: number
  totalGainLossPercent?: number
  totalWeight?: number
}

interface GetCalculatedAssetsAndTotals {
  assets: Asset[]
  totalsAndAverages: TotalsAndAverages
}

/**
 * Calculate additional properties e.g. gainLoss, marketValue, etc. for each asset in the Portfolio using data from 'assets'
 * and totals of those additional properties e.g. totalGainLoss, totalMarketValue
 * @function getCalculatedAssetsAndTotals
 * @param {PortfolioInterface} portfolio
 * @param {Array<AssetInterface>} assets
 * @returns {GetCalculatedAssetsAndTotals} the average of the given key property
 */
const getCalculatedAssetsAndTotals = (
  portfolio: PortfolioInterface,
  assets: AssetInterface[]
): GetCalculatedAssetsAndTotals => {
  const nextAssets = portfolio?.assets?.map((portfolioAsset) => {
    const { assetID, netPrice, netQuantity } = portfolioAsset
    const asset = assets.find(({ id }) => id === assetID)

    // These properties need to be pulled from db assets instead of portfolio asset to get the most updated data
    const { title, ticker, sector, subSector, beta, divYld, strategy, subStrategy } = asset || portfolioAsset || {}

    // TODO: Confirm with backend whether can assume 'prices' is already sorted, if not might impact performance the longer the prices is
    const prices = sortBy(asset?.prices?.items, ({ createdAt }) => new Date(createdAt))

    const lastPrice = prices.length === 0 ? 0 : prices[prices.length - 1].value
    const tradedValue = netPrice * netQuantity
    const marketValue = lastPrice * netQuantity
    const gainLoss = marketValue - tradedValue
    const absGainLossPercent = marketValue / tradedValue - 1 // This percentage will be stored in decimal format

    return {
      ...portfolioAsset,
      prices,
      lastPrice,
      marketValue,
      tradedValue,
      gainLoss,
      absGainLossPercent,

      // Properties from db's assets
      title,
      ticker,
      sector,
      subSector,
      beta,
      divYld,

      // TODO: Remove this when the strategy field dropdown has been implemented
      strategy,
      subStrategy,
    }
  })

  const avgBeta = getAverage(nextAssets, 'beta')
  const totalDivYld = sumBy(nextAssets, 'divYld')
  const totalTradedValue = sumBy(nextAssets, 'tradedValue')
  const totalMarketValue = sumBy(nextAssets, 'marketValue')
  const nav = totalMarketValue + (portfolio?.cash || 0)
  const totalGainLoss = sumBy(nextAssets, 'gainLoss')
  const totalCashValue = nav - totalTradedValue
  const totalCashValuePercent = totalCashValue / nav // This percentage will be stored in decimal format

  const nextNextAssets = nextAssets?.map((nextAsset) => {
    const { marketValue, beta, divYld, gainLoss } = nextAsset

    const weight = marketValue / nav // This percentage will be stored in decimal format

    const weightedBeta = beta * weight
    const weightedDivYld = divYld * weight // This percentage will be stored in decimal format
    const gainLossPercent = gainLoss / nav // This percentage will be stored in decimal format

    const contributionToReturn = gainLossPercent * weight // This percentage will be stored in decimal format

    return {
      ...nextAsset,
      weight,
      weightedBeta,
      weightedDivYld,
      gainLossPercent,
      contributionToReturn,
    }
  })

  // TODO: Confirm with Joel whether to show average or total weighted for beta and divYld
  const totalWeightedBeta = sumBy(nextNextAssets, 'weightedBeta')
  const totalWeightedDivYld = sumBy(nextNextAssets, 'weightedDivYld')
  const totalGainLossPercent = sumBy(nextNextAssets, 'gainLossPercent')
  const totalWeight = sumBy(nextNextAssets, 'weight')

  const totalsAndAverages = {
    avgBeta,
    totalDivYld,
    totalTradedValue,
    totalMarketValue,
    nav,
    totalGainLoss,
    totalCashValue,
    totalCashValuePercent,
    totalWeightedBeta,
    totalWeightedDivYld,
    totalGainLossPercent,
    totalWeight,
  }

  return {
    assets: nextNextAssets,
    totalsAndAverages,
  }
}

export default getCalculatedAssetsAndTotals
