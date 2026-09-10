const philippinePesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
})

export const formatOrderCurrency = (amount: number): string =>
  philippinePesoFormatter.format(amount)
