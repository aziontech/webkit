/** The kind of resource a card or a dependency row deploys. */
export type ReleaseImpactResourceType =
  'service' | 'policy' | 'storage' | 'errorPage' | 'module' | 'integration'

/** One version a resource can deploy at. */
export interface ReleaseImpactVersion {
  /** Version identifier. */
  id: string
  /** The latest Ready version. */
  current?: boolean
  /** How long ago it was built, e.g. 2 hours ago. */
  age: string
}

/** A dependency row inside a resource card. */
export interface ReleaseImpactDependency {
  /** Resource name. */
  name: string
  /** The version it deploys at, or latest to track the latest Ready one. */
  versionId: string
  /** The versions it can deploy at. */
  versions: ReleaseImpactVersion[]
  /** Other services that use the same resource. */
  sharedWith?: string[]
}

/** The dependencies of one type under a resource card. */
export interface ReleaseImpactDependencyGroup {
  /** The dependency type, which names the group. */
  type: ReleaseImpactResourceType
  /** The dependencies. */
  rows: ReleaseImpactDependency[]
}

/** One resource the release deploys. */
export interface ReleaseImpactResource {
  /** The resource type, unique per release. */
  type: ReleaseImpactResourceType
  /** Resource name. */
  name: string
  /** The release cannot leave it out. */
  required?: boolean
  /** A switch can leave it out of the release. */
  canToggle?: boolean
  /** It deploys as it is, with no version to pick. */
  readonly?: boolean
  /** It is part of the release. */
  enabled: boolean
  /** A line shown while it is left out. */
  note?: string
  /** The version it deploys at, or latest to track the latest Ready one; empty when it has none. */
  versionId: string
  /** The versions it can deploy at; empty when it has no Ready version. */
  versions: ReleaseImpactVersion[]
  /** Its dependencies, grouped by type. */
  groups: ReleaseImpactDependencyGroup[]
}

/** A project a Deployment Setting deploys. */
export interface ReleaseImpactProject {
  /** Project identifier. */
  id: string
  /** Project name. */
  name: string
  /** Domains the project serves. */
  domainsCount: number
}

/** An environment under a Deployment Setting. */
export interface ReleaseImpactEnvironment {
  /** Environment identifier. */
  id: string
  /** Environment name, e.g. Production. */
  name: string
  /** The projects that deploy in it. */
  projects: ReleaseImpactProject[]
}

/** A Deployment Setting the release reaches. */
export interface ReleaseImpactSettings {
  /** Setting identifier. */
  id: string
  /** Setting name. */
  name: string
  /** Domains reached through it. */
  domainsCount: number
  /** The environments it deploys to. */
  environments: ReleaseImpactEnvironment[]
}
