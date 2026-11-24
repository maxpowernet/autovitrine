// Catálogo de reserva: códigos FIPE reais e valores de referência (tabela de novembro/2026).
// Usado quando a BrasilAPI está indisponível.
export interface ItemCatalogo {
  marca: string
  modelo: string
  versao: string
  codigoFipe: string
  combustivel: string
  valores: Record<number, number>
}

export const MES_REFERENCIA_CATALOGO = 'novembro de 2026'

export const FIPE_CATALOGO: ItemCatalogo[] = [
  {
    "marca": "GM - Chevrolet",
    "modelo": "Onix",
    "versao": "ONIX HATCH 1.0 12V Flex 5p Mec.",
    "codigoFipe": "004519-5",
    "combustivel": "Flex",
    "valores": {
      "2020": 55400,
      "2021": 58506,
      "2022": 62658,
      "2023": 64495,
      "2024": 66237,
      "2025": 68581,
      "2026": 81991,
      "2027": 84089
    }
  },
  {
    "marca": "GM - Chevrolet",
    "modelo": "Tracker",
    "versao": "TRACKER 1.0 Turbo 12V Flex Aut.",
    "codigoFipe": "004526-8",
    "combustivel": "Flex",
    "valores": {
      "2021": 84105,
      "2022": 88082,
      "2023": 90457,
      "2024": 99003,
      "2025": 102900,
      "2026": 105653,
      "2027": 117758
    }
  },
  {
    "marca": "Fiat",
    "modelo": "Mobi",
    "versao": "MOBI EASY 1.0 Fire Flex 5p.",
    "codigoFipe": "001463-0",
    "combustivel": "Flex",
    "valores": {
      "2017": 37270,
      "2018": 38903,
      "2019": 40173,
      "2020": 41271,
      "2021": 46659,
      "2022": 47826
    }
  },
  {
    "marca": "Fiat",
    "modelo": "Argo",
    "versao": "ARGO 1.0 6V Flex",
    "codigoFipe": "001509-1",
    "combustivel": "Flex",
    "valores": {
      "2018": 47852,
      "2019": 49365,
      "2020": 51919,
      "2021": 54246,
      "2022": 58106,
      "2023": 61964,
      "2024": 64686,
      "2025": 69075,
      "2026": 74852
    }
  },
  {
    "marca": "Fiat",
    "modelo": "Pulse",
    "versao": "PULSE ABARTH 1.3 Turbo 16V Flex Aut.",
    "codigoFipe": "001559-8",
    "combustivel": "Flex",
    "valores": {
      "2023": 108154,
      "2024": 111682,
      "2025": 119228,
      "2026": 133193,
      "2027": 143201
    }
  },
  {
    "marca": "Fiat",
    "modelo": "Toro",
    "versao": "Toro Endurance 1.3 T270 4x2 Flex Aut.",
    "codigoFipe": "001537-7",
    "combustivel": "Flex",
    "valores": {
      "2022": 96392,
      "2023": 106085,
      "2024": 111627,
      "2025": 122044,
      "2026": 139936,
      "2027": 147285
    }
  },
  {
    "marca": "Hyundai",
    "modelo": "HB20",
    "versao": "HB20 C./C.Plus/C.Style 1.6 Flex 16V Mec.",
    "codigoFipe": "015089-4",
    "combustivel": "Flex",
    "valores": {
      "2014": 47457,
      "2015": 49522,
      "2016": 50844,
      "2017": 53045,
      "2018": 54377,
      "2019": 58469
    }
  },
  {
    "marca": "Hyundai",
    "modelo": "Creta",
    "versao": "Creta Action 1.6 16V Flex Aut.",
    "codigoFipe": "015190-4",
    "combustivel": "Flex",
    "valores": {
      "2021": 87903,
      "2022": 90394,
      "2023": 93435,
      "2024": 98064,
      "2025": 102470
    }
  },
  {
    "marca": "VW - VolksWagen",
    "modelo": "Polo",
    "versao": "Polo 1.0 Flex 12V 5p",
    "codigoFipe": "005479-8",
    "combustivel": "Flex",
    "valores": {
      "2018": 59173,
      "2019": 61220,
      "2020": 63591,
      "2021": 67462,
      "2022": 69149
    }
  },
  {
    "marca": "VW - VolksWagen",
    "modelo": "T-Cross",
    "versao": "T-Cross 200 TSI 1.0  Flex 12V 5p Aut.",
    "codigoFipe": "005510-7",
    "combustivel": "Flex",
    "valores": {
      "2020": 87835,
      "2021": 90122,
      "2022": 93628,
      "2023": 97271,
      "2024": 102385,
      "2025": 114687,
      "2026": 124072,
      "2027": 127562
    }
  },
  {
    "marca": "VW - VolksWagen",
    "modelo": "Nivus",
    "versao": "Nivus Comfortline 1.0 200 TSI Flex Aut.",
    "codigoFipe": "005525-5",
    "combustivel": "Flex",
    "valores": {
      "2021": 92636,
      "2022": 94952,
      "2023": 97579,
      "2024": 101430,
      "2025": 115210,
      "2026": 118420,
      "2027": 132477
    }
  },
  {
    "marca": "VW - VolksWagen",
    "modelo": "Gol",
    "versao": "Gol (novo) 1.0 Mi Total Flex 8V 4p",
    "codigoFipe": "005275-2",
    "combustivel": "Flex",
    "valores": {
      "2014": 33806,
      "2015": 36985
    }
  },
  {
    "marca": "VW - VolksWagen",
    "modelo": "Saveiro",
    "versao": "Saveiro 1.6 Mi/ 1.6 Mi Total Flex 8V",
    "codigoFipe": "005094-6",
    "combustivel": "Gasolina",
    "valores": {
      "2014": 42493,
      "2015": 45727
    }
  },
  {
    "marca": "Toyota",
    "modelo": "Corolla",
    "versao": "Corolla ALTIS/A.Premiu. 2.0 Flex 16V Aut",
    "codigoFipe": "002112-1",
    "combustivel": "Flex",
    "valores": {
      "2014": 69178,
      "2015": 81913,
      "2016": 84910,
      "2017": 87484,
      "2018": 101071,
      "2019": 104497,
      "2020": 121205,
      "2021": 124236,
      "2022": 131159,
      "2023": 142156,
      "2024": 154305,
      "2025": 168668,
      "2026": 181019
    }
  },
  {
    "marca": "Toyota",
    "modelo": "Hilux",
    "versao": "Hilux CD 4x4 2.7 16V Flex Mec.",
    "codigoFipe": "002128-8",
    "combustivel": "Flex",
    "valores": {
      "2014": 122272,
      "2015": 127573
    }
  },
  {
    "marca": "Toyota",
    "modelo": "Yaris",
    "versao": "YARIS Cross XR 1.5 16V 5p Aut.",
    "codigoFipe": "002228-4",
    "combustivel": "Flex",
    "valores": {
      "2026": 132201,
      "2027": 136858
    }
  },
  {
    "marca": "Jeep",
    "modelo": "Renegade",
    "versao": "Renegade 1.8 4x2 Flex 16V Aut.",
    "codigoFipe": "017062-3",
    "combustivel": "Flex",
    "valores": {
      "2016": 62575,
      "2017": 64694,
      "2018": 66312,
      "2019": 68745,
      "2020": 70464,
      "2021": 73878
    }
  },
  {
    "marca": "Jeep",
    "modelo": "Compass",
    "versao": "COMPASS LIMITED 2.0 4x2 Flex 16V Aut.",
    "codigoFipe": "017047-0",
    "combustivel": "Flex",
    "valores": {
      "2016": 76692,
      "2017": 83932,
      "2018": 89768,
      "2019": 97237,
      "2020": 99668,
      "2021": 107460
    }
  },
  {
    "marca": "Renault",
    "modelo": "Kwid",
    "versao": "KWID E-Tech Techno",
    "codigoFipe": "025339-1",
    "combustivel": "Elétrico",
    "valores": {
      "2025": 78562,
      "2026": 81163
    }
  },
  {
    "marca": "Renault",
    "modelo": "Duster",
    "versao": "DUSTER 1.6 Hi-Flex 16V Mec.",
    "codigoFipe": "025181-0",
    "combustivel": "Flex",
    "valores": {
      "2014": 50894,
      "2015": 53157,
      "2016": 55900
    }
  },
  {
    "marca": "Honda",
    "modelo": "Civic",
    "versao": "Civic Coupe Si 1.5 TB 16V 208cv Mec. 2p",
    "codigoFipe": "014099-6",
    "combustivel": "Gasolina",
    "valores": {
      "2018": 137758,
      "2019": 152998,
      "2020": 157083
    }
  },
  {
    "marca": "Honda",
    "modelo": "HR-V",
    "versao": "HR-V EX 1.8 Flexone 16V 5p Aut.",
    "codigoFipe": "014087-2",
    "combustivel": "Flex",
    "valores": {
      "2016": 81067,
      "2017": 85970,
      "2018": 89656,
      "2019": 97621,
      "2020": 101953,
      "2021": 108197
    }
  },
  {
    "marca": "Honda",
    "modelo": "City",
    "versao": "CITY Hatchback EXL 1.5 Flex 16V Aut.",
    "codigoFipe": "014108-9",
    "combustivel": "Flex",
    "valores": {
      "2022": 93861,
      "2023": 102922,
      "2024": 111001,
      "2025": 119178,
      "2026": 123039,
      "2027": 129652
    }
  },
  {
    "marca": "Nissan",
    "modelo": "Kicks",
    "versao": "KICKS Active 1.6 16V Flex Aut.",
    "codigoFipe": "023186-0",
    "combustivel": "Flex",
    "valores": {
      "2022": 88173,
      "2023": 93409,
      "2024": 95854
    }
  },
  {
    "marca": "Citroën",
    "modelo": "C3",
    "versao": "C3 Attraction Pure Tech 1.2 Flex 12V Mec",
    "codigoFipe": "011170-8",
    "combustivel": "Flex",
    "valores": {
      "2016": 39537,
      "2017": 40732,
      "2018": 44431,
      "2019": 47871,
      "2020": 49068,
      "2021": 50295
    }
  },
  {
    "marca": "BYD",
    "modelo": "Dolphin",
    "versao": "Dolphin EV GS (Elétrico)",
    "codigoFipe": "095007-6",
    "combustivel": "Elétrico",
    "valores": {
      "2024": 115010,
      "2025": 118226,
      "2026": 128690,
      "2027": 134547
    }
  }
]
