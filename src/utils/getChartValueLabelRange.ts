// Based on the code from this stackoverflow thread:
// https://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks/16363437

/**
 * Returns a "nice" number approximately equal to range Rounds
 * the number if round = true Takes the ceiling if round = false.
 *
 *  localRange the data range
 *  round whether to round the result
 *  a "nice" number to be used for the data range
 */
function niceNum(localRange, round) {
  /** exponent of localRange */
  const exponent = Math.floor(Math.log10(localRange))

  /** fractional part of localRange */
  const exponentMultiplier = 10 ** exponent
  const fraction = localRange / exponentMultiplier

  /** return nice, rounded fraction */
  if (round) {
    if (fraction < 1.5) return 1 * exponentMultiplier
    if (fraction < 3) return 2 * exponentMultiplier
    if (fraction < 7) return 5 * exponentMultiplier
    return 10 * exponentMultiplier
  }
  if (fraction <= 1) return 1 * exponentMultiplier
  if (fraction <= 2) return 2 * exponentMultiplier
  if (fraction <= 5) return 5 * exponentMultiplier
  return 10 * exponentMultiplier
}

/**
 * Calculate and update values for tick spacing and nice
 * minimum and maximum data points on the axis.
 */
function getChartValueLabelRange(minPoint, maxPoint, maxTicks = 10) {
  const range = niceNum(maxPoint - minPoint, false)
  const tickSpacing = niceNum(range / (maxTicks - 1), true)
  const niceMin = Math.floor(minPoint / tickSpacing) * tickSpacing
  const niceMax = Math.ceil(maxPoint / tickSpacing) * tickSpacing

  return {
    tickSpacing,
    roundedMinimum: niceMin,
    roundedMaximum: niceMax,
  }
}

export default getChartValueLabelRange
