/** The kind of entry an access list holds. */
export type CreateWizardListType = 'asn' | 'ip_cidr' | 'countries'

/** A policy the list can run on. */
export interface CreateWizardPolicy {
  /** The policy key. */
  value: string
  /** The policy name. */
  label: string
  /** The application it protects. */
  description: string
  /** Whether IP filtering is already on in it. */
  ready: boolean
}

/** The values of the Create Access List form. */
export interface CreateWizardValues {
  /** The list name. */
  name: string
  /** The kind of entry the list holds. */
  type: CreateWizardListType
  /** The entries, one per line. */
  items: string
}

/** What submit sends: the form values and where the list runs. */
export interface CreateWizardSubmission extends CreateWizardValues {
  /** The policy it runs on; empty when skipped. */
  policy: string
  /** Whether IP filtering is turned on in that policy as part of the create. */
  enableModule: boolean
}

/** A step of the wizard. */
export type CreateWizardStep = 'where-it-runs' | 'module' | 'general' | 'settings' | 'review'
