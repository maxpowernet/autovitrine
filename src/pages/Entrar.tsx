import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../services/store'
import { UFS } from '../data/constantes'

const campo = 'w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'

export function Entrar() {
  const { cadastrar, entrar } = useStore()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const destino = params.get('next') || '/'
  const [modo, setModo] = useState<'cadastro' | 'login'>('cadastro')
  const [erro, setErro] = useState('')
  const [f, setF] = useState({ nome: '', email: '', telefone: '', cidade: '', uf: 'SP' })

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (modo === 'login') {
      if (!entrar(f.email)) return setErro('E-mail não encontrado neste navegador. Faça o cadastro.')
    } else {
      cadastrar({ ...f })
    }
    nav(destino)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">{modo === 'cadastro' ? 'Crie sua conta' : 'Entrar'}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {modo === 'cadastro' ? 'Leva menos de 1 minuto e você já pode anunciar.' : 'Use o e-mail do seu cadastro.'}
        </p>
        <form onSubmit={enviar} className="mt-5 space-y-4">
          {modo === 'cadastro' && (
            <div>
              <label htmlFor="nome" className="mb-1 block text-sm font-medium">Nome completo</label>
              <input id="nome" required className={campo} value={f.nome} onChange={e => setF({ ...f, nome: e.target.value })} />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">E-mail</label>
            <input id="email" type="email" required className={campo} value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
          </div>
          {modo === 'cadastro' && (
            <>
              <div>
                <label htmlFor="tel" className="mb-1 block text-sm font-medium">Telefone / WhatsApp</label>
                <input id="tel" type="tel" required placeholder="(11) 99999-0000" className={campo} value={f.telefone} onChange={e => setF({ ...f, telefone: e.target.value })} />
              </div>
              <div className="grid grid-cols-[1fr_90px] gap-3">
                <div>
                  <label htmlFor="cidade" className="mb-1 block text-sm font-medium">Cidade</label>
                  <input id="cidade" required className={campo} value={f.cidade} onChange={e => setF({ ...f, cidade: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="uf" className="mb-1 block text-sm font-medium">UF</label>
                  <select id="uf" className={campo} value={f.uf} onChange={e => setF({ ...f, uf: e.target.value })}>
                    {UFS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}
          {erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
          <button className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700">
            {modo === 'cadastro' ? 'Criar conta' : 'Entrar'}
          </button>
        </form>
        <button onClick={() => { setModo(modo === 'cadastro' ? 'login' : 'cadastro'); setErro('') }} className="mt-4 w-full text-center text-sm text-brand-600 hover:underline">
          {modo === 'cadastro' ? 'Já tenho conta' : 'Ainda não tenho conta'}
        </button>
        <p className="mt-4 text-xs text-slate-400">Demonstração: os dados ficam apenas neste navegador (localStorage).</p>
      </div>
    </div>
  )
}
