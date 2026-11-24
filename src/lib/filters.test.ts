import { aplicaFiltros, FILTROS_VAZIOS } from './filters'
import type { Anuncio } from '../types'

const base: Anuncio = {
  id: '1', donoId: 'u', condicao: 'usado', marca: 'Chevrolet', modelo: 'Onix', ano: 2020, km: 40000,
  cor: 'Branco', cambio: 'Manual', combustivel: 'Flex', cidade: 'Recife', uf: 'PE', preco: 60000,
  fotos: [], descricao: '', opcionais: [], status: 'ativo', criadoEm: '2026-01-01',
}
const lista: Anuncio[] = [
  base,
  { ...base, id: '2', condicao: 'novo', marca: 'Fiat', modelo: 'Strada', ano: 2027, km: 0, preco: 130000, uf: 'SP', criadoEm: '2026-03-01' },
  { ...base, id: '3', marca: 'Volkswagen', modelo: 'Polo', ano: 2022, km: 20000, preco: 90000, cambio: 'Automático', criadoEm: '2026-02-01' },
  { ...base, id: '4', status: 'pausado' },
]
const ids = (l: Anuncio[]) => l.map(a => a.id)

describe('aplicaFiltros', () => {
  it('oculta anúncios pausados', () => {
    expect(ids(aplicaFiltros(lista, FILTROS_VAZIOS))).not.toContain('4')
  })
  it('busca por texto em marca e modelo, sem acento e sem diferenciar caixa', () => {
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, busca: 'STRADA' }))).toEqual(['2'])
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, busca: 'volks polo' }))).toEqual(['3'])
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, busca: 'volks strada' }))).toEqual([])
  })
  it('filtra por condição, faixa de preço, ano, km, câmbio e UF', () => {
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, condicao: 'novo' }))).toEqual(['2'])
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, precoMin: 80000, precoMax: 100000 }))).toEqual(['3'])
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, anoMin: 2022 })).sort()).toEqual(['2', '3'])
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, kmMax: 30000 })).sort()).toEqual(['2', '3'])
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, cambio: 'Automático' }))).toEqual(['3'])
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, uf: 'SP' }))).toEqual(['2'])
  })
  it('ordena', () => {
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, ordem: 'menor-preco' }))).toEqual(['1', '3', '2'])
    expect(ids(aplicaFiltros(lista, { ...FILTROS_VAZIOS, ordem: 'recentes' }))).toEqual(['2', '3', '1'])
  })
})
