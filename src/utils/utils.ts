export const secret = 'secret ingredient'

export const timer = (s: number) =>
  new Promise(res => setTimeout(res, s * 1000))
