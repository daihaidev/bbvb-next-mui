/**
 * Parse a number to number string with comma, e.g. 1,250,000
 * @function getNumberWithCommas
 * @param {number} floatValue
 * @returns string
 *
 * Usage:
 * getNumberWithCommas(1500) //returns '1,500.00'
 */
const getNumberWithCommas = (floatValue) => {
  if (typeof floatValue !== 'number') return ''
  const parts = floatValue.toFixed(2).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export default getNumberWithCommas
