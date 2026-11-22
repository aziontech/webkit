import { computed, type ComputedRef, type Ref, ref, type WritableComputedRef } from 'vue'

import type { EventsExplorerFilters } from '../view-events-explorer.vue'

/** One investigation tab: its own filters and search. */
export interface InvestigationSession {
  /** Stable key of the tab. */
  id: string
  /** Name on the tab. */
  name: string
  /** Applied filters of the tab. */
  filters: EventsExplorerFilters
  /** Search text of the tab. */
  search: string
}

/** The open investigations and what can be done with them. */
export interface UseInvestigationSessionsReturn {
  /** The open investigations, in order. */
  sessions: ComputedRef<InvestigationSession[]>
  /** Id of the active investigation. */
  activeSession: WritableComputedRef<string>
  /** The active investigation. */
  currentSession: ComputedRef<InvestigationSession>
  /** Filters of the active investigation. */
  filters: WritableComputedRef<EventsExplorerFilters>
  /** Search of the active investigation. */
  search: WritableComputedRef<string>
  /** Why the last action did nothing, read out to the user. */
  notice: ComputedRef<string>
  /** Opens a new investigation. */
  create: () => void
  /** Copies an investigation next to itself. */
  duplicate: (id: string) => void
  /** Closes an investigation, never the last one. */
  close: (id: string) => void
  /** Renames an investigation. */
  rename: (id: string, name: string) => void
}

const sessionLimit = 5
const limitNotice = `Up to ${sessionLimit} investigations stay open. Close one to start another.`

const initialSessions = (): InvestigationSession[] => [
  { id: 's1', name: 'All traffic', filters: { period: ['24h'] }, search: '' },
  {
    id: 's2',
    name: 'API errors',
    filters: { period: ['6h'], level: ['Error'], host: ['api.example.com'] },
    search: ''
  },
  {
    id: 's3',
    name: 'Security blocks',
    filters: { period: ['1h'], source: ['security'] },
    search: 'blocked'
  }
]

interface SessionState {
  sessions: Ref<InvestigationSession[]>
  active: Ref<string>
  notice: Ref<string>
}

const sessionActions = ({ sessions, active, notice }: SessionState) => {
  let sessionSeed = 3

  const nextId = () => {
    sessionSeed += 1
    return sessionSeed
  }

  const full = () => {
    if (sessions.value.length < sessionLimit) return false
    notice.value = limitNotice
    return true
  }

  const insertAfter = (index: number, session: InvestigationSession) => {
    if (full()) return
    sessions.value = [
      ...sessions.value.slice(0, index + 1),
      session,
      ...sessions.value.slice(index + 1)
    ]
    active.value = session.id
    notice.value = ''
  }

  const create = () => {
    if (full()) return
    const seed = nextId()
    const session = {
      id: `s${seed}`,
      name: `Investigation ${seed}`,
      filters: { period: ['24h'] },
      search: ''
    }
    insertAfter(sessions.value.length - 1, session)
  }

  const duplicate = (id: string) => {
    const source = sessions.value.find((session) => session.id === id)
    if (!source || full()) return
    const copy = { ...source, id: `s${nextId()}`, name: `${source.name} copy` }
    insertAfter(
      sessions.value.findIndex((session) => session.id === id),
      copy
    )
  }

  const close = (id: string) => {
    if (sessions.value.length === 1) return
    const index = sessions.value.findIndex((session) => session.id === id)
    const remaining = sessions.value.filter((session) => session.id !== id)
    sessions.value = remaining
    if (active.value === id) active.value = remaining[Math.max(0, index - 1)].id
    notice.value = ''
  }

  return { create, duplicate, close }
}

export function useInvestigationSessions(): UseInvestigationSessionsReturn {
  const sessions = ref<InvestigationSession[]>(initialSessions())
  const active = ref('s2')
  const notice = ref('')
  const { create, duplicate, close } = sessionActions({ sessions, active, notice })

  const currentSession = computed(
    () => sessions.value.find((session) => session.id === active.value) ?? sessions.value[0]
  )

  const updateSession = (id: string, patch: Partial<InvestigationSession>) => {
    sessions.value = sessions.value.map((session) =>
      session.id === id ? { ...session, ...patch } : session
    )
  }

  return {
    sessions: computed(() => sessions.value),
    activeSession: computed({
      get: () => active.value,
      set: (id) => {
        active.value = id
      }
    }),
    currentSession,
    filters: computed({
      get: () => currentSession.value.filters,
      set: (next) => updateSession(currentSession.value.id, { filters: next })
    }),
    search: computed({
      get: () => currentSession.value.search,
      set: (next) => updateSession(currentSession.value.id, { search: next })
    }),
    notice: computed(() => notice.value),
    create,
    duplicate,
    close,
    rename: (id: string, name: string) => updateSession(id, { name })
  }
}
