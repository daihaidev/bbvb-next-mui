import { sumBy, round } from 'lodash'
import getAverage from './getAverage'

const getPopulationVariance = (sample: object[], key: string): number => {
  if (sample?.length === 0) return 0

  const mean = getAverage(sample, key)
  const numOfElem = sample.length
  const sumOfTerms = sumBy(sample, (item) => (item[key] - mean) ** 2)
  return round(sumOfTerms / numOfElem, 2)
}

export default getPopulationVariance
