import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../services/store'
import { formatBRL, formatKm } from '../lib/format'
import { comparaPreco } from '../lib/pricing'
import { FipeBadge } from '../components/FipeBadge'

export function Detalhe() {
  const { id } = useParams()
  const { anuncios, vendedor } = useStore()
  const [foto, setFoto] = useState(0)
  const a = anuncios.find(x => x.id === id)

  if (!a) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-lg font-semibold">Anúncio não encontrado.</p>
        <Link to="/" className="mt-4 inline-block text-brand-600 underline">Voltar para a loja</Link>
      </div>
    )
  }

  const v = vendedor(a.donoId)
  const cmp = comparaPreco(a.preco, a.valorFipe)
  const telefone = v?.telefone.replace(/\D/g, '') ?? ''
  const mensagem = encodeURIComponent(`Olá! Vi o anúncio do ${a.marca} ${a.modelo} ${a.ano} no AutoVitrine.`)
  const ficha: [string, string][] = [
    ['Ano', String(a.ano)], ['Quilometragem', formatKm(a.km)], ['Câmbio', a.cambio], ['Combustível', a.combustivel],
    ['Cor', a.cor], ['Condição', a.condicao === 'novo' ? 'Novo (0 km)' : 'Usado'], ['Local', `${a.cidade} - ${a.uf}`],
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Link to="/" className="text-sm text-brand-600 hover:underline">← Voltar para a loja</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
            <img src={a.fotos[foto]} alt={`${a.marca} ${a.modelo} - foto ${foto + 1}`} className="aspect-[16/10] w-full object-cover" />
            {a.fotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {a.fotos.map((f, i) => (
                  <button key={i} onClick={() => setFoto(i)} aria-label={`Ver foto ${i + 1}`}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 ${i === foto ? 'ring-brand-500' : 'ring-transparent'}`}>
                    <img src={f} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="mb-3 text-lg font-bold">Ficha técnica</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {ficha.map(([k, val]) => (
                <div key={k}><dt className="text-xs uppercase tracking-wide text-slate-500">{k}</dt><dd className="font-medium">{val}</dd></div>
              ))}
            </dl>
          </section>

          {a.opcionais.length > 0 && (
            <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <h2 className="mb-3 text-lg font-bold">Opcionais</h2>
              <ul className="flex flex-wrap gap-2">
                {a.opcionais.map(o => <li key={o} className="rounded-full bg-slate-100 px-3 py-1 text-sm">{o}</li>)}
              </ul>
            </section>
          )}

          {a.descricao && (
            <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <h2 className="mb-2 text-lg font-bold">Descrição</h2>
              <p className="whitespace-pre-line text-slate-700">{a.descricao}</p>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h1 className="text-xl font-bold">{a.marca} {a.modelo}</h1>
            {a.versao && <p className="text-sm text-slate-500">{a.versao}</p>}
            <p className="mt-3 text-3xl font-extrabold text-brand-700">{formatBRL(a.preco)}</p>
            <div className="mt-2"><FipeBadge preco={a.preco} fipe={a.valorFipe} detalhado /></div>
            {a.valorFipe && (
              <p className="mt-3 text-sm text-slate-600">
                Tabela FIPE: <strong>{formatBRL(a.valorFipe)}</strong>
                {cmp.faixa !== 'na-media' && <> — anunciado {formatBRL(Math.abs(cmp.diferenca))} {cmp.diferenca < 0 ? 'abaixo' : 'acima'}.</>}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-500">Vendedor</p>
            <p className="font-semibold">{v?.nome ?? 'Vendedor particular'}</p>
            <p className="text-sm text-slate-500">{a.cidade} - {a.uf}</p>
            {v ? (
              <div className="mt-4 grid gap-2">
                <a href={`https://wa.me/55${telefone}?text=${mensagem}`} target="_blank" rel="noreferrer"
                  className="rounded-lg bg-emerald-600 py-2.5 text-center font-semibold text-white hover:bg-emerald-700">
                  Chamar no WhatsApp
                </a>
                <a href={`tel:+55${telefone}`} className="rounded-lg border border-slate-300 py-2.5 text-center font-medium hover:bg-slate-50">
                  Ligar {v.telefone}
                </a>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Contato indisponível neste navegador (dado de demonstração).</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
