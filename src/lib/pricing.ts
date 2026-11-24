export type FaixaPreco = 'abaixo' | 'na-media' | 'acima' | 'indisponivel'

export interface ComparacaoPreco {
  faixa: FaixaPreco
  diferenca: number
  percentual: number
}

const LIMITE = 5 // %

export function comparaPreco(pedido: number, fipe?: number): ComparacaoPreco {
  if (!fipe || fipe <= 0) return { faixa: 'indisponivel', diferenca: 0, percentual: 0 }
  const diferenca = pedido - fipe
  const percentual = (diferenca / fipe) * 100
  const faixa: FaixaPreco =
    percentual < -LIMITE ? 'abaixo' : percentual > LIMITE ? 'acima' : 'na-media'
  return { faixa, diferenca, percentual }
}
