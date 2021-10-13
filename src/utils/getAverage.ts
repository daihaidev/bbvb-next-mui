import { sumBy } from 'lodash'

/**
 * Calculate the average value of the given key property of an array of objects
 * @function getAverage
 * @param {Array<object>} arr array of objects to iterate over
 * @param {string} key object's property to average
 * @returns {number} the average of the given key property
 */
const getAverage = (arr, key) => {
  if (!Array.isArray(arr)) return 0
  return sumBy(arr, key) / arr.length
}

export default getAverage
