import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../services/store'
import { aplicaFiltros, FILTROS_VAZIOS } from '../lib/filters'
import type { Filtros } from '../types'
import { CarCard } from '../components/CarCard'
import { FilterSidebar } from '../components/FilterSidebar'

export function Loja() {
  const { anuncios } = useStore()
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS)
  const [abertoMobile, setAbertoMobile] = useState(false)

  const marcas = useMemo(() => [...new Set(anuncios.map(a => a.marca))].sort(), [anuncios])
  const lista = useMemo(() => aplicaFiltros(anuncios, filtros), [anuncios, filtros])

  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
          <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Encontre seu próximo carro, novo ou usado.
          </h1>
          <p className="mt-2 max-w-xl text-brand-100">Anúncios de todo o Brasil, com preço comparado à tabela FIPE.</p>
          <form className="mt-6 flex max-w-2xl gap-2" onSubmit={e => e.preventDefault()} role="search">
            <input
              aria-label="Buscar veículo"
              value={filtros.busca}
              onChange={e => setFiltros({ ...filtros, busca: e.target.value })}
              placeholder="Buscar por marca, modelo, cor ou cidade…"
              className="min-w-0 flex-1 rounded-xl border-0 bg-white px-4 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-white/30"
            />
          </form>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <button
            type="button"
            className="mb-3 w-full rounded-lg border border-slate-300 bg-white py-2 text-sm font-medium lg:hidden"
            aria-expanded={abertoMobile}
            onClick={() => setAbertoMobile(v => !v)}
          >
            {abertoMobile ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
          <div className={`${abertoMobile ? 'block' : 'hidden'} rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:block`}>
            <FilterSidebar filtros={filtros} onChange={setFiltros} marcas={marcas} />
          </div>
        </aside>

        <section aria-live="polite">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600">
              <strong className="text-slate-900">{lista.length}</strong> {lista.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
            </p>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Ordenar por
              <select
                value={filtros.ordem}
                onChange={e => setFiltros({ ...filtros, ordem: e.target.value as Filtros['ordem'] })}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
              >
                <option value="recentes">Mais recentes</option>
                <option value="menor-preco">Menor preço</option>
                <option value="maior-preco">Maior preço</option>
                <option value="menor-km">Menor km</option>
                <option value="mais-novos">Mais novos</option>
              </select>
            </label>
          </div>

          {lista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-semibold">Nenhum veículo com esses filtros.</p>
              <p className="mt-1 text-sm text-slate-500">Tente ampliar a busca ou limpar os filtros.</p>
              <button onClick={() => setFiltros(FILTROS_VAZIOS)} className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                Limpar tudo
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {lista.map(a => <CarCard key={a.id} a={a} />)}
            </div>
          )}

          <div className="mt-10 rounded-2xl bg-slate-900 p-6 text-white sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-bold">Quer vender o seu carro?</p>
              <p className="text-sm text-slate-300">Cadastre em minutos e veja na hora quanto a FIPE paga por ele.</p>
            </div>
            <Link to="/anunciar" className="mt-4 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 sm:mt-0">
              Anunciar agora
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
