const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('pt-BR')

export const formatBRL = (v: number) => brl.format(v)
export const formatKm = (v: number) => `${num.format(v)} km`
export const parseNumero = (s: string) => {
  const n = Number(s.replace(/\D/g, ''))
  return Number.isFinite(n) ? n : 0
}
