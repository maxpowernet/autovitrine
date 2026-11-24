export type Condicao = 'novo' | 'usado'
export type Cambio = 'Manual' | 'Automático' | 'CVT' | 'Automatizado'
export type Combustivel = 'Flex' | 'Gasolina' | 'Diesel' | 'Elétrico' | 'Híbrido'

export interface Anuncio {
  id: string
  donoId: string
  condicao: Condicao
  marca: string
  modelo: string
  versao?: string
  ano: number
  km: number
  cor: string
  cambio: Cambio
  combustivel: Combustivel
  cidade: string
  uf: string
  preco: number
  valorFipe?: number
  fotos: string[]
  descricao: string
  opcionais: string[]
  status: 'ativo' | 'pausado'
  criadoEm: string
}

export interface Usuario {
  id: string
  nome: string
  email: string
  telefone: string
  cidade: string
  uf: string
}

export interface Filtros {
  busca: string
  condicao: '' | Condicao
  marca: string
  precoMin?: number
  precoMax?: number
  anoMin?: number
  kmMax?: number
  cambio: '' | Cambio
  combustivel: '' | Combustivel
  uf: string
  ordem: 'recentes' | 'menor-preco' | 'maior-preco' | 'menor-km' | 'mais-novos'
}
