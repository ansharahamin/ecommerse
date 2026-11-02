export function formatPrice(price, currency = 'PKR') {
  const amount = Number(price)
  if (!Number.isFinite(amount) || amount <= 0) return 'Price coming soon'

  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
