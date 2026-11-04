const nf = new Intl.NumberFormat('th-TH')

export const fmtNumber = (n: number) => nf.format(n)

export const fmtPercent = (part: number, whole: number, digits = 2) =>
  whole === 0 ? '0%' : `${((part / whole) * 100).toFixed(digits)}%`

export const fmtThaiDate = (iso: string) =>
  new Date(iso).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
