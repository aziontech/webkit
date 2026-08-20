// THE WORKLOAD CREATE, IN PARTS.
//
// A workload is the public entry point — the domain traffic arrives on, and what that
// domain serves. Its create asks three things, and they are three parts because each one
// is a decision the reader makes with the previous one already settled:
//
//   workload    the NAME — and the name is what produces the domain, so naming it is
//               choosing the address. Nothing else on this part.
//   protection  whether a FIREWALL stands in front of it, and which one.
//   release     what the workload actually SERVES, with the firewall from the part before
//               folded in. This is the part that makes the other two mean something: a
//               workload with a domain and no release is an address that answers nothing.
//
// WHY NOT ONE SCREEN. Unlike the application create, this flow does not branch — there is
// one path through it. It is in parts for the other reason a wizard earns its keep: the
// parts are SEQUENTIALLY DEPENDENT. The domain is derived from the name, the release
// combines the firewall, and the commit provisions a chain out of all three. Asking them
// together would let the reader compose a release for a workload they have not named and a
// firewall they have not chosen — three answers that only make sense in order.
//
// THE COMMIT IS A PROVISIONING RUN. The last part's button creates the chain (workload →
// domain → certificate → firewall → release) and streams it through the same card the
// application deploy uses, on the workload pipeline (./workload-provisioning.js).

/** The one flow's parts, in order. Shape matches ./application-flows.js so the shared
 *  wizard chrome (components/page/WizardPage.vue) reads both without a special case. */
export const WORKLOAD_STEPS = [
  { id: 'workload', label: 'Name the workload' },
  { id: 'protection', label: 'Protect it' },
  { id: 'release', label: 'Compose the release' }
]

/**
 * The firewalls a workload can be protected by, and what each one is FOR — the difference
 * a reader needs to pick, which a bare name does not give them.
 *
 * The values match ../data/deployment-strategies.js `FIREWALL_OPTIONS`, so a workload
 * protected here and a strategy authored there name the same firewall. Two lists of
 * firewall names that drift apart is the same bug one level down.
 */
export const WORKLOAD_FIREWALLS = [
  {
    value: 'Default Firewall',
    label: 'Default Firewall',
    description: 'Azion’s baseline rule set — DDoS protection and the standard WAF ruleset.'
  },
  {
    value: 'edge-firewall',
    label: 'edge-firewall',
    description: 'Your own rules, evaluated at the edge before the request reaches the app.'
  },
  {
    value: 'waf-strict',
    label: 'waf-strict',
    description: 'The strict WAF profile. Blocks more, and needs tuning against real traffic.'
  }
]

/** The applications a release can serve. */
export const WORKLOAD_APPLICATIONS = [
  { value: 'edge-shop', label: 'edge-shop' },
  { value: 'azion-docs-site', label: 'azion-docs-site' },
  { value: 'marketing-landing', label: 'marketing-landing' },
  { value: 'internal-admin', label: 'internal-admin' }
]

/** Version selectors shared by every binding in the release. */
export const WORKLOAD_VERSIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'v2', label: 'v2' },
  { value: 'v1', label: 'v1' }
]

/** The environment the release binds to. */
export const WORKLOAD_ENVIRONMENTS = [
  { value: 'Production', label: 'Production' },
  { value: 'Stage', label: 'Stage' }
]
