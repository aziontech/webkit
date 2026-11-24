/** A GitHub account or organization the person can import from. */
export interface CreateHubAccount {
  /** The name shown in the scope Select. */
  label: string
  /** The scope key. */
  value: string
}

/** One repository in the selected scope, most recently pushed first. */
export interface CreateHubRepository {
  /** The repository name. */
  name: string
  /** When it was last pushed, as an ISO 8601 string. */
  pushedAt: string
  /** The framework or kind glyph, an icon class. */
  icon: string
}

/** One template tile. */
export interface CreateHubTemplate {
  /** The key of its deploy page. */
  slug: string
  /** The template name. */
  title: string
  /** One sentence on what it deploys. */
  description: string
  /** Who publishes it, shown beside the title on list tiles. */
  vendor?: string
  /** The framework or kind glyph, an icon class. */
  icon: string
  /** Extra classes on the glyph, such as the dark-theme invert. */
  markClass: string
}

/** How a template section lays out its tiles. */
export type CreateHubTemplateSectionKind = 'cards' | 'list'

/** A group of templates under one heading. */
export interface CreateHubTemplateSection {
  /** Stable key. */
  id: string
  /** The section heading. */
  label: string
  /** Recommended cards in three columns, or two-column integration tiles. */
  kind: CreateHubTemplateSectionKind
  /** The templates in the section. */
  items: CreateHubTemplate[]
}
