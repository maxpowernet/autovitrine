import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../services/store'
import {
  buscaValorFipe, getMarcas, getModelos, nomeMarca,
  type ItemLista, type ValorFipe,
} from '../services/fipeService'
import { ANO_MAX, CAMBIOS, COMBUSTIVEIS, CORES, UFS } from '../data/constantes'
import { OPCIONAIS_PADRAO } from '../data/anuncios'
import { formatBRL, parseNumero } from '../lib/format'
import { comparaPreco } from '../lib/pricing'
import { lerImagem } from '../lib/imagem'
import type { Cambio, Combustivel, Condicao } from '../types'
import { FipeBadge } from '../components/FipeBadge'

const campo = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
const rotulo = 'mb-1 block text-sm font-medium'
const MAX_FOTOS = 10
const PASSOS = ['Veículo', 'Detalhes', 'Fotos', 'Preço']

type EstadoFipe = { estado: 'ocioso' } | { estado: 'carregando' } | { estado: 'ok'; dados: ValorFipe } | { estado: 'sem-referencia' }

export function Anunciar() {
  const { usuario, adicionarAnuncio } = useStore()
  const nav = useNavigate()
  const [passo, setPasso] = useState(0)

  const [condicao, setCondicao] = useState<Condicao>('usado')
  const [marcas, setMarcas] = useState<ItemLista[]>([])
  const [origemListas, setOrigemListas] = useState<'brasilapi' | 'catalogo'>('brasilapi')
  const [marca, setMarca] = useState<ItemLista | null>(null)
  const [modelos, setModelos] = useState<ItemLista[]>([])
  const [carregandoModelos, setCarregandoModelos] = useState(false)
  const [filtroModelo, setFiltroModelo] = useState('')
  const [modelo, setModelo] = useState('')
  const [ano, setAno] = useState(ANO_MAX - 3)
  const [codigoFipe, setCodigoFipe] = useState('')
  const [fipe, setFipe] = useState<EstadoFipe>({ estado: 'ocioso' })

  const [km, setKm] = useState('')
  const [cor, setCor] = useState('Branco')
  const [cambio, setCambio] = useState<Cambio>('Manual')
  const [combustivel, setCombustivel] = useState<Combustivel>('Flex')
  const [cidade, setCidade] = useState(usuario?.cidade ?? '')
  const [uf, setUf] = useState(usuario?.uf ?? 'SP')
  const [opcionais, setOpcionais] = useState<string[]>([])
  const [descricao, setDescricao] = useState('')

  const [fotos, setFotos] = useState<string[]>([])
  const [erroFotos, setErroFotos] = useState('')
  const [arrastando, setArrastando] = useState(false)

  const [preco, setPreco] = useState('')
  const [erroPublicar, setErroPublicar] = useState('')

  const anos = useMemo(() => {
    const min = condicao === 'novo' ? ANO_MAX - 1 : 1995
    return Array.from({ length: ANO_MAX - min + 1 }, (_, i) => ANO_MAX - i)
  }, [condicao])

  useEffect(() => {
    let vivo = true
    getMarcas().then(r => { if (vivo) { setMarcas(r.itens); setOrigemListas(r.origem) } })
    return () => { vivo = false }
  }, [])

  useEffect(() => {
    if (!marca) return
    let vivo = true
    setCarregandoModelos(true)
    getModelos(marca).then(r => {
      if (!vivo) return
      setModelos(r.itens)
      setCarregandoModelos(false)
    })
    return () => { vivo = false }
  }, [marca])

  useEffect(() => {
    if (!marca || !modelo || !ano) { setFipe({ estado: 'ocioso' }); return }
    let vivo = true
    setFipe({ estado: 'carregando' })
    const t = setTimeout(() => {
      buscaValorFipe({ marca: marca.nome, modelo, ano, codigoFipe: codigoFipe || undefined }).then(r => {
        if (vivo) setFipe(r ? { estado: 'ok', dados: r } : { estado: 'sem-referencia' })
      })
    }, 350)
    return () => { vivo = false; clearTimeout(t) }
  }, [marca, modelo, ano, codigoFipe])

  if (!usuario) return <Navigate to="/entrar?next=/anunciar" replace />

  const modelosFiltrados = modelos.filter(m => m.nome.toLowerCase().includes(filtroModelo.toLowerCase()))
  const valorFipe = fipe.estado === 'ok' ? fipe.dados.valor : undefined
  const precoNum = parseNumero(preco)

  const passoValido = [
    !!marca && !!modelo && !!ano,
    !!cidade.trim() && (condicao === 'novo' || km.trim() !== ''),
    fotos.length > 0,
    precoNum > 0,
  ][passo]

  async function adicionarFotos(arquivos: FileList | File[]) {
    setErroFotos('')
    const lista = Array.from(arquivos).slice(0, MAX_FOTOS - fotos.length)
    if (arquivos.length > lista.length) setErroFotos(`Máximo de ${MAX_FOTOS} fotos.`)
    const novas: string[] = []
    for (const f of lista) {
      try { novas.push(await lerImagem(f)) } catch { setErroFotos('Algum arquivo não é uma imagem válida e foi ignorado.') }
    }
    setFotos(atual => [...atual, ...novas])
  }

  const tornarCapa = (i: number) => setFotos(f => [f[i], ...f.filter((_, k) => k !== i)])
  const removerFoto = (i: number) => setFotos(f => f.filter((_, k) => k !== i))

  function publicar() {
    if (!marca) return
    const r = adicionarAnuncio({
      condicao,
      marca: nomeMarca(marca.nome),
      modelo,
      ano,
      km: condicao === 'novo' ? 0 : parseNumero(km),
      cor, cambio, combustivel, cidade: cidade.trim(), uf,
      preco: precoNum,
      valorFipe,
      fotos, descricao: descricao.trim(), opcionais,
    })
    if (!r.ok) return setErroPublicar('Não coube no armazenamento do navegador. Remova algumas fotos e tente de novo.')
    nav(`/anuncio/${r.id}`)
  }

  const cmp = comparaPreco(precoNum, valorFipe)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Anunciar veículo</h1>
      <ol className="mt-4 grid grid-cols-4 gap-2" aria-label="Etapas">
        {PASSOS.map((p, i) => (
          <li key={p} aria-current={i === passo ? 'step' : undefined}>
            <div className={`h-1.5 rounded-full ${i <= passo ? 'bg-brand-600' : 'bg-slate-200'}`} />
            <span className={`mt-1 block text-xs font-medium ${i === passo ? 'text-brand-700' : 'text-slate-500'}`}>{i + 1}. {p}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        {passo === 0 && (
          <div className="space-y-5">
            <div>
              <span className={rotulo}>O veículo é…</span>
              <div className="grid grid-cols-2 gap-2">
                {(['usado', 'novo'] as const).map(c => (
                  <button key={c} type="button" onClick={() => { setCondicao(c); setAno(c === 'novo' ? ANO_MAX : ANO_MAX - 3) }}
                    className={`rounded-xl border-2 py-3 font-semibold ${condicao === c ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200'}`}>
                    {c === 'novo' ? 'Novo (0 km)' : 'Usado'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="marca" className={rotulo}>Marca</label>
              <select id="marca" className={campo} value={marca?.nome ?? ''}
                onChange={e => { setMarca(marcas.find(m => m.nome === e.target.value) ?? null); setModelo(''); setModelos([]); setFiltroModelo('') }}>
                <option value="">Selecione a marca</option>
                {marcas.map(m => <option key={m.nome} value={m.nome}>{nomeMarca(m.nome)}</option>)}
              </select>
              {origemListas === 'catalogo' && (
                <p className="mt-1 text-xs text-amber-700">BrasilAPI indisponível agora: mostrando marcas do catálogo local.</p>
              )}
            </div>

            {marca && (
              <div>
                <label htmlFor="modelo-busca" className={rotulo}>Modelo {carregandoModelos && <span className="font-normal text-slate-400">(carregando…)</span>}</label>
                <input id="modelo-busca" className={`${campo} mb-2`} placeholder="Digite para filtrar (ex.: Polo)" value={filtroModelo} onChange={e => setFiltroModelo(e.target.value)} />
                <select id="modelo" aria-label="Modelo" size={5} className={campo} value={modelo} onChange={e => setModelo(e.target.value)}>
                  {modelosFiltrados.map(m => <option key={m.codigo ?? m.nome} value={m.nome}>{m.nome}</option>)}
                </select>
                {!carregandoModelos && modelosFiltrados.length === 0 && <p className="mt-1 text-sm text-slate-500">Nenhum modelo encontrado.</p>}
              </div>
            )}

            {modelo && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ano" className={rotulo}>Ano do modelo</label>
                  <select id="ano" className={campo} value={ano} onChange={e => setAno(Number(e.target.value))}>
                    {anos.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="cod" className={rotulo}>Código FIPE <span className="font-normal text-slate-400">(opcional)</span></label>
                  <input id="cod" className={campo} placeholder="000000-0" value={codigoFipe} onChange={e => setCodigoFipe(e.target.value)} />
                </div>
              </div>
            )}

            {modelo && <PainelFipe estado={fipe} ano={ano} />}
          </div>
        )}

        {passo === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {condicao === 'usado' && (
                <div>
                  <label htmlFor="km" className={rotulo}>Quilometragem</label>
                  <input id="km" inputMode="numeric" className={campo} placeholder="45000" value={km} onChange={e => setKm(String(parseNumero(e.target.value) || ''))} />
                </div>
              )}
              <div>
                <label htmlFor="cor" className={rotulo}>Cor</label>
                <select id="cor" className={campo} value={cor} onChange={e => setCor(e.target.value)}>{CORES.map(c => <option key={c}>{c}</option>)}</select>
              </div>
              <div>
                <label htmlFor="cambio" className={rotulo}>Câmbio</label>
                <select id="cambio" className={campo} value={cambio} onChange={e => setCambio(e.target.value as Cambio)}>{CAMBIOS.map(c => <option key={c}>{c}</option>)}</select>
              </div>
              <div>
                <label htmlFor="comb" className={rotulo}>Combustível</label>
                <select id="comb" className={campo} value={combustivel} onChange={e => setCombustivel(e.target.value as Combustivel)}>{COMBUSTIVEIS.map(c => <option key={c}>{c}</option>)}</select>
              </div>
              <div>
                <label htmlFor="cidade" className={rotulo}>Cidade</label>
                <input id="cidade" className={campo} value={cidade} onChange={e => setCidade(e.target.value)} />
              </div>
              <div>
                <label htmlFor="uf" className={rotulo}>Estado</label>
                <select id="uf" className={campo} value={uf} onChange={e => setUf(e.target.value)}>{UFS.map(u => <option key={u}>{u}</option>)}</select>
              </div>
            </div>
            <fieldset>
              <legend className={rotulo}>Opcionais</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {OPCIONAIS_PADRAO.map(o => (
                  <label key={o} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={opcionais.includes(o)} onChange={e => setOpcionais(l => e.target.checked ? [...l, o] : l.filter(x => x !== o))} />
                    {o}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="desc" className={rotulo}>Descrição</label>
              <textarea id="desc" rows={4} className={campo} placeholder="Conte o estado do carro, revisões, se aceita troca…" value={descricao} onChange={e => setDescricao(e.target.value)} />
            </div>
          </div>
        )}

        {passo === 2 && (
          <div>
            <label
              htmlFor="fotos"
              onDragOver={e => { e.preventDefault(); setArrastando(true) }}
              onDragLeave={() => setArrastando(false)}
              onDrop={e => { e.preventDefault(); setArrastando(false); adicionarFotos(e.dataTransfer.files) }}
              className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-dashed p-8 text-center ${arrastando ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:bg-slate-50'}`}
            >
              <span className="font-semibold">Arraste as fotos aqui ou clique para escolher</span>
              <span className="text-sm text-slate-500">Até {MAX_FOTOS} fotos · a primeira será a capa</span>
              <input id="fotos" type="file" accept="image/*" multiple className="sr-only" onChange={e => { if (e.target.files) adicionarFotos(e.target.files); e.target.value = '' }} />
            </label>
            {erroFotos && <p role="alert" className="mt-2 text-sm text-red-700">{erroFotos}</p>}
            {fotos.length > 0 && (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {fotos.map((f, i) => (
                  <li key={i} className="overflow-hidden rounded-xl ring-1 ring-slate-200">
                    <div className="relative">
                      <img src={f} alt={`Foto ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
                      {i === 0 && <span className="absolute left-2 top-2 rounded bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">Capa</span>}
                    </div>
                    <div className="flex justify-between p-2 text-xs">
                      {i !== 0 ? <button type="button" onClick={() => tornarCapa(i)} className="text-brand-600 hover:underline">Tornar capa</button> : <span />}
                      <button type="button" onClick={() => removerFoto(i)} className="text-red-600 hover:underline">Remover</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {passo === 3 && (
          <div className="space-y-5">
            <PainelFipe estado={fipe} ano={ano} />
            <div>
              <label htmlFor="preco" className={rotulo}>Quanto você quer pelo veículo? (R$)</label>
              <input id="preco" inputMode="numeric" className={`${campo} text-xl font-bold`} placeholder="60000"
                value={precoNum ? precoNum.toLocaleString('pt-BR') : ''} onChange={e => setPreco(e.target.value)} />
              {precoNum > 0 && (
                <div className="mt-2 space-y-1" aria-live="polite">
                  <FipeBadge preco={precoNum} fipe={valorFipe} detalhado />
                  {cmp.faixa === 'abaixo' && <p className="text-sm text-slate-600">Preço atrativo: tende a vender mais rápido, mas confira se não está deixando dinheiro na mesa.</p>}
                  {cmp.faixa === 'acima' && <p className="text-sm text-slate-600">Acima da FIPE: pode demorar mais para vender, a menos que o carro tenha diferenciais.</p>}
                </div>
              )}
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold">Resumo</p>
              <p>{condicao === 'novo' ? 'Novo' : 'Usado'} · {marca && nomeMarca(marca.nome)} {modelo} · {ano}</p>
              <p>{condicao === 'usado' && `${parseNumero(km).toLocaleString('pt-BR')} km · `}{cor} · {cambio} · {combustivel}</p>
              <p>{cidade} - {uf} · {fotos.length} foto(s)</p>
            </div>
            {erroPublicar && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erroPublicar}</p>}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button type="button" disabled={passo === 0} onClick={() => setPasso(p => p - 1)}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium disabled:opacity-40">Voltar</button>
        {passo < 3 ? (
          <button type="button" disabled={!passoValido} onClick={() => setPasso(p => p + 1)}
            className="rounded-lg bg-brand-600 px-6 py-2.5 font-semibold text-white disabled:opacity-40">Continuar</button>
        ) : (
          <button type="button" disabled={!passoValido} onClick={publicar}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white disabled:opacity-40">Publicar anúncio</button>
        )}
      </div>
    </div>
  )
}

function PainelFipe({ estado, ano }: { estado: EstadoFipe; ano: number }) {
  if (estado.estado === 'ocioso') return null
  if (estado.estado === 'carregando')
    return <div className="animate-pulse rounded-xl bg-slate-100 p-4 text-sm text-slate-500">Consultando tabela FIPE…</div>
  if (estado.estado === 'sem-referencia')
    return (
      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
        Não encontramos referência FIPE para este modelo/ano. Se souber o <strong>código FIPE</strong>, informe-o acima. Você pode anunciar mesmo assim.
      </div>
    )
  const d = estado.dados
  return (
    <div className={`rounded-xl p-4 ring-1 ${d.origem === 'fipe' ? 'bg-emerald-50 ring-emerald-200' : 'bg-amber-50 ring-amber-200'}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {d.origem === 'fipe' ? `Tabela FIPE · ${d.mesReferencia}` : `Valor estimado (offline) · ref. ${d.mesReferencia}`}
      </p>
      <p className="text-2xl font-extrabold">{formatBRL(d.valor)}</p>
      <p className="text-xs text-slate-600">
        Ano {ano}{d.versao ? ` · referência: ${d.versao}` : ''}{d.codigoFipe ? ` · cód. ${d.codigoFipe}` : ''}
      </p>
      {d.origem === 'estimado' && <p className="mt-1 text-xs text-amber-800">A consulta oficial (BrasilAPI) não respondeu; usamos o catálogo local.</p>}
    </div>
  )
}
