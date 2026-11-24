import type { TagSeverity } from '@aziontech/webkit/tag'

/** One Ready version of a resource. */
export interface DeployDrawerVersion {
  /** Stable key, the version id. */
  id: string
  /** The version name. */
  name: string
  /** Who built it. */
  author: string
  /** When it was built, as an ISO 8601 string. */
  createdAt: string
  /** Whether it is the version live now. */
  active?: boolean
}

/** A resource the deployment sends live, or one it references. */
export interface DeployDrawerDependency {
  /** Stable key; picked versions are keyed by it. */
  key: string
  /** The kind of resource (Service, Module, Integration). */
  label: string
  /** The resource name. */
  name: string
  /** The kind glyph, an icon class. */
  icon: string
  /** A note shown instead of the version picker; empty for a pickable resource. */
  note: string
  /** Other services that reference it; set, it carries a Shared tag and deploys at one version for all of them. */
  sharedWith?: string[]
  /** How many Ready versions exist; the list may hold only the most recent. */
  total: number
  /** The most recent Ready versions, newest first. */
  versions: DeployDrawerVersion[]
}

/** A top-level resource with the resources it references. */
export interface DeployDrawerResource extends DeployDrawerDependency {
  /** Whether the project owns it. */
  owner: boolean
  /** The modules and integrations it references. */
  dependencies: DeployDrawerDependency[]
}

/** The domains of a project in one environment. */
export interface DeployDrawerDomainGroup {
  /** The environment they answer in. */
  environment: string
  /** How many domains there are. */
  total: number
  /** The count, already phrased (10 of 22 domains). */
  summary: string
  /** The first domains. */
  domains: string[]
}

/** A project the deployment can go live on. */
export interface DeployDrawerProject {
  /** Stable key; absent for the project Create new makes. */
  id?: string
  /** The project name. */
  name: string
  /** The domain a new project answers on. */
  domain?: string
  /** One line on what the project serves. */
  detail?: string
  /** Its domains per environment. */
  domains?: DeployDrawerDomainGroup[]
}

/** A project that already exists. */
export interface DeployDrawerExistingProject extends DeployDrawerProject {
  /** Stable key. */
  id: string
}

/** A group of projects in the project picker. */
export interface DeployDrawerProjectGroup {
  /** Stable key. */
  key: string
  /** The group heading. */
  label: string
  /** The projects in it. */
  projects: DeployDrawerExistingProject[]
}

/** An environment the deployment can go live in. */
export interface DeployDrawerEnvironment {
  /** The environment name, also its value. */
  name: string
  /** One sentence on what deploying there does. */
  description: string
  /** A short tag beside the name (Last used); empty for none. */
  tag: string
  /** The color of the tag; info when left out. */
  tagSeverity?: TagSeverity
  /** Locked: the choice card shows but cannot be picked. */
  disabled?: boolean
}

/** A project the deployment reaches through shared Deployment Settings. */
export interface DeployDrawerImpactedProject {
  /** Stable key. */
  id: string
  /** The project name. */
  name: string
  /** Whether it is the project picked above. */
  selected?: boolean
  /** Its domains per environment. */
  domains: DeployDrawerDomainGroup[]
}

/** The projects reached in one environment. */
export interface DeployDrawerImpact {
  /** The environment name. */
  environment: string
  /** The projects reached there. */
  projects: DeployDrawerImpactedProject[]
}

/** A build in progress before the deployment can go live. */
export interface DeployDrawerBuild {
  /** The resource being built. */
  name: string
  /** The version being built. */
  version: string
  /** Seconds since the build started. */
  elapsed: number
}

/** Whether the deployment uses an existing project or creates one. */
export type DeployDrawerProjectMode = 'existing' | 'new'

/** What the form holds, and what submit sends. */
export interface DeployDrawerValues {
  /** The picked version id per resource key. */
  versions: Record<string, string>
  /** Use an existing project or create one. */
  projectMode: DeployDrawerProjectMode
  /** The existing project picked. */
  projectId: string
  /** The environment it goes live in. */
  environment: string
}
