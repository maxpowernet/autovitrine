import { comparaPreco } from './pricing'

describe('comparaPreco', () => {
  it('classifica abaixo da FIPE (mais de 5% abaixo)', () => {
    const r = comparaPreco(90000, 100000)
    expect(r.faixa).toBe('abaixo')
    expect(r.diferenca).toBe(-10000)
    expect(r.percentual).toBeCloseTo(-10)
  })
  it('classifica na média dentro de ±5%', () => {
    expect(comparaPreco(104000, 100000).faixa).toBe('na-media')
    expect(comparaPreco(95000, 100000).faixa).toBe('na-media')
    expect(comparaPreco(105000, 100000).faixa).toBe('na-media')
  })
  it('classifica acima da FIPE (mais de 5% acima)', () => {
    expect(comparaPreco(110000, 100000).faixa).toBe('acima')
  })
  it('sem valor FIPE retorna indisponivel', () => {
    expect(comparaPreco(50000, undefined).faixa).toBe('indisponivel')
    expect(comparaPreco(50000, 0).faixa).toBe('indisponivel')
  })
})
