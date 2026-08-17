// The SAMPLE PRESET — the account this prototype is pretending to be.
//
// A console is not one product; it is one product seen from a contract. A Hobby
// account has one account and nothing in it. An Enterprise account has a tree of
// accounts, a plan tag that outranks the upgrade CTA, and rows in every module.
// Reviewing the console means walking BOTH, and the sample used to be able to
// state only one of them: the version (empty / populated) was switchable and
// everything else — the plan, the account switcher in the header — was hardcoded
// to one answer nobody could change without editing a file.
//
// This module is that configuration, in one place:
//
//   plan             · hobby | pro | enterprise (../plans.js — the same tiers the
//                      entrance offers, so the tag and the upgrade drawer agree).
//                      It is the ORGANIZATION's contract, not the signed-in user's:
//                      one person is on three different tiers in three organizations,
//                      so the tier is tagged on the organization switcher and never
//                      on the profile.
//   accountSwitcher  · whether the header's tenancy chain carries the ACCOUNT link.
//                      Organization and workspace are not knobs: every account has
//                      one of each, so they are what a Hobby account already shows.
//                      Switching between ACCOUNTS is the thing a single-account
//                      contract does not have.
//   version          · empty | populated — held next door in ./sample-mode.js,
//                      re-exported here so one panel can drive the whole preset.
//
// ── THE DEFAULTS ARE A NEW ACCOUNT ──
//
// Hobby, no account switcher, empty. A fresh browser therefore opens the console
// as somebody who just signed up, which is the state it is least designed for and
// so the one worth meeting first — the same argument ./sample-mode.js makes for
// opening EMPTY. Everything above it is one panel away (the account menu's
// "Sample preset").
//
// ── HOW IT IS SET ──
//
// The "Sample preset" panel in the account menu (../components/ui/SamplePresetDrawer.vue),
// or `?plan=pro` / `?accounts=1` on any URL so a review comment can pin the exact
// account it is talking about. Like `?state=`, the query is read on arrival and
// then forgotten: it is a way IN to a configuration, not part of the route.
//
// Persisted in localStorage, for the same reason the version is: the account you
// are reviewing is a property of the session, not of the page.
import { computed, ref, watch } from 'vue'

import { azionPlans, planFor } from '../data/plans'
import { SAMPLE_MODES, setMode, useSampleMode } from './sample-mode'

const STORAGE_KEY = 'webkit-sample-preset'

/**
 * The tiers the preset offers, in the order the entrance offers them, shaped as
 * selection items (`value` + `label` + `description`). `price` and `severity` ride
 * along so the panel can preview the tag the profile will carry.
 */
export const SAMPLE_PLANS = azionPlans.map((plan) => ({
  value: plan.id,
  label: plan.name,
  description: plan.description,
  price: plan.price,
  severity: plan.severity
}))

const isPlan = (value) => SAMPLE_PLANS.some((option) => option.value === value)

const DEFAULTS = { plan: 'hobby', accountSwitcher: false }

const readStored = () => {
  if (typeof localStorage === 'undefined') return { ...DEFAULTS }
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!stored || typeof stored !== 'object') return { ...DEFAULTS }
    return {
      plan: isPlan(stored.plan) ? stored.plan : DEFAULTS.plan,
      accountSwitcher: Boolean(stored.accountSwitcher)
    }
  } catch {
    // A hand-edited or half-written entry is not worth a broken console.
    return { ...DEFAULTS }
  }
}

const preset = ref(readStored())

watch(
  preset,
  (value) => {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true }
)

/** Switch tier. Ignores anything that is not one of the three. */
export function setPlan(value) {
  if (isPlan(value)) preset.value = { ...preset.value, plan: value }
}

/** Show or hide the header's account link. */
export function setAccountSwitcher(value) {
  preset.value = { ...preset.value, accountSwitcher: Boolean(value) }
}

/**
 * The account the sample is pretending to be.
 *
 * `plan` is the tier id; `planInfo` is the whole record from ../plans.js — its
 * `name` and `severity` are what the profile tag renders, so the tag can never
 * disagree with the tier the upgrade drawer would sell.
 *
 * The version (`mode` / `accountEmpty`) rides along so the preset panel binds one
 * object; pages that only care whether the account owns anything keep using
 * `useSampleMode` directly.
 */
export function useSamplePreset() {
  const { mode, accountEmpty } = useSampleMode()
  return {
    plan: computed(() => preset.value.plan),
    planInfo: computed(() => planFor(preset.value.plan) ?? azionPlans[0]),
    accountSwitcherVisible: computed(() => preset.value.accountSwitcher),
    setPlan,
    setAccountSwitcher,
    mode,
    accountEmpty,
    setMode,
    SAMPLE_MODES,
    SAMPLE_PLANS
  }
}

/**
 * The tier's NAME, for the surfaces that store a plan as a name rather than an id —
 * an organization's `plan` (../organizations.js), which is what the entrance writes
 * when it creates one. Read as a function so a caller inside a `computed` tracks it.
 */
export function presetPlanName() {
  return (planFor(preset.value.plan) ?? azionPlans[0]).name
}

/**
 * The next tier up, or null on the top one — what the account menu's upgrade CTA
 * offers. Read from the ladder rather than written into the button, so an
 * Enterprise account is not sold Enterprise and a fourth tier needs no edit here.
 */
export function nextPlanUp() {
  const index = azionPlans.findIndex((plan) => plan.id === preset.value.plan)
  return index >= 0 ? (azionPlans[index + 1] ?? null) : azionPlans[1]
}

/** Read `?plan=` / `?accounts=` on arrival. Call once, with the router. */
export function installSamplePreset(router) {
  router.afterEach((to) => {
    const plan = to.query.plan
    if (typeof plan === 'string') setPlan(plan.toLowerCase())
    const accounts = to.query.accounts
    if (typeof accounts === 'string') setAccountSwitcher(accounts !== '0' && accounts !== 'false')
  })
}
