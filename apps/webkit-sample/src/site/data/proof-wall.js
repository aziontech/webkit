import bancoDeLaNacion from '@aziontech/webkit/assets/banco-de-la-nacion-extended-mono.svg'
import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
import crefisa from '@aziontech/webkit/assets/crefisa-extended-color.svg'
import crefisaMono from '@aziontech/webkit/assets/crefisa-extended-mono.svg'
import marisa from '@aziontech/webkit/assets/marisa-extended-color.svg'

const SUCCESS_CASE = 'https://www.azion.com/en/success-case/'

const registered = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

const wallItem = (client, story) => ({
  alt: client.name,
  src: client.logo ?? '',
  href: `${SUCCESS_CASE}${story}`,
  client
})

export const BANKS_AND_RETAIL_WALL = [
  wallItem(registered('Magalu'), 'magalu/'),
  wallItem(
    { name: 'Banco de la Nación', logo: bancoDeLaNacion, artwork: 'dark' },
    'banco-de-la-nacion-achieves-speed-and-reduces-costs/'
  ),
  wallItem(registered('Netshoes'), 'netshoes/'),
  wallItem(registered('Agibank'), 'agibank/'),
  wallItem(registered('Zoop'), 'zoop-case-performance-at-scale/'),
  wallItem({ name: 'Crefisa', logo: crefisa, logoLight: crefisaMono }, 'crefisa/'),
  wallItem(registered('Renner'), 'renner/'),
  wallItem(registered('Fourbank'), 'fourbank/'),
  wallItem({ name: 'Marisa', logo: marisa, artwork: 'color' }, 'marisa/')
]

export const withClientAt = (index, client, href) =>
  BANKS_AND_RETAIL_WALL.map((item, at) =>
    at === index ? { alt: client.name, src: client.logo ?? '', href, client } : item
  )
