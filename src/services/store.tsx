import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Anuncio, Usuario } from '../types'
import { ANUNCIOS_EXEMPLO } from '../data/anuncios'

const K_ANUNCIOS = 'av:anuncios'
const K_USUARIOS = 'av:usuarios'
const K_SESSAO = 'av:sessao'

function ler<T>(chave: string, padrao: T): T {
  try {
    const raw = localStorage.getItem(chave)
    return raw ? (JSON.parse(raw) as T) : padrao
  } catch {
    return padrao
  }
}
function gravar(chave: string, valor: unknown): boolean {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
    return true
  } catch {
    return false // cota do localStorage estourada (fotos grandes)
  }
}

const novoId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))

interface Store {
  anuncios: Anuncio[]
  usuario: Usuario | null
  adicionarAnuncio: (a: Omit<Anuncio, 'id' | 'donoId' | 'criadoEm' | 'status'>) => { ok: boolean; id: string }
  removerAnuncio: (id: string) => void
  alternarPausa: (id: string) => void
  cadastrar: (u: Omit<Usuario, 'id'>) => Usuario
  entrar: (email: string) => boolean
  sair: () => void
  vendedor: (donoId: string) => Pick<Usuario, 'nome' | 'telefone'> | undefined
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [anuncios, setAnuncios] = useState<Anuncio[]>(() => ler(K_ANUNCIOS, ANUNCIOS_EXEMPLO))
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => ler(K_USUARIOS, []))
  const [sessao, setSessao] = useState<string | null>(() => ler<string | null>(K_SESSAO, null))

  useEffect(() => { gravar(K_ANUNCIOS, anuncios) }, [anuncios])
  useEffect(() => { gravar(K_USUARIOS, usuarios) }, [usuarios])
  useEffect(() => { gravar(K_SESSAO, sessao) }, [sessao])

  const usuario = useMemo(() => usuarios.find(u => u.id === sessao) ?? null, [usuarios, sessao])

  const adicionarAnuncio: Store['adicionarAnuncio'] = useCallback(
    dados => {
      const id = novoId()
      const novo: Anuncio = {
        ...dados, id, donoId: usuario?.id ?? 'anonimo', criadoEm: new Date().toISOString().slice(0, 10), status: 'ativo',
      }
      const proximo = [novo, ...anuncios]
      const ok = gravar(K_ANUNCIOS, proximo)
      if (ok) setAnuncios(proximo)
      return { ok, id }
    },
    [anuncios, usuario],
  )

  const removerAnuncio = useCallback((id: string) => setAnuncios(l => l.filter(a => a.id !== id)), [])
  const alternarPausa = useCallback(
    (id: string) => setAnuncios(l => l.map(a => (a.id === id ? { ...a, status: a.status === 'ativo' ? 'pausado' : 'ativo' } : a))),
    [],
  )

  const cadastrar = useCallback((dados: Omit<Usuario, 'id'>) => {
    const existente = usuarios.find(u => u.email.toLowerCase() === dados.email.toLowerCase())
    const u = existente ?? { ...dados, id: novoId() }
    if (!existente) setUsuarios(l => [...l, u])
    setSessao(u.id)
    return u
  }, [usuarios])

  const entrar = useCallback((email: string) => {
    const u = usuarios.find(x => x.email.toLowerCase() === email.trim().toLowerCase())
    if (u) setSessao(u.id)
    return !!u
  }, [usuarios])

  const sair = useCallback(() => setSessao(null), [])

  const vendedor = useCallback((donoId: string) => {
    if (donoId === 'vendedor-exemplo') return { nome: 'Loja Exemplo Veículos', telefone: '(11) 99999-0000' }
    const u = usuarios.find(x => x.id === donoId)
    return u ? { nome: u.nome, telefone: u.telefone } : undefined
  }, [usuarios])

  const valor = useMemo(
    () => ({ anuncios, usuario, adicionarAnuncio, removerAnuncio, alternarPausa, cadastrar, entrar, sair, vendedor }),
    [anuncios, usuario, adicionarAnuncio, removerAnuncio, alternarPausa, cadastrar, entrar, sair, vendedor],
  )
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore fora do StoreProvider')
  return s
}
