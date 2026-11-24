import { buscaValorFipe, getMarcas, getModelos, nomeMarca, estimaValor } from './fipeService'

const resp = (body: unknown, ok = true) =>
  Promise.resolve({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(body) } as Response)

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('nomeMarca', () => {
  it('remove prefixos da tabela FIPE', () => {
    expect(nomeMarca('GM - Chevrolet')).toBe('Chevrolet')
    expect(nomeMarca('VW - VolksWagen')).toBe('Volkswagen')
    expect(nomeMarca('Fiat')).toBe('Fiat')
  })
})

describe('getMarcas', () => {
  it('usa a BrasilAPI quando disponível', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resp([{ nome: 'Fiat', valor: '21' }])))
    const r = await getMarcas()
    expect(r.origem).toBe('brasilapi')
    expect(r.itens).toEqual([{ nome: 'Fiat', codigo: '21' }])
  })
  it('cai para o catálogo local quando a API falha', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('rede'))))
    const r = await getMarcas()
    expect(r.origem).toBe('catalogo')
    expect(r.itens.length).toBeGreaterThan(5)
  })
})

describe('getModelos', () => {
  it('lista modelos da BrasilAPI', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resp([{ modelo: 'Polo 1.0', valor: '8070' }])))
    const r = await getModelos({ nome: 'VW - VolksWagen', codigo: '59' })
    expect(r.origem).toBe('brasilapi')
    expect(r.itens[0].nome).toBe('Polo 1.0')
  })
  it('sem API, usa modelos do catálogo da marca', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resp({}, false)))
    const r = await getModelos({ nome: 'VW - VolksWagen', codigo: '59' })
    expect(r.origem).toBe('catalogo')
    expect(r.itens.map(m => m.nome)).toContain('Polo')
  })
})

describe('buscaValorFipe', () => {
  it('retorna valor oficial da BrasilAPI para o ano pedido', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resp([
      { valor: 'R$ 69.149,00', anoModelo: 2022, mesReferencia: 'novembro de 2026', codigoFipe: '005479-8' },
      { valor: 'R$ 60.000,00', anoModelo: 2021, mesReferencia: 'novembro de 2026', codigoFipe: '005479-8' },
    ])))
    const r = await buscaValorFipe({ marca: 'VW - VolksWagen', modelo: 'Polo', ano: 2022 })
    expect(r).toMatchObject({ valor: 69149, origem: 'fipe', codigoFipe: '005479-8' })
  })
  it('API fora do ar: usa o catálogo e marca como estimado', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resp({ message: 'indisponível' }, false)))
    const r = await buscaValorFipe({ marca: 'VW - VolksWagen', modelo: 'Polo', ano: 2022 })
    expect(r?.origem).toBe('estimado')
    expect(r?.valor).toBeGreaterThan(30000)
  })
  it('modelo desconhecido e sem código: sem referência', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resp({}, false)))
    const r = await buscaValorFipe({ marca: 'Marca X', modelo: 'Modelo Y', ano: 2022 })
    expect(r).toBeNull()
  })
  it('modelo desconhecido mas com código informado consulta a API', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resp([{ valor: 'R$ 100.000,00', anoModelo: 2023, mesReferencia: 'novembro de 2026', codigoFipe: '111111-1' }])))
    const r = await buscaValorFipe({ marca: 'Marca X', modelo: 'Modelo Y', ano: 2023, codigoFipe: '111111-1' })
    expect(r).toMatchObject({ valor: 100000, origem: 'fipe' })
  })
})

describe('estimaValor', () => {
  it('usa o valor exato quando existe', () => {
    expect(estimaValor({ 2022: 60000, 2023: 65000 }, 2022)).toBe(60000)
  })
  it('estima por depreciação a partir do ano mais próximo', () => {
    const v = estimaValor({ 2022: 60000 }, 2020)!
    expect(v).toBeLessThan(60000)
    expect(v).toBeGreaterThan(40000)
  })
  it('sem dados retorna undefined', () => {
    expect(estimaValor({}, 2020)).toBeUndefined()
  })
})
