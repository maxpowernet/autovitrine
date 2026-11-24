import type { Anuncio, Filtros } from '../types'

export const FILTROS_VAZIOS: Filtros = {
  busca: '', condicao: '', marca: '', cambio: '', combustivel: '', uf: '', ordem: 'recentes',
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function aplicaFiltros(lista: Anuncio[], f: Filtros): Anuncio[] {
  const termos = norm(f.busca).split(/\s+/).filter(Boolean)
  const out = lista.filter(a => {
    if (a.status !== 'ativo') return false
    if (termos.length) {
      const alvo = norm(`${a.marca} ${a.modelo} ${a.versao ?? ''} ${a.cor} ${a.cidade}`)
      if (!termos.every(t => alvo.includes(t))) return false
    }
    if (f.condicao && a.condicao !== f.condicao) return false
    if (f.marca && a.marca !== f.marca) return false
    if (f.precoMin != null && a.preco < f.precoMin) return false
    if (f.precoMax != null && a.preco > f.precoMax) return false
    if (f.anoMin != null && a.ano < f.anoMin) return false
    if (f.kmMax != null && a.km > f.kmMax) return false
    if (f.cambio && a.cambio !== f.cambio) return false
    if (f.combustivel && a.combustivel !== f.combustivel) return false
    if (f.uf && a.uf !== f.uf) return false
    return true
  })
  const cmp: Record<Filtros['ordem'], (a: Anuncio, b: Anuncio) => number> = {
    'recentes': (a, b) => b.criadoEm.localeCompare(a.criadoEm),
    'menor-preco': (a, b) => a.preco - b.preco,
    'maior-preco': (a, b) => b.preco - a.preco,
    'menor-km': (a, b) => a.km - b.km,
    'mais-novos': (a, b) => b.ano - a.ano,
  }
  return out.sort(cmp[f.ordem])
}
