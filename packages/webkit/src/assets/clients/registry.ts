import americamovil from './americamovil.svg'
import agibank from './dark/clients/agibank-logo.svg'
import caixa from './dark/clients/caixa-logo.svg'
import cocacola from './dark/clients/cocacola-logo.svg'
import dafiti from './dark/clients/dafiti-logo.svg'
import fourbank from './dark/clients/fourbank-logo.svg'
import gfg from './dark/clients/gfg-global-fashion-group.svg'
import gpa from './dark/clients/gpa-logo.svg'
import herospark from './dark/clients/herospark.svg'
import itau from './dark/clients/itau-logo.webp'
import magalu from './dark/clients/magalu-logo.svg'
import primevideo from './dark/clients/primevideo-logo.svg'
import radware from './dark/clients/radware-logo.svg'
import renner from './dark/clients/renner-logo.svg'
import exame from './exame.svg'
import herosparkWordmark from './herospark-logo.svg'
import herosparkSymbol from './herospark-symbol.svg'
import ifood from './ifood-logo.svg'
import agibankColor from './light/agibank-logo.svg'
import ifoodColor from './light/ifood-logo.svg'
import magaluColor from './light/magalu-logo.svg'
import mobiautoColor from './light/mobiauto-logo.svg'
import nznColor from './light/nzn-logo.svg'
import madeiraWordmark from './madeira-logo.svg'
import madeiraSymbol from './madeira-symbol.svg'
import magaluWordmark from './magalu-logo.svg'
import magaluSymbol from './magalu-symbol.png'
import mobiauto from './mobiauto-logo.svg'
import netshoes from './netshoes-logo.svg'
import nzn from './nzn-logo.svg'
import gpaPhoto from './photos/gpa.jpg'
import netshoesPhoto from './photos/netshoes.jpg'
import rennerWordmark from './renner-logo.svg'
import rennerSymbol from './renner-symbol.svg'
import { normalizeClientName } from './symbols/registry'
import zoop from './zoop-logo.svg'

export type ClientArtwork = 'light' | 'dark' | 'color'

export interface ClientBrand {
  base: string
  glow: string
}

export interface Client {
  name: string
  logo: string
  logoLight?: string
  artwork?: ClientArtwork
  symbol?: string
  wordmark?: string
  brand?: ClientBrand
}

export const ARTWORK_FILTER: Record<ClientArtwork, string> = {
  light: 'invert [[data-theme=dark]_&]:invert-0',
  dark: '[[data-theme=dark]_&]:invert',
  color: ''
}

export const artworkFilter = (client: Pick<Client, 'artwork'> | null | undefined): string =>
  ARTWORK_FILTER[client?.artwork ?? 'color']

export const MONOCHROME_FILTER = 'brightness-0 [[data-theme=dark]_&]:invert'

export const KNOCKOUT_FILTER = 'brightness-0'

const BRAND = {
  renner: { base: '#7a0202', glow: '#ef0000' },
  madeira: { base: '#ae3d00', glow: '#f0801c' },
  herospark: { base: '#a31e3a', glow: '#ff305c' },
  magalu: { base: '#00264b', glow: '#0f88ff' }
} satisfies Record<string, ClientBrand>

export const CLIENTS: Client[] = [
  { name: 'Agibank', logo: agibank, logoLight: agibankColor },
  { name: 'iFood', logo: ifood, logoLight: ifoodColor },
  { name: 'Radware', logo: radware, artwork: 'light' },
  { name: 'América Móvil', logo: americamovil, artwork: 'color' },
  { name: 'GPA', logo: gpa, artwork: 'light' },
  { name: 'Fourbank', logo: fourbank, artwork: 'light' },
  { name: 'Global Fashion Group', logo: gfg, artwork: 'light' },
  {
    name: 'HeroSpark',
    logo: herospark,
    artwork: 'light',
    symbol: herosparkSymbol,
    wordmark: herosparkWordmark,
    brand: BRAND.herospark
  },
  { name: 'Itaú', logo: itau, artwork: 'light' },
  {
    name: 'Magalu',
    logo: magalu,
    logoLight: magaluColor,
    symbol: magaluSymbol,
    wordmark: magaluWordmark,
    brand: BRAND.magalu
  },
  {
    name: 'MadeiraMadeira',
    logo: madeiraWordmark,
    artwork: 'light',
    symbol: madeiraSymbol,
    wordmark: madeiraWordmark,
    brand: BRAND.madeira
  },
  {
    name: 'Renner',
    logo: renner,
    artwork: 'light',
    symbol: rennerSymbol,
    wordmark: rennerWordmark,
    brand: BRAND.renner
  },
  { name: 'Netshoes', logo: netshoes, artwork: 'color' },
  { name: 'Coca-Cola', logo: cocacola, artwork: 'light' },
  { name: 'Prime Video', logo: primevideo, artwork: 'light' },
  { name: 'Dafiti', logo: dafiti, artwork: 'dark' },
  { name: 'Caixa', logo: caixa, artwork: 'dark' },
  { name: 'Exame', logo: exame, artwork: 'dark' },
  { name: 'Mobiauto', logo: mobiauto, logoLight: mobiautoColor },
  { name: 'NZN', logo: nzn, logoLight: nznColor },
  { name: 'Zoop', logo: zoop, artwork: 'color' }
]

export const CLIENT_PHOTOS: Record<string, string> = {
  gpa: gpaPhoto,
  netshoes: netshoesPhoto
}

export const clientPhoto = (client: Pick<Client, 'name'> | null | undefined): string =>
  CLIENT_PHOTOS[normalizeClientName(client?.name)] ?? ''
