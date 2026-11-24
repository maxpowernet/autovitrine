import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './services/store'
import { Header } from './components/Header'
import { Loja } from './pages/Loja'
import { Detalhe } from './pages/Detalhe'
import { Anunciar } from './pages/Anunciar'
import { Entrar } from './pages/Entrar'
import { MeusAnuncios } from './pages/MeusAnuncios'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Loja />} />
            <Route path="/anuncio/:id" element={<Detalhe />} />
            <Route path="/anunciar" element={<Anunciar />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/meus-anuncios" element={<MeusAnuncios />} />
            <Route path="*" element={<p className="p-10 text-center">Página não encontrada.</p>} />
          </Routes>
        </main>
        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          AutoVitrine · demonstração. Valores FIPE via BrasilAPI; anúncios de exemplo são fictícios.
        </footer>
      </BrowserRouter>
    </StoreProvider>
  )
}
