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
