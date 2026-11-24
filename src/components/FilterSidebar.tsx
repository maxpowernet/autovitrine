import type { Filtros } from '../types'
import { CAMBIOS, COMBUSTIVEIS, UFS } from '../data/constantes'
import { FILTROS_VAZIOS } from '../lib/filters'
import { parseNumero } from '../lib/format'

interface Props {
  filtros: Filtros
  onChange: (f: Filtros) => void
  marcas: string[]
}

const campo = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
const rotulo = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500'

const numOuUndef = (s: string) => (s.trim() === '' ? undefined : parseNumero(s))

export function FilterSidebar({ filtros, onChange, marcas }: Props) {
  const set = <K extends keyof Filtros>(k: K, v: Filtros[K]) => onChange({ ...filtros, [k]: v })
  return (
    <div className="space-y-4">
      <div>
        <span className={rotulo}>Condição</span>
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 text-sm">
          {([['', 'Todos'], ['novo', 'Novos'], ['usado', 'Usados']] as const).map(([v, t]) => (
            <button
              key={v}
              type="button"
              onClick={() => set('condicao', v)}
              className={`rounded-md py-1.5 font-medium ${filtros.condicao === v ? 'bg-white shadow-sm' : 'text-slate-600'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={rotulo} htmlFor="f-marca">Marca</label>
        <select id="f-marca" className={campo} value={filtros.marca} onChange={e => set('marca', e.target.value)}>
          <option value="">Todas</option>
          {marcas.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <span className={rotulo}>Preço (R$)</span>
        <div className="grid grid-cols-2 gap-2">
          <input aria-label="Preço mínimo" inputMode="numeric" placeholder="Mín." className={campo}
            value={filtros.precoMin ?? ''} onChange={e => set('precoMin', numOuUndef(e.target.value))} />
          <input aria-label="Preço máximo" inputMode="numeric" placeholder="Máx." className={campo}
            value={filtros.precoMax ?? ''} onChange={e => set('precoMax', numOuUndef(e.target.value))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={rotulo} htmlFor="f-ano">Ano a partir de</label>
          <input id="f-ano" inputMode="numeric" placeholder="2020" className={campo}
            value={filtros.anoMin ?? ''} onChange={e => set('anoMin', numOuUndef(e.target.value))} />
        </div>
        <div>
          <label className={rotulo} htmlFor="f-km">Km até</label>
          <input id="f-km" inputMode="numeric" placeholder="50000" className={campo}
            value={filtros.kmMax ?? ''} onChange={e => set('kmMax', numOuUndef(e.target.value))} />
        </div>
      </div>
      <div>
        <label className={rotulo} htmlFor="f-cambio">Câmbio</label>
        <select id="f-cambio" className={campo} value={filtros.cambio} onChange={e => set('cambio', e.target.value as Filtros['cambio'])}>
          <option value="">Qualquer</option>
          {CAMBIOS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className={rotulo} htmlFor="f-comb">Combustível</label>
        <select id="f-comb" className={campo} value={filtros.combustivel} onChange={e => set('combustivel', e.target.value as Filtros['combustivel'])}>
          <option value="">Qualquer</option>
          {COMBUSTIVEIS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className={rotulo} htmlFor="f-uf">Estado</label>
        <select id="f-uf" className={campo} value={filtros.uf} onChange={e => set('uf', e.target.value)}>
          <option value="">Todos</option>
          {UFS.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
      <button type="button" onClick={() => onChange({ ...FILTROS_VAZIOS, busca: filtros.busca, ordem: filtros.ordem })}
        className="w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
        Limpar filtros
      </button>
    </div>
  )
}
