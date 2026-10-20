import { ref, watch } from 'vue'

const STORAGE_KEY = 'webkit-sample-sidebar-collapsed'
const EXPANDED_KEY = 'webkit-sample-sidebar-expanded'
const WIDTH_KEY = 'webkit-sample-sidebar-width'

const readStoredCollapsed = () => {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

const readStoredWidth = () => {
  if (typeof localStorage === 'undefined') return null
  const stored = Number(localStorage.getItem(WIDTH_KEY))
  return Number.isFinite(stored) && stored > 0 ? stored : null
}

const readStoredExpanded = () => {
  if (typeof localStorage === 'undefined') return []
  try {
    const stored = JSON.parse(localStorage.getItem(EXPANDED_KEY) ?? '[]')
    return Array.isArray(stored) ? stored.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

const expanded = ref(readStoredExpanded())

const navPath = ref([])

const navEntering = ref(false)

const navScroll = ref(0)

export function setNavScroll(value) {
  navScroll.value = Math.max(0, value)
}

let lastLevelFor = null
let shownLevel = null
let levelSeeded = false

export function reportNavLevel(activeId, levels) {
  const level = levels.join('/')
  if (activeId !== lastLevelFor) {
    navEntering.value = levelSeeded && level !== shownLevel
    if (level !== shownLevel) navScroll.value = 0
    lastLevelFor = activeId
    shownLevel = level
    levelSeeded = true
  }
  if (level !== navPath.value.join('/')) navPath.value = levels
}

export function setNavPath(levels) {
  navPath.value = levels
  shownLevel = levels.join('/')
}

watch(
  expanded,
  (value) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(EXPANDED_KEY, JSON.stringify(value))
    }
  },
  { deep: true }
)

const collapsed = ref(readStoredCollapsed())
const railWidth = ref(readStoredWidth())

watch(collapsed, (value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(value))
  }
})

watch(railWidth, (value) => {
  if (typeof localStorage !== 'undefined' && value != null) {
    localStorage.setItem(WIDTH_KEY, String(Math.round(value)))
  }
})

export function useSidebar() {
  return { collapsed, railWidth, expanded, navPath, navEntering, navScroll }
}
