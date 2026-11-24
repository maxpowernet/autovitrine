import { comparaPreco, type FaixaPreco } from '../lib/pricing'
import { formatBRL } from '../lib/format'

const ESTILO: Record<FaixaPreco, { texto: string; classe: string }> = {
  'abaixo': { texto: 'Abaixo da FIPE', classe: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20' },
  'na-media': { texto: 'Na média da FIPE', classe: 'bg-sky-100 text-sky-800 ring-sky-600/20' },
  'acima': { texto: 'Acima da FIPE', classe: 'bg-amber-100 text-amber-800 ring-amber-600/20' },
  'indisponivel': { texto: 'Sem referência FIPE', classe: 'bg-slate-100 text-slate-600 ring-slate-500/20' },
}

export function FipeBadge({ preco, fipe, detalhado = false }: { preco: number; fipe?: number; detalhado?: boolean }) {
  const c = comparaPreco(preco, fipe)
  const e = ESTILO[c.faixa]
  const pct = Math.abs(Math.round(c.percentual))
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${e.classe}`}>
      {e.texto}
      {detalhado && c.faixa !== 'indisponivel' && c.faixa !== 'na-media' && (
        <span className="font-normal">· {pct}% ({formatBRL(Math.abs(c.diferenca))})</span>
      )}
    </span>
  )
}
