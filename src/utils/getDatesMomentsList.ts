import moment from 'moment'
import { IntervalTypeEnum } from '../views/Performance/constants'

/**
 * Creates a new array of moment object in intervals, starting from the longest 'nIntervals' (e.g. 5 months ago)
 * upto the current interval (e.g. today, current month, etc.) depending on the
 * 'intervalType'.
 *
 * @param {number} nIntervals The longest time in the past which the first moment object should become.
 * @param {IntervalTypeEnum} intervalType Type of interval (e.g. months, weeks, days).
 * @returns {Array} Returns a new array of moment object.
 *
 * Usage:
 *
 *    // Returns an array of moment object with the time:
 *    //   [3 months ago, 2 months ago, 1 month ago, current month]
 *    getSortedOrdersByInterval(3, DateFormatEnum.BY_MONTH)
 */
export const getDatesMomentsList = (nIntervals: number, intervalType: IntervalTypeEnum) =>
  Array.from({ length: nIntervals + 1 }, (val, index) => moment().subtract(nIntervals - index, intervalType))
