import { format } from 'date-fns'
import { getRequest } from './requests'
import { INSTRUMENTS_URL } from './apiEndpoints'

function isNotEmpty(obj: unknown) {
  return obj !== undefined && obj !== null && obj !== ''
}

export const stringifyRequestQuery = (values: {} = {}) => {
  const filter = values
    ? Object.entries(values as Object)
        .filter((obj) => isNotEmpty(obj[1]))
        .map((obj) => {
          return `${encodeURIComponent(obj[0])}=${encodeURIComponent(obj[1])}`
        })
        .join('&')
    : ''

  return filter
}

export const firstLetterUpperCase = (string: string) => {
  if (!string) return ''

  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const formatDate = (date: any) => {
  if (!date) return ''

  return format(date, 'do LLL, yyyy')
}

export const getInstrumentOptions = async () => {
  let initialCompanies = []
  if (localStorage.getItem('companies')) {
    initialCompanies = JSON.parse(localStorage.getItem('companies') || '[]')
  } else {
    initialCompanies = await getRequest(INSTRUMENTS_URL, { order: 'name' }).then((response) => {
      if (response?.data?.length && response?.data?.length > 0) {
        localStorage.setItem('companies', JSON.stringify(response?.data))
      }
      return response?.data || []
    })
  }

  const options = initialCompanies.map((company: any) => ({
    value: company.name,
    label: company.name,
  }))

  return options
}

export const calculateExpenses = (metadata: any) => {
  return (metadata?.expenses?.charge || 0) + (metadata?.expenses?.commission || 0) + (metadata?.expenses?.tax || 0)
}

export const getPortfolioInstrumentTotal = (instrument: any) => {
  if (instrument?.instrument === 'CASH') {
    return instrument?.amount * instrument?.quantity - calculateExpenses(instrument?.metadata)
  } else {
    return instrument?.amount * instrument?.quantity + calculateExpenses(instrument?.metadata)
  }
}

export const getPortfolioInstrumentPercentage = (portfolioInstruments: any, instrument: any) => {
  let total = 0
  let percentage = 0
  portfolioInstruments?.forEach((item: any) => {
    total += getPortfolioInstrumentTotal(item)
  })
  percentage = (getPortfolioInstrumentTotal(instrument) / total) * 100

  return parseFloat(percentage.toFixed(2))
}

export const calculatePortfolioInstrumentNewQuantity = (type: string, newQuantity: number, currentQuantity: number) => {
  let quantity = currentQuantity
  if (type === 'buy') {
    quantity = currentQuantity + newQuantity
  }
  if (type === 'sell') {
    quantity = currentQuantity - newQuantity
  }
  return quantity
}

export const calculatePortfolioInstrumentNewAmount = (
  type: string,
  newAmount: number,
  currentAmount: number,
  newQuantity: number,
  currentQuantity: number,
) => {
  let amount = currentAmount
  if (type === 'deposit') {
    amount = currentAmount + newAmount
  }
  if (type === 'withdrawal') {
    amount = currentAmount - newAmount
  }
  if (type === 'buy') {
    amount = (currentAmount * currentQuantity + newAmount * newQuantity) / (currentQuantity + newQuantity)
  }
  return amount
}

export const getEpsColor = (value: number) => {
  if (value < 0) {
    return 'text-red-700'
  } else {
    return 'text-green-700'
  }
}

export const getPeColor = (value: number) => {
  if (value >= 12 && value <= 15) {
    return 'text-yellow-700'
  } else if (value > 15) {
    return 'text-red-700'
  } else {
    return 'text-green-700'
  }
}

export const getNavColor = (value: number) => {
  if (value < 0) {
    return 'text-red-700'
  } else {
    return 'text-green-700'
  }
}

export const getPriceNavColor = (value: number) => {
  if (value >= 1 && value <= 1.5) {
    return 'text-yellow-700'
  } else if (value > 1.5) {
    return 'text-red-700'
  } else {
    return 'text-green-700'
  }
}

console.log('Fixed Income/Cash', 'Equity', 'Alternate Investment')
console.log(
  'National Saving Certificate/Sonchoy Potro',
  'Treasury Bill/Bond',
  'Fixed Deposit Receipt',
  'Deposit Pension Scheme',
)
console.log('Stock/Mutual Fund(CE)', 'Mutual Fund(OE)')
console.log('Real Estate', 'Startup/SME')
console.log('Land', 'Plot', 'Flat')
