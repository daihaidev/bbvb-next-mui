import printCurrency from '../../utils/printCurrency'
import printPercentage from '../../utils/printPercentage'

const getFormattedGainLossGrowth = (growth) => {
  if (!growth) return ''

  const isPositiveGrowth = growth > 0
  const prefix = isPositiveGrowth ? 'UP' : 'DOWN'
  const value = isPositiveGrowth ? growth : growth.toString().replace('-', '')

  return `${prefix} ${printPercentage(value)}`
}

const getExcelFormattedPortfolio = (items, currency) => {
  return items?.map((item) => {
    const {
      title,
      ticker,
      sector,
      subSector,
      netPrice,
      netQuantity,
      lastPrice,
      marketValue,
      weightage,
      gainLoss,
      gainLossGrowth,
      hasNoPrevLastPrice,
    } = item || {}

    return {
      Name: `${title} - ${ticker}`,
      Sector: `${sector} (${subSector})`,
      Quantity: netQuantity,
      'Traded Price': `${currency} ${netPrice}`,
      'Last Price': `${currency} ${lastPrice}`,
      'Market Value': `${printCurrency({ amount: marketValue })} (${printPercentage(weightage)})`,
      'Gain / Loss': `${printCurrency({ amount: gainLoss, hasPlusSign: true })}${
        hasNoPrevLastPrice ? '' : ` (${getFormattedGainLossGrowth(gainLossGrowth)})`
      }`,
    }
  })
}

export default getExcelFormattedPortfolio
