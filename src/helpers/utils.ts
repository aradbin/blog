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
  return string.charAt(0).toUpperCase() + string.slice(1)
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
