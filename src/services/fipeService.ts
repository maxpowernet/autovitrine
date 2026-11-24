import { FIPE_CATALOGO, MES_REFERENCIA_CATALOGO } from '../data/fipeCatalogo'

const API = 'https://brasilapi.com.br/api/fipe'
const TIMEOUT_MS = 6000
const CACHE_PREFIX = 'av:fipe:'

export interface ItemLista {
  nome: string
  codigo?: string
}
export interface Lista {
  itens: ItemLista[]
  origem: 'brasilapi' | 'catalogo'
}
export interface ValorFipe {
  valor: number
  /** fipe = consulta oficial na BrasilAPI; estimado = catálogo local (API indisponível) */
  origem: 'fipe' | 'estimado'
  mesReferencia: string
  codigoFipe?: string
  versao?: string
}
export interface ConsultaFipe {
  marca: string
  modelo: string
  ano: number
  codigoFipe?: string
}

export function nomeMarca(fipeNome: string): string {
  const n = fipeNome.replace(/^(GM|VW) - /i, '').trim()
  return n.toLowerCase() === 'volkswagen' ? 'Volkswagen' : n
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

async function getJson<T>(url: string): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const r = await fetch(url, { signal: ctrl.signal })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return (await r.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

function lerCache<T>(chave: string): T | undefined {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + chave)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}
function gravarCache(chave: string, valor: unknown) {
  try {
    localStorage.setItem(CACHE_PREFIX + chave, JSON.stringify(valor))
  } catch {
    /* cota cheia: ignora */
  }
}

export async function getMarcas(): Promise<Lista> {
  const cache = lerCache<ItemLista[]>('marcas')
  if (cache) return { itens: cache, origem: 'brasilapi' }
  try {
    const dados = await getJson<{ nome: string; valor: string }[]>(`${API}/marcas/v1/carros`)
    const itens = dados.map(d => ({ nome: d.nome, codigo: d.valor }))
    gravarCache('marcas', itens)
    return { itens, origem: 'brasilapi' }
  } catch {
    const nomes = [...new Set(FIPE_CATALOGO.map(c => c.marca))].sort()
    return { itens: nomes.map(nome => ({ nome })), origem: 'catalogo' }
  }
}

export async function getModelos(marca: ItemLista): Promise<Lista> {
  const doCatalogo = (): Lista => ({
    itens: FIPE_CATALOGO.filter(c => c.marca === marca.nome).map(c => ({ nome: c.modelo })),
    origem: 'catalogo',
  })
  if (!marca.codigo) return doCatalogo()
  const chave = `modelos:${marca.codigo}`
  const cache = lerCache<ItemLista[]>(chave)
  if (cache) return { itens: cache, origem: 'brasilapi' }
  try {
    const dados = await getJson<{ modelo: string; valor: string }[]>(`${API}/veiculos/v1/carros/${marca.codigo}`)
    const itens = dados.map(d => ({ nome: d.modelo, codigo: d.valor }))
    gravarCache(chave, itens)
    return { itens, origem: 'brasilapi' }
  } catch {
    return doCatalogo()
  }
}

/** Valor para um ano a partir de pontos conhecidos: usa o ano exato ou deprecia ~6% ao ano a partir do mais próximo. */
export function estimaValor(valores: Record<number, number>, ano: number): number | undefined {
  if (valores[ano]) return valores[ano]
  const anos = Object.keys(valores).map(Number)
  if (!anos.length) return undefined
  const proximo = anos.reduce((a, b) => (Math.abs(b - ano) < Math.abs(a - ano) ? b : a))
  const delta = proximo - ano // >0: carro mais velho que a referência
  const fator = Math.pow(0.94, delta)
  return Math.round((valores[proximo] * fator) / 100) * 100
}

function acharNoCatalogo(marca: string, modelo: string) {
  const m = norm(modelo)
  const candidatos = FIPE_CATALOGO.filter(c => norm(c.marca) === norm(marca) || norm(nomeMarca(c.marca)) === norm(nomeMarca(marca)))
  // O modelo da lista da FIPE começa com o nome da família (ex.: "Polo 1.0 Flex" -> "Polo").
  return candidatos
    .filter(c => m === norm(c.modelo) || m.startsWith(norm(c.modelo) + ' '))
    .sort((a, b) => b.modelo.length - a.modelo.length)[0]
}

function parseValor(s: string | number): number {
  if (typeof s === 'number') return s
  return Number(s.replace(/[^\d,]/g, '').replace(',', '.')) || 0
}

interface PrecoApi {
  valor: string | number
  anoModelo: number | string
  mesReferencia: string
  codigoFipe: string
}

export async function buscaValorFipe(q: ConsultaFipe): Promise<ValorFipe | null> {
  const item = acharNoCatalogo(q.marca, q.modelo)
  const codigo = q.codigoFipe?.trim() || item?.codigoFipe

  if (codigo) {
    try {
      const lista = await getJson<PrecoApi[]>(`${API}/preco/v1/${encodeURIComponent(codigo)}`)
      const achou = lista.find(p => Number(p.anoModelo) === q.ano)
      if (achou) {
        return {
          valor: parseValor(achou.valor),
          origem: 'fipe',
          mesReferencia: achou.mesReferencia,
          codigoFipe: achou.codigoFipe,
          versao: item?.versao,
        }
      }
    } catch {
      /* cai para o catálogo */
    }
  }

  if (item) {
    const valor = estimaValor(item.valores, q.ano)
    if (valor) {
      return {
        valor,
        origem: 'estimado',
        mesReferencia: MES_REFERENCIA_CATALOGO,
        codigoFipe: item.codigoFipe,
        versao: item.versao,
      }
    }
  }
  return null
}
