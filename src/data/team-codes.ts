/**
 * Anagrafica completa delle 48 squadre del Mondiale 2026 (codici openfootball).
 * NAME_TO_CODE: nome inglese openfootball → codice FIFA (per il parser).
 * CODE_TO_ISO: codice → ISO-2 (o sentinella 'eng'/'sco') per la bandiera emoji.
 * ITALIAN_NAMES: codice → nome italiano (per la UI).
 */

export const NAME_TO_CODE: Record<string, string> = {
  Mexico: 'MEX', 'South Africa': 'RSA', 'South Korea': 'KOR', 'Korea Republic': 'KOR',
  'Czech Republic': 'CZE', Czechia: 'CZE', Canada: 'CAN', 'Bosnia & Herzegovina': 'BIH',
  'Bosnia and Herzegovina': 'BIH', Qatar: 'QAT', Switzerland: 'SUI', Brazil: 'BRA',
  Morocco: 'MAR', Haiti: 'HAI', Scotland: 'SCO', USA: 'USA', 'United States': 'USA',
  Paraguay: 'PAR', Australia: 'AUS', Turkey: 'TUR', Türkiye: 'TUR', Germany: 'GER',
  'Curaçao': 'CUW', Curacao: 'CUW', 'Ivory Coast': 'CIV', "Côte d'Ivoire": 'CIV',
  Ecuador: 'ECU', Netherlands: 'NED', Japan: 'JPN', Sweden: 'SWE', Tunisia: 'TUN',
  Belgium: 'BEL', Egypt: 'EGY', Iran: 'IRN', 'New Zealand': 'NZL', Spain: 'ESP',
  'Cape Verde': 'CPV', 'Cabo Verde': 'CPV', 'Saudi Arabia': 'KSA', Uruguay: 'URU',
  France: 'FRA', Senegal: 'SEN', Iraq: 'IRQ', Norway: 'NOR', Argentina: 'ARG',
  Algeria: 'ALG', Austria: 'AUT', Jordan: 'JOR', Portugal: 'POR', 'DR Congo': 'COD',
  'DR Congo (Congo DR)': 'COD', Uzbekistan: 'UZB', Colombia: 'COL', England: 'ENG',
  Croatia: 'CRO', Ghana: 'GHA', Panama: 'PAN', Italy: 'ITA',
}

export const CODE_TO_ISO: Record<string, string> = {
  MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz', CAN: 'ca', BIH: 'ba', QAT: 'qa', SUI: 'ch',
  BRA: 'br', MAR: 'ma', HAI: 'ht', SCO: 'sco', USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
  GER: 'de', CUW: 'cw', CIV: 'ci', ECU: 'ec', NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz', ESP: 'es', CPV: 'cv', KSA: 'sa', URU: 'uy',
  FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no', ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
  POR: 'pt', COD: 'cd', UZB: 'uz', COL: 'co', ENG: 'eng', CRO: 'hr', GHA: 'gh', PAN: 'pa',
  ITA: 'it',
}

export const ITALIAN_NAMES: Record<string, string> = {
  MEX: 'Messico', RSA: 'Sudafrica', KOR: 'Corea del Sud', CZE: 'Rep. Ceca', CAN: 'Canada',
  BIH: 'Bosnia-Erz.', QAT: 'Qatar', SUI: 'Svizzera', BRA: 'Brasile', MAR: 'Marocco',
  HAI: 'Haiti', SCO: 'Scozia', USA: 'USA', PAR: 'Paraguay', AUS: 'Australia', TUR: 'Turchia',
  GER: 'Germania', CUW: 'Curaçao', CIV: "Costa d'Avorio", ECU: 'Ecuador', NED: 'Olanda',
  JPN: 'Giappone', SWE: 'Svezia', TUN: 'Tunisia', BEL: 'Belgio', EGY: 'Egitto', IRN: 'Iran',
  NZL: 'Nuova Zelanda', ESP: 'Spagna', CPV: 'Capo Verde', KSA: 'Arabia Saudita', URU: 'Uruguay',
  FRA: 'Francia', SEN: 'Senegal', IRQ: 'Iraq', NOR: 'Norvegia', ARG: 'Argentina', ALG: 'Algeria',
  AUT: 'Austria', JOR: 'Giordania', POR: 'Portogallo', COD: 'RD Congo', UZB: 'Uzbekistan',
  COL: 'Colombia', ENG: 'Inghilterra', CRO: 'Croazia', GHA: 'Ghana', PAN: 'Panama', ITA: 'Italia',
}
