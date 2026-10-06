import { computed, ref, watch } from 'vue'

import { azionPlans, planFor } from '../data/plans'
import { SAMPLE_MODES, setMode, useSampleMode } from './sample-mode'

const STORAGE_KEY = 'webkit-sample-preset'

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

export function setPlan(value) {
  if (isPlan(value)) preset.value = { ...preset.value, plan: value }
}

export function setAccountSwitcher(value) {
  preset.value = { ...preset.value, accountSwitcher: Boolean(value) }
}

export function useSamplePreset() {
  const { mode, accountEmpty } = useSampleMode()
  return {
    plan: computed(() => preset.value.plan),
    planInfo: computed(() => planFor(preset.value.plan) ?? azionPlans[0]),
    accountSwitcher: computed(() => preset.value.accountSwitcher),
    accountSwitcherVisible: computed(() => preset.value.accountSwitcher && !accountEmpty.value),
    setPlan,
    setAccountSwitcher,
    mode,
    accountEmpty,
    setMode,
    SAMPLE_MODES,
    SAMPLE_PLANS
  }
}

export function presetPlanName() {
  return (planFor(preset.value.plan) ?? azionPlans[0]).name
}

export function nextPlanUp() {
  const index = azionPlans.findIndex((plan) => plan.id === preset.value.plan)
  return index >= 0 ? (azionPlans[index + 1] ?? null) : azionPlans[1]
}

export function installSamplePreset(router) {
  router.afterEach((to) => {
    const plan = to.query.plan
    if (typeof plan === 'string') setPlan(plan.toLowerCase())
    const accounts = to.query.accounts
    if (typeof accounts === 'string') setAccountSwitcher(accounts !== '0' && accounts !== 'false')
  })
}
