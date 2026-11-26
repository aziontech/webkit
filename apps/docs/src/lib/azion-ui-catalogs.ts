import type { ConfigProviderProps } from '@aziontech/webkit/config-provider'
import { shallowReactive } from 'vue'

type Catalog = NonNullable<ConfigProviderProps['catalogs']>[string]

const LOADERS: Record<string, () => Promise<Catalog>> = {
  'pt-BR': () => import('@aziontech/webkit/locales/pt-BR').then((module) => module.ptBR),
  es: () => import('@aziontech/webkit/locales/es').then((module) => module.es)
}

export const webkitCatalogs = shallowReactive<Record<string, Catalog>>({})

export async function loadWebkitCatalog(locale: string): Promise<void> {
  const load = LOADERS[locale]
  if (!load || webkitCatalogs[locale]) return
  webkitCatalogs[locale] = await load()
}
