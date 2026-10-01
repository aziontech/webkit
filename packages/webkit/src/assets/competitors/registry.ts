import type { Client } from '../clients/registry'
import vercelDark from './dark/vercel.svg'
import vercelLight from './vercel.svg'

export type Competitor = Pick<Client, 'name' | 'logo' | 'logoLight' | 'artwork'>

export const COMPETITORS: Competitor[] = [
  { name: 'Vercel', logo: vercelDark, logoLight: vercelLight }
]

/** The entry for `name`, or a bare `{ name }` so a comparison still reads without artwork. */
export const competitor = (name: string): Competitor | Pick<Competitor, 'name'> =>
  COMPETITORS.find((entry) => entry.name === name) ?? { name }
