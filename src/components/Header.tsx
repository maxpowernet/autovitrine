import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../services/store'

export function Header() {
  const { usuario, sair } = useStore()
  const nav = useNavigate()
  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900'}`
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3">
        <Link to="/" className="mr-auto flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">A</span>
          AutoVitrine
        </Link>
        <nav className="hidden gap-1 sm:flex">
          <NavLink to="/" end className={link}>Comprar</NavLink>
          {usuario && <NavLink to="/meus-anuncios" className={link}>Meus anúncios</NavLink>}
        </nav>
        {usuario ? (
          <button onClick={() => { sair(); nav('/') }} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-slate-900">
            Sair ({usuario.nome.split(' ')[0]})
          </button>
        ) : (
          <Link to="/entrar" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">Entrar</Link>
        )}
        <Link to="/anunciar" className="whitespace-nowrap rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 sm:px-4">
          Anunciar grátis
        </Link>
      </div>
    </header>
  )
}
