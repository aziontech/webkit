import type { ConfigProviderProps } from '@aziontech/ui/config-provider'
import { shallowReactive } from 'vue'

type Catalog = NonNullable<ConfigProviderProps['catalogs']>[string]

const LOADERS: Record<string, () => Promise<Catalog>> = {
  'pt-BR': () => import('@aziontech/ui/locales/pt-BR').then((module) => module.ptBR),
  es: () => import('@aziontech/ui/locales/es').then((module) => module.es)
}

export const azionUiCatalogs = shallowReactive<Record<string, Catalog>>({})

export async function loadAzionUiCatalog(locale: string): Promise<void> {
  const load = LOADERS[locale]
  if (!load || azionUiCatalogs[locale]) return
  azionUiCatalogs[locale] = await load()
}
