import type { Client } from '../clients/registry'
import akamaiLight from './akamai-extended-color.svg'
import akamaiDark from './akamai-extended-reversed.svg'
import akamaiSymbol from './akamai-symbol-color.svg'
import cloudflareLight from './cloudflare-extended-color.svg'
import cloudflareDark from './cloudflare-extended-reversed.svg'
import cloudflareSymbol from './cloudflare-symbol-color.svg'
import fastlyLight from './fastly-extended-color.svg'
import fastlyDark from './fastly-extended-reversed.svg'
import fastlySymbol from './fastly-symbol-color.svg'
import vercelLight from './vercel-extended-mono.svg'
import vercelDark from './vercel-extended-reversed.svg'

export type Competitor = Pick<Client, 'name' | 'logo' | 'logoLight' | 'artwork' | 'symbol'>

export const COMPETITORS: Competitor[] = [
  { name: 'Akamai', logo: akamaiDark, logoLight: akamaiLight, symbol: akamaiSymbol },
  { name: 'Cloudflare', logo: cloudflareDark, logoLight: cloudflareLight, symbol: cloudflareSymbol },
  { name: 'Fastly', logo: fastlyDark, logoLight: fastlyLight, symbol: fastlySymbol },
  { name: 'Vercel', logo: vercelDark, logoLight: vercelLight }
]

/** The entry for `name`, or a bare `{ name }` so a comparison still reads without artwork. */
export const competitor = (name: string): Competitor | Pick<Competitor, 'name'> =>
  COMPETITORS.find((entry) => entry.name === name) ?? { name }
