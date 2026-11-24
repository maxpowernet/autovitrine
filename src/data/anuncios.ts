import type { Anuncio, Cambio, Combustivel, Condicao } from '../types'
import { FIPE_CATALOGO } from './fipeCatalogo'
import { estimaValor } from '../services/fipeService'
import { carroPlaceholder } from '../lib/placeholder'

// [marca FIPE, modelo, condição, ano, km, cor, câmbio, combustível, cidade, UF, preço vs FIPE]
type Linha = [string, string, Condicao, number, number, string, Cambio, Combustivel, string, string, number]

const LINHAS: Linha[] = [
  ['GM - Chevrolet', 'Onix', 'usado', 2022, 38000, 'Branco', 'Manual', 'Flex', 'Recife', 'PE', 0.93],
  ['GM - Chevrolet', 'Tracker', 'usado', 2024, 21000, 'Cinza', 'Automático', 'Flex', 'São Paulo', 'SP', 1.02],
  ['Fiat', 'Mobi', 'usado', 2023, 27000, 'Vermelho', 'Manual', 'Flex', 'Belo Horizonte', 'MG', 0.9],
  ['Fiat', 'Argo', 'usado', 2022, 45000, 'Prata', 'Manual', 'Flex', 'Curitiba', 'PR', 1.0],
  ['Fiat', 'Pulse', 'novo', 2027, 0, 'Azul', 'Automático', 'Flex', 'Fortaleza', 'CE', 1.04],
  ['Fiat', 'Toro', 'usado', 2023, 33000, 'Preto', 'Automático', 'Flex', 'Goiânia', 'GO', 1.09],
  ['Hyundai', 'HB20', 'usado', 2021, 52000, 'Branco', 'Manual', 'Flex', 'Porto Alegre', 'RS', 0.96],
  ['Hyundai', 'Creta', 'usado', 2024, 18000, 'Preto', 'Automático', 'Flex', 'Salvador', 'BA', 0.98],
  ['VW - VolksWagen', 'Polo', 'usado', 2022, 41000, 'Prata', 'Manual', 'Flex', 'Rio de Janeiro', 'RJ', 0.95],
  ['VW - VolksWagen', 'T-Cross', 'usado', 2023, 29000, 'Cinza', 'Automático', 'Flex', 'São Paulo', 'SP', 1.0],
  ['VW - VolksWagen', 'Nivus', 'novo', 2027, 0, 'Branco', 'Automático', 'Flex', 'Campinas', 'SP', 1.03],
  ['Toyota', 'Corolla', 'usado', 2020, 62000, 'Prata', 'Automático', 'Flex', 'Brasília', 'DF', 0.97],
  ['Toyota', 'Yaris', 'usado', 2022, 36000, 'Vermelho', 'Automático', 'Flex', 'Natal', 'RN', 1.12],
  ['Jeep', 'Renegade', 'usado', 2021, 58000, 'Verde', 'Automático', 'Flex', 'Florianópolis', 'SC', 0.89],
  ['Jeep', 'Compass', 'usado', 2022, 44000, 'Branco', 'Automático', 'Flex', 'Vitória', 'ES', 1.01],
  ['Renault', 'Kwid', 'usado', 2025, 12000, 'Laranja', 'Manual', 'Flex', 'Manaus', 'AM', 0.94],
  ['Renault', 'Duster', 'usado', 2020, 70000, 'Cinza', 'Manual', 'Flex', 'Belém', 'PA', 1.07],
  ['Honda', 'HR-V', 'usado', 2022, 39000, 'Preto', 'Automático', 'Flex', 'São Paulo', 'SP', 0.99],
  ['Honda', 'City', 'usado', 2021, 47000, 'Prata', 'Automático', 'Flex', 'Recife', 'PE', 0.92],
  ['Nissan', 'Kicks', 'usado', 2023, 25000, 'Azul', 'Automático', 'Flex', 'Cuiabá', 'MT', 1.0],
  ['Citroën', 'C3', 'usado', 2022, 31000, 'Branco', 'Manual', 'Flex', 'Maceió', 'AL', 0.91],
  ['BYD', 'Dolphin', 'usado', 2024, 15000, 'Azul', 'Automático', 'Elétrico', 'São Paulo', 'SP', 1.06],
  ['GM - Chevrolet', 'Onix', 'novo', 2026, 0, 'Prata', 'Manual', 'Flex', 'Uberlândia', 'MG', 1.01],
  ['VW - VolksWagen', 'Polo', 'novo', 2026, 0, 'Vermelho', 'Automático', 'Flex', 'Joinville', 'SC', 1.0],
]

export const OPCIONAIS_PADRAO = [
  'Ar-condicionado', 'Direção elétrica', 'Vidros elétricos', 'Travas elétricas', 'Airbag', 'Freios ABS',
  'Central multimídia', 'Câmera de ré', 'Sensor de estacionamento', 'Piloto automático', 'Bancos de couro', 'Teto solar',
]

export const VENDEDOR_EXEMPLO_ID = 'vendedor-exemplo'

function gerar(): Anuncio[] {
  return LINHAS.map(([marcaFipe, modelo, condicao, ano, km, cor, cambio, combustivel, cidade, uf, fator], i) => {
    const item = FIPE_CATALOGO.find(c => c.marca === marcaFipe && c.modelo === modelo)!
    const fipe = estimaValor(item.valores, ano)!
    const marca = marcaFipe.replace(/^(GM|VW) - /, '').replace('VolksWagen', 'Volkswagen')
    const dia = String(((i * 5) % 27) + 1).padStart(2, '0')
    return {
      id: `ex-${i + 1}`,
      donoId: VENDEDOR_EXEMPLO_ID,
      condicao,
      marca,
      modelo,
      versao: item.versao.replace(/\s+/g, ' '),
      ano,
      km,
      cor,
      cambio,
      combustivel,
      cidade,
      uf,
      preco: Math.round((fipe * fator) / 500) * 500,
      valorFipe: fipe,
      fotos: [0, 1, 2].map(v => carroPlaceholder(cor, i + v)),
      descricao: `${marca} ${modelo} ${ano} ${condicao === 'novo' ? '0 km, pronta entrega' : 'em ótimo estado, único dono, revisões em dia'}. Aceito troca e financiamento.`,
      opcionais: OPCIONAIS_PADRAO.filter((_, k) => (k + i) % 3 !== 0).slice(0, 8),
      status: 'ativo' as const,
      criadoEm: `2026-11-${dia}`,
    }
  })
}

export const ANUNCIOS_EXEMPLO: Anuncio[] = gerar()
