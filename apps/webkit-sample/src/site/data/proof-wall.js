import bancoDeLaNacion from '@aziontech/webkit/assets/clients/banco-de-la-nacion-logo-vector.svg'
import crefisa from '@aziontech/webkit/assets/clients/dark/clients/crefisa-logo.svg'
import marisa from '@aziontech/webkit/assets/clients/light/marisa-logo.svg'
import renner from '@aziontech/webkit/assets/clients/light/renner-logo.svg'
import { CLIENTS } from '@aziontech/webkit/assets/clients/registry'

const SUCCESS_CASE = 'https://www.azion.com/en/success-case/'

const registered = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

const wallItem = (client, story, colored) => ({
  alt: client.name,
  src: client.logo ?? '',
  href: `${SUCCESS_CASE}${story}`,
  client,
  colored
})

export const BANKS_AND_RETAIL_WALL = [
  wallItem(registered('Magalu'), 'magalu/', true),
  wallItem(
    { name: 'Banco de la Nación', logo: bancoDeLaNacion, artwork: 'dark' },
    'banco-de-la-nacion-achieves-speed-and-reduces-costs/',
    false
  ),
  wallItem(registered('Netshoes'), 'netshoes/', true),
  wallItem(registered('Agibank'), 'agibank/', false),
  wallItem(registered('Zoop'), 'zoop-case-performance-at-scale/', true),
  wallItem({ name: 'Crefisa', logo: crefisa, artwork: 'light' }, 'crefisa/', false),
  wallItem({ ...registered('Renner'), logoLight: renner }, 'renner/', true),
  wallItem(registered('Fourbank'), 'fourbank/', false),
  wallItem({ name: 'Marisa', logo: marisa, artwork: 'color' }, 'marisa/', true)
]

export const withClientAt = (index, client, href) =>
  BANKS_AND_RETAIL_WALL.map((item, at) =>
    at === index ? { alt: client.name, src: client.logo ?? '', href, client, colored: false } : item
  )
