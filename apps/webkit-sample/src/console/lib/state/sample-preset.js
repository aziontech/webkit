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

export const DEPLOY_FLOWS = [
  {
    value: 'environment',
    label: 'Environment first',
    description:
      'Build, map the dependencies, then pick an environment. Its Deployment Settings decide which workloads publish the version.'
  },
  {
    value: 'workload',
    label: 'Workload first',
    description:
      'Build, map the dependencies, then pick one workload (bound or new) and the environment it publishes to.'
  }
]

export const NAV_MODELS = [
  {
    value: 'flat',
    label: 'Flat',
    description:
      'Every module is a root row and Settings is the only level — the sidebar as it is today.'
  },
  {
    value: 'levels',
    label: 'Levels',
    description:
      'Products open a level of their own: Overview plus the collection, with the label navigating and the arrow drilling. Real-Time Metrics drills into its dashboards.'
  }
]

const isPlan = (value) => SAMPLE_PLANS.some((option) => option.value === value)

const isDeployFlow = (value) => DEPLOY_FLOWS.some((option) => option.value === value)

const isNavModel = (value) => NAV_MODELS.some((option) => option.value === value)

const DEFAULTS = {
  plan: 'hobby',
  accountSwitcher: false,
  deployFlow: 'environment',
  navModel: 'flat'
}

const readStored = () => {
  if (typeof localStorage === 'undefined') return { ...DEFAULTS }
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!stored || typeof stored !== 'object') return { ...DEFAULTS }
    return {
      plan: isPlan(stored.plan) ? stored.plan : DEFAULTS.plan,
      accountSwitcher: Boolean(stored.accountSwitcher),
      deployFlow: isDeployFlow(stored.deployFlow) ? stored.deployFlow : DEFAULTS.deployFlow,
      navModel: isNavModel(stored.navModel) ? stored.navModel : DEFAULTS.navModel
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

export function setDeployFlow(value) {
  if (isDeployFlow(value)) preset.value = { ...preset.value, deployFlow: value }
}

export function setNavModel(value) {
  if (isNavModel(value)) preset.value = { ...preset.value, navModel: value }
}

export const deployFlow = computed(() => preset.value.deployFlow)

export const navModel = computed(() => preset.value.navModel)

export function useSamplePreset() {
  const { mode, accountEmpty } = useSampleMode()
  return {
    plan: computed(() => preset.value.plan),
    planInfo: computed(() => planFor(preset.value.plan) ?? azionPlans[0]),
    accountSwitcher: computed(() => preset.value.accountSwitcher),
    accountSwitcherVisible: computed(() => preset.value.accountSwitcher && !accountEmpty.value),
    setPlan,
    setAccountSwitcher,
    deployFlow,
    setDeployFlow,
    navModel,
    setNavModel,
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
    const flow = to.query['deploy-flow']
    if (typeof flow === 'string') setDeployFlow(flow.toLowerCase())
    const nav = to.query.nav
    if (typeof nav === 'string') setNavModel(nav.toLowerCase())
  })
}
