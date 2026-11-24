const CORES: Record<string, string> = {
  Branco: '#f1f5f9', Preto: '#1e293b', Prata: '#cbd5e1', Cinza: '#64748b',
  Vermelho: '#dc2626', Azul: '#2563eb', Verde: '#16a34a', Amarelo: '#eab308', Laranja: '#ea580c',
}

/** Ilustração de carro em SVG (data URI) usada nos anúncios de exemplo. */
export function carroPlaceholder(cor: string, variante = 0): string {
  const corpo = CORES[cor] ?? '#94a3b8'
  const fundos = [
    ['#dbeafe', '#eff6ff'], ['#fef3c7', '#fffbeb'], ['#dcfce7', '#f0fdf4'], ['#fce7f3', '#fdf2f8'],
  ][variante % 4]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fundos[0]}"/><stop offset="1" stop-color="${fundos[1]}"/></linearGradient></defs>
<rect width="640" height="400" fill="url(#g)"/>
<rect y="285" width="640" height="115" fill="#cbd5e1" opacity=".55"/>
<ellipse cx="320" cy="312" rx="230" ry="16" fill="#0f172a" opacity=".18"/>
<path d="M92 270c0-26 14-42 44-50l66-18c20-22 46-40 74-44 40-6 92-4 124 8 30 11 58 38 78 62 28 4 44 14 44 40v22H92z" fill="${corpo}" stroke="#0f172a" stroke-opacity=".35" stroke-width="3"/>
<path d="M222 204c14-14 32-26 52-30 36-5 80-4 106 5 18 7 36 24 52 44H222z" fill="#e0f2fe" stroke="#0f172a" stroke-opacity=".35" stroke-width="3"/>
<path d="M326 176v46" stroke="#0f172a" stroke-opacity=".35" stroke-width="3"/>
<circle cx="190" cy="288" r="36" fill="#0f172a"/><circle cx="190" cy="288" r="18" fill="#94a3b8"/>
<circle cx="466" cy="288" r="36" fill="#0f172a"/><circle cx="466" cy="288" r="18" fill="#94a3b8"/>
<rect x="534" y="244" width="22" height="12" rx="4" fill="#fde047"/>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
