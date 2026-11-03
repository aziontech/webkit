import type { PageSection } from '../../../ui/sections'

export interface LandingPage {
  /** The language the page's copy is written in, as an HTML lang value. */
  lang: 'en' | 'pt-BR' | 'es'
  /** The azion.com page this one translates. */
  source: string
  sections: PageSection[]
}

// One file per landing page, named by its /site/lp slug; this index never lists them by hand.
const MODULES = import.meta.glob<{ default: LandingPage }>(['./*.js', './*.ts', '!./index.ts'])

const slugOf = (path: string) => path.replace(/^\.\//, '').replace(/\.(js|ts)$/, '')

const LOADERS: Record<string, () => Promise<{ default: LandingPage }>> = Object.fromEntries(
  Object.entries(MODULES).map(([path, load]) => [slugOf(path), load])
)

export const LANDING_PAGE_SLUGS = Object.keys(LOADERS).sort()

export const hasLandingPage = (slug: string) => slug in LOADERS

export const loadLandingPage = async (slug: string) => (await LOADERS[slug]()).default
