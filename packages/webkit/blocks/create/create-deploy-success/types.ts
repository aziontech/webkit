/** Whether the flow made the resource or attached one that already existed. */
export type DeploySuccessResourceState = 'created' | 'bound'

/** The Git source the service deploys from. */
export interface DeploySuccessSource {
  /** The account or organization, shown as the scope tag in the lead. */
  scope: string
  /** Provider glyph class. */
  icon: string
  /** The repository as owner and name. */
  repository: string
  /** Where the repository opens, in a new tab. */
  href: string
  /** The production branch. */
  branch: string
}

/** The live service the deployment card shows. */
export interface DeploySuccessDeployment {
  /** Service name, the card heading. */
  name: string
  /** When it was created, already formatted, such as Created just now. */
  created: string
  /** The domain it answers on, without the scheme. */
  domain: string
  /** The full address Visit site and the domain link open. */
  url: string
  /** Where Add custom domain leads. */
  addDomainHref: string
  /** The Git source; left out, the lead drops the scope tag and the repository row. */
  source?: DeploySuccessSource
}

/** One resource the flow created or bound. */
export interface DeploySuccessResource {
  /** Stable key. */
  key: string
  /** Kind, such as Service or Storage. */
  kind: string
  /** Kind glyph class. */
  icon: string
  /** Display name. */
  name: string
  /** Created or bound. */
  state: DeploySuccessResourceState
  /** Its ID or its contents, shown after the kind. */
  reference: string
}

/** One next-step tile. */
export interface DeploySuccessNextStep {
  /** Glyph class. */
  icon: string
  /** Title, verb first. */
  title: string
  /** One sentence. */
  description: string
  /** Where the tile leads; left out, the tile is a button that emits next-step. */
  href?: string
  /** Shows the Recommended badge. */
  recommended?: boolean
}
