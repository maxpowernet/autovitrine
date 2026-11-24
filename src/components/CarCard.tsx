import { Link } from 'react-router-dom'
import type { Anuncio } from '../types'
import { formatBRL, formatKm } from '../lib/format'
import { FipeBadge } from './FipeBadge'

export function CarCard({ a }: { a: Anuncio }) {
  return (
    <Link
      to={`/anuncio/${a.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img src={a.fotos[0]} alt={`${a.marca} ${a.modelo}`} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
        <span className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${a.condicao === 'novo' ? 'bg-brand-600 text-white' : 'bg-slate-900/80 text-white'}`}>
          {a.condicao === 'novo' ? '0 km' : 'Usado'}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-semibold leading-tight">{a.marca} {a.modelo}</h3>
          {a.versao && <p className="line-clamp-1 text-xs text-slate-500">{a.versao}</p>}
        </div>
        <p className="text-sm text-slate-600">{a.ano} · {formatKm(a.km)} · {a.cambio}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-1">
          <p className="text-xl font-bold text-brand-700">{formatBRL(a.preco)}</p>
          <FipeBadge preco={a.preco} fipe={a.valorFipe} />
        </div>
        <p className="text-xs text-slate-500">{a.cidade} - {a.uf}</p>
      </div>
    </Link>
  )
}
