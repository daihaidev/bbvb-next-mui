import moment from 'moment'
import { groupBy } from 'lodash'
import { IntervalTypeEnum, DateFormatEnum } from '../views/Performance/constants'

/**
 * Filters array of objects by intervals (e.g. 5 months ago, 4 weeks ago, etc.) and
 * Creates an object composed of keys which has the same format as 'groupingFormat' and
 * the corresponding value of each key is an array of objects which 'createdAt' value is in
 * the same interval according to the 'groupingFormat'.
 * The order of grouped array of objects is determined by the order they occur in 'objects'.
 *
 * @param {number} nIntervals The longest time in the past. Only objects after nIntervals ago should pass the filter.
 * @param {IntervalTypeEnum} intervalType Type of interval (e.g. months, weeks, days)
 * @param {Array} objects array of objects
 * @param {DateFormatEnum} groupingFormat Date string used to group objects by.
 * @returns {Array} Returns the composed aggregate object.
 *
 * Usage:
 *    // Group all array of objects, which were created after 5 weeks ago, by week (keys have the same format as DateFormatEnum.WEEK)
 *    getGroupedObjectsByInterval(5, IntervalTypeEnum.WEEKS, assets, DateFormatEnum.WEEK)
 */
interface Obj {
  createdAt: string
}

interface GroupedObj {
  [key: string]: Obj[]
}

export const getGroupedObjectsByInterval = (
  nIntervals: number,
  intervalType: IntervalTypeEnum,
  objects: Obj[],
  groupingFormat: DateFormatEnum
): GroupedObj => {
  const nIntervalsAgo = moment().subtract(nIntervals, intervalType)
  const filteredObjects = objects?.filter(({ createdAt }) => nIntervalsAgo.isSameOrBefore(createdAt))

  return groupBy(filteredObjects, ({ createdAt }) => {
    return moment(createdAt).format(groupingFormat)
  })
}
