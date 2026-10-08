import agibankColor from './agibank-extended-color.svg'
import agibank from './agibank-extended-reversed.svg'
import americamovil from './americamovil-extended-color.svg'
import caixa from './caixa-extended-color.svg'
import caixaSymbol from './caixa-symbol-color.svg'
import cocacola from './cocacola-extended-color.svg'
import dafitiMono from './dafiti-extended-mono.svg'
import dafiti from './dafiti-extended-reversed.svg'
import exame from './exame-extended-color.svg'
import fourbankColor from './fourbank-extended-color.svg'
import fourbank from './fourbank-extended-reversed.svg'
import gfgMono from './gfg-extended-mono.svg'
import gfg from './gfg-extended-reversed.svg'
import gpaColor from './gpa-extended-color.svg'
import gpa from './gpa-extended-reversed.svg'
import gpaSymbol from './gpa-symbol-color.svg'
import herospark from './herospark-extended-color.svg'
import herosparkSymbol from './herospark-symbol-reversed.svg'
import ifood from './ifood-extended-color.svg'
import ifoodSymbol from './ifood-symbol-color.svg'
import itau from './itau-extended-reversed.webp'
import itauSymbol from './itau-symbol-color.svg'
import madeiraColor from './madeiramadeira-extended-color.svg'
import madeira from './madeiramadeira-extended-reversed.svg'
import madeiraSymbol from './madeiramadeira-symbol-reversed.svg'
import magalu from './magalu-extended-color.svg'
import magaluSymbol from './magalu-symbol-color.png'
import mobiautoMono from './mobiauto-extended-mono.svg'
import mobiauto from './mobiauto-extended-reversed.svg'
import netshoesColor from './netshoes-extended-color.svg'
import netshoes from './netshoes-extended-reversed.svg'
import nznColor from './nzn-extended-color.svg'
import nzn from './nzn-extended-reversed.svg'
import gpaPhoto from './photos/gpa-photo.jpg'
import netshoesPhoto from './photos/netshoes-photo.jpg'
import primevideoMono from './primevideo-extended-mono.svg'
import primevideo from './primevideo-extended-reversed.svg'
import radwareColor from './radware-extended-color.svg'
import radware from './radware-extended-reversed.svg'
import renner from './renner-extended-color.svg'
import rennerSymbol from './renner-symbol-reversed.svg'
import traySymbol from './tray-symbol-color.svg'
import zoop from './zoop-extended-color.svg'

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
  { name: 'iFood', logo: ifood, artwork: 'color' },
  { name: 'Radware', logo: radware, logoLight: radwareColor },
  { name: 'América Móvil', logo: americamovil, artwork: 'color' },
  { name: 'GPA', logo: gpa, logoLight: gpaColor },
  { name: 'Fourbank', logo: fourbank, logoLight: fourbankColor },
  { name: 'Global Fashion Group', logo: gfg, logoLight: gfgMono },
  {
    name: 'HeroSpark',
    logo: herospark,
    artwork: 'color',
    symbol: herosparkSymbol,
    brand: BRAND.herospark
  },
  { name: 'Itaú', logo: itau, artwork: 'light' },
  {
    name: 'Magalu',
    logo: magalu,
    artwork: 'color',
    symbol: magaluSymbol,
    brand: BRAND.magalu
  },
  {
    name: 'MadeiraMadeira',
    logo: madeira,
    logoLight: madeiraColor,
    symbol: madeiraSymbol,
    brand: BRAND.madeira
  },
  {
    name: 'Renner',
    logo: renner,
    artwork: 'color',
    symbol: rennerSymbol,
    brand: BRAND.renner
  },
  { name: 'Netshoes', logo: netshoes, logoLight: netshoesColor },
  { name: 'Coca-Cola', logo: cocacola, artwork: 'color' },
  { name: 'Prime Video', logo: primevideo, logoLight: primevideoMono },
  { name: 'Dafiti', logo: dafiti, logoLight: dafitiMono },
  { name: 'Caixa', logo: caixa, artwork: 'color' },
  { name: 'Exame', logo: exame, artwork: 'color' },
  { name: 'Mobiauto', logo: mobiauto, logoLight: mobiautoMono },
  { name: 'NZN', logo: nzn, logoLight: nznColor },
  { name: 'Zoop', logo: zoop, artwork: 'color' }
]

export const CLIENT_PHOTOS: Record<string, string> = {
  gpa: gpaPhoto,
  netshoes: netshoesPhoto
}

export const clientPhoto = (client: Pick<Client, 'name'> | null | undefined): string =>
  CLIENT_PHOTOS[normalizeClientName(client?.name)] ?? ''

export const normalizeClientName = (name: string | null | undefined): string =>
  (name ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

export const CLIENT_SYMBOLS: Record<string, string> = {
  caixaeconomicafederal: caixaSymbol,
  gpa: gpaSymbol,
  ifood: ifoodSymbol,
  itau: itauSymbol,
  tray: traySymbol
}

export const clientSymbolFor = (name: string | null | undefined): string | null =>
  CLIENT_SYMBOLS[normalizeClientName(name)] ?? null
