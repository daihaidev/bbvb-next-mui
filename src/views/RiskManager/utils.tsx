import orderBy from 'lodash/orderBy'
import { round } from 'lodash'
import { Asset } from '../../utils/getCalculatedAssetsAndTotals'
import theme from '../../theme/palette'

const MIN = 0
const MAX = 7

export const getRandomColor = () => {
  const colorIndex = Math.floor(Math.random() * (MAX - MIN) + MIN)

  switch (colorIndex) {
    case 0:
      return theme.chart.red
    case 1:
      return theme.chart.yellow
    case 2:
      return theme.chart.orange
    case 3:
      return theme.chart.green
    case 4:
      return theme.chart.blue
    case 5:
      return theme.chart.darkGreen
    case 6:
      return theme.chart.lightBlue
    default:
      return theme.chart.red
  }
}

export const getRiskBetaLandscapeChartData = (assets: Asset[]) => {
  return assets.map((asset) => {
    return {
      label: asset.ticker,
      color: getRandomColor(),
      data: [
        {
          x: asset.beta || 0, // Risk -> Beta
          y: round(asset.contributionToReturn * 100, 2), // Contribution to Return
          r: round(asset.weight * 100, 2), // Weight
        },
      ],
    }
  })
}

export const getTopFiveData = (assets: Asset[]) => {
  const data = orderBy(assets, 'marketValue', 'desc')
    .slice(0, 5)
    .map((asset) => asset.marketValue)

  return [{ data, color: theme.primary.main }]
}

export const getTopFiveLabels = (assets: Asset[]) => {
  return orderBy(assets, 'marketValue', 'desc')
    .slice(0, 5)
    .map((asset) => asset.ticker)
}
