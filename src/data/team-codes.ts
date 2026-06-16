/**
 * Mappe per i dati reali openfootball (nomi inglesi) → codici FIFA → ISO-2.
 * Copre le nazioni più probabili al Mondiale 2026; per le altre il parser usa
 * un pseudo-codice (prime 3 lettere) e la bandiera ripiega sul gradiente.
 */

export const NAME_TO_CODE: Record<string, string> = {
  // Ospitanti
  Canada: 'CAN', 'United States': 'USA', USA: 'USA', Mexico: 'MEX',
  // UEFA
  Italy: 'ITA', France: 'FRA', Spain: 'ESP', Germany: 'GER', England: 'ENG',
  Portugal: 'POR', Netherlands: 'NED', Croatia: 'CRO', Belgium: 'BEL',
  Switzerland: 'SUI', Denmark: 'DEN', Serbia: 'SRB', Austria: 'AUT',
  Poland: 'POL', Ukraine: 'UKR', Scotland: 'SCO', Turkey: 'TUR', Norway: 'NOR',
  // CONMEBOL
  Brazil: 'BRA', Argentina: 'ARG', Uruguay: 'URU', Colombia: 'COL',
  Ecuador: 'ECU', Paraguay: 'PAR', Chile: 'CHI', Peru: 'PER',
  // CONCACAF
  'Costa Rica': 'CRC', Panama: 'PAN', Jamaica: 'JAM', Honduras: 'HON',
  // CAF
  Morocco: 'MAR', Senegal: 'SEN', Cameroon: 'CMR', 'South Africa': 'RSA',
  Nigeria: 'NGA', Egypt: 'EGY', Tunisia: 'TUN', Algeria: 'ALG', Ghana: 'GHA',
  'Ivory Coast': 'CIV', "Côte d'Ivoire": 'CIV', Mali: 'MLI',
  // AFC
  Japan: 'JPN', 'South Korea': 'KOR', 'Korea Republic': 'KOR', Iran: 'IRN',
  'Saudi Arabia': 'KSA', Australia: 'AUS', Qatar: 'QAT', Iraq: 'IRQ',
  Uzbekistan: 'UZB', Jordan: 'JOR',
  // OFC
  'New Zealand': 'NZL',
}

export const CODE_TO_ISO: Record<string, string> = {
  CAN: 'ca', USA: 'us', MEX: 'mx',
  ITA: 'it', FRA: 'fr', ESP: 'es', GER: 'de', ENG: 'eng', POR: 'pt', NED: 'nl',
  CRO: 'hr', BEL: 'be', SUI: 'ch', DEN: 'dk', SRB: 'rs', AUT: 'at', POL: 'pl',
  UKR: 'ua', SCO: 'gb-sct', TUR: 'tr', NOR: 'no',
  BRA: 'br', ARG: 'ar', URU: 'uy', COL: 'co', ECU: 'ec', PAR: 'py', CHI: 'cl', PER: 'pe',
  CRC: 'cr', PAN: 'pa', JAM: 'jm', HON: 'hn',
  MAR: 'ma', SEN: 'sn', CMR: 'cm', RSA: 'za', NGA: 'ng', EGY: 'eg', TUN: 'tn',
  ALG: 'dz', GHA: 'gh', CIV: 'ci', MLI: 'ml',
  JPN: 'jp', KOR: 'kr', IRN: 'ir', KSA: 'sa', AUS: 'au', QAT: 'qa', IRQ: 'iq',
  UZB: 'uz', JOR: 'jo', NZL: 'nz',
}
