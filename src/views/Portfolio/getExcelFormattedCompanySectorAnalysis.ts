import printPercentage from '../../utils/printPercentage'

const getExcelFormattedCompanySectorAnalysis = (items) => {
  return items?.map((item) => {
    const { sector, port, bench, active, absReturns } = item

    return {
      'Company Sector': sector,
      'Portfolio (%)': printPercentage(port),
      'Benchmark (%)': printPercentage(bench),
      'Active (%)': printPercentage(active),
      'Portfolio Returns (%)': printPercentage(absReturns),
    }
  })
}

export default getExcelFormattedCompanySectorAnalysis
