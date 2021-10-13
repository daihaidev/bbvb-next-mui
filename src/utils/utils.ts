const currencyOptions = { style: 'currency', currency: 'USD' }
const currencyFormat = new Intl.NumberFormat('en-US', currencyOptions)

export const formatCurrency = (value: number) => {
  return currencyFormat.format(value)
}

export const duplicateArr = (arr, times) =>
  Array(times)
    .fill([...arr])
    .reduce((a, b) => a.concat(b))
