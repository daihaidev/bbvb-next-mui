import getNumberWithCommas from './getNumberWithCommas'

/**
 * Parse a number to percent string, e.g. 14.5%
 * @function printPercentage
 * @param {number} value
 * @returns string
 *
 * Usage:
 * printPercentage(14.5) //returns '14.5%'
 */
const printPercentage = (value: number) => {
  const nextAmount = value || 0
  return `${getNumberWithCommas(Math.abs(nextAmount * 100))}%`
}

export default printPercentage
