import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../services/store'
import { formatBRL } from '../lib/format'
import { FipeBadge } from '../components/FipeBadge'

export function MeusAnuncios() {
  const { usuario, anuncios, alternarPausa, removerAnuncio } = useStore()
  if (!usuario) return <Navigate to="/entrar?next=/meus-anuncios" replace />
  const meus = anuncios.filter(a => a.donoId === usuario.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus anúncios</h1>
        <Link to="/anunciar" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Novo anúncio</Link>
      </div>
      {meus.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold">Você ainda não anunciou nenhum veículo.</p>
          <Link to="/anunciar" className="mt-3 inline-block text-brand-600 underline">Criar meu primeiro anúncio</Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {meus.map(a => (
            <li key={a.id} className="flex flex-col gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200 sm:flex-row sm:items-center">
              <img src={a.fotos[0]} alt="" className="h-28 w-full rounded-xl object-cover sm:w-44" />
              <div className="flex-1">
                <Link to={`/anuncio/${a.id}`} className="font-semibold hover:underline">{a.marca} {a.modelo} {a.ano}</Link>
                <p className="text-lg font-bold text-brand-700">{formatBRL(a.preco)}</p>
                <div className="mt-1 flex items-center gap-2">
                  <FipeBadge preco={a.preco} fipe={a.valorFipe} />
                  <span className={`text-xs font-medium ${a.status === 'ativo' ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {a.status === 'ativo' ? '● Ativo' : '● Pausado'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => alternarPausa(a.id)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
                  {a.status === 'ativo' ? 'Pausar' : 'Reativar'}
                </button>
                <button
                  onClick={() => { if (confirm('Excluir este anúncio?')) removerAnuncio(a.id) }}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
