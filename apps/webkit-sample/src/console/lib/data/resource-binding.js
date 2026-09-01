// THE ANSWER TO "EXISTING OR NEW", AS ONE OBJECT.
//
// A create that needs another resource asks one question about it, and the answer is a
// pair: WHICH BRANCH the reader took, and that branch's own value. Holding those as two
// form keys means every consumer has to keep them agreeing — a summary line that reads
// `name` while the reader is on the existing branch prints a name nobody chose.
//
// So it is one object on one `v-model` (../../components/resource/ResourceBinding.vue),
// and everything that needs to know WHICH resource the reader ended up with reads it
// through the two derivations below rather than re-deriving it locally. Exactly the shape
// ./firewalls.js gives the firewall question — `defaultFirewallProtection` /
// `firewallBindingName` / `firewallIsBound` — because it is the same question with an
// extra "neither" branch.

/**
 * A fresh answer. Starts on the EXISTING branch: a create's cheapest good outcome is
 * reusing something the account already has, and the branch that creates a second resource
 * beside it is a decision, not a default.
 *
 * @param {object} [overrides] Seeds — `mode` to open on the create branch, `existing` to
 *   arrive with one already picked (what a `?application=` link does).
 */
export const defaultResourceBinding = (overrides = {}) => ({
  mode: 'existing',
  // The chosen resource's NAME, when `mode` is `existing`. The name and not an id — it is
  // what every surface that binds a resource shows, and what the provisioning log narrates.
  existing: '',
  // The new resource's name, when `mode` is `new`.
  name: '',
  ...overrides
})

/**
 * The resource a binding names, or `''` when the branch it is on has not been answered.
 * One derivation, so a wizard's summary, its provisioning log and the created chain can
 * never disagree about which resource the reader picked.
 */
export const resourceBindingName = (binding) =>
  binding?.mode === 'new'
    ? String(binding.name ?? '').trim()
    : String(binding?.existing ?? '').trim()

/** Whether a binding REUSES a resource rather than creating one. */
export const resourceBindingIsExisting = (binding) => binding?.mode !== 'new'
