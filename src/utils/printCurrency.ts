import getNumberWithCommas from './getNumberWithCommas'

const DEFAULT_CURRENCY = '$'

/**
 * Parse a number to currency string, e.g. -$ 1,500.50
 * @function printCurrency
 * @param {object} values
 * @param {number} values.amount
 * @param {string} values.currency
 * @param {boolean} values.hasPlusSign
 * @returns string
 *
 * Usage:
 * printCurrency({
 *  amount: -1500,
 * })
 *
 * //returns '-$ 1,500.00'
 */
const printCurrency = (values) => {
  const { amount, currency = DEFAULT_CURRENCY, hasPlusSign = false } = values || {}
  const nextAmount = amount || 0
  const isAmountNegative = amount && amount < 0
  const prefix = isAmountNegative ? '-' : hasPlusSign ? '+' : ''
  return `${prefix}${currency} ${getNumberWithCommas(Math.abs(nextAmount))}`
}

export default printCurrency
