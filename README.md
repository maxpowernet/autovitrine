# AutoVitrine

Loja de carros novos e usados (somente front-end, sem banco de dados). Vite + React + TypeScript + Tailwind v4 + React Router.

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # Vitest
npm run build
```

## Como funciona
- **Loja** (`/`): busca e filtros (condição, marca, preço, ano, km, câmbio, combustível, estado) e ordenação.
- **Anunciar** (`/anunciar`): assistente em 4 passos (veículo → detalhes → fotos → preço) com comparação ao vivo com a FIPE. Exige cadastro.
- **Dados**: anúncios de exemplo + tudo que você cadastra ficam no `localStorage` do navegador.
- **FIPE**: `src/services/fipeService.ts` consulta a [BrasilAPI](https://brasilapi.com.br/docs#tag/FIPE) (marcas, modelos e preço por código FIPE). Se a API falhar ou demorar mais de 6 s, usa o catálogo local `src/data/fipeCatalogo.ts` (26 modelos populares, tabela de nov/2026) e marca o valor como "estimado (offline)".
