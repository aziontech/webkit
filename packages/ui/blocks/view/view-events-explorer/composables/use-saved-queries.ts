import { toast } from '@aziontech/ui/toast'
import {
  computed,
  type ComputedRef,
  onBeforeUnmount,
  type Ref,
  ref,
  type WritableComputedRef
} from 'vue'

import type { QueryEntry, SavedQuery } from '../lib/event-query'
import type { UseEventQueryReturn } from './use-event-query'

/** The saved and recent queries popovers of the Query variant. */
export interface UseSavedQueriesReturn {
  /** The saved queries, in order. */
  savedQueries: ComputedRef<SavedQuery[]>
  /** The Saved queries popover is open. */
  savedOpen: WritableComputedRef<boolean>
  /** The Recent queries popover is open. */
  recentOpen: WritableComputedRef<boolean>
  /** The name typed for the current query. */
  saveName: WritableComputedRef<string>
  /** What the last action did, read out to the user. */
  savedStatus: ComputedRef<string>
  /** A name is typed and a query is applied. */
  canSave: ComputedRef<boolean>
  /** Saves the applied query under the typed name. */
  saveQuery: () => void
  /** Deletes a saved query, with Undo. */
  deleteSavedQuery: (entry: SavedQuery) => void
  /** Runs a saved query and closes its popover. */
  applySavedQuery: (entry: SavedQuery) => void
  /** Runs a recent query and closes its popover. */
  applyRecentQuery: (entry: QueryEntry) => void
  /** Clears the recent queries, with Undo. */
  clearRecentQueries: () => void
}

const initialSaved = (): SavedQuery[] => [
  {
    id: 'q1',
    name: 'Server errors',
    text: 'status >= 500',
    query: { tokens: [{ propertyKey: 'status', operator: '>=', value: '500' }], operation: 'and' }
  },
  {
    id: 'q2',
    name: 'Cache misses on the API',
    text: 'cacheStatus = MISS AND host = api.example.com',
    query: {
      tokens: [
        { propertyKey: 'cacheStatus', operator: '=', value: 'MISS' },
        { propertyKey: 'host', operator: '=', value: 'api.example.com' }
      ],
      operation: 'and'
    }
  }
]

const writable = <T>(source: { value: T }) =>
  computed({
    get: () => source.value,
    set: (value: T) => {
      source.value = value
    }
  })

const deleteWithUndo = (list: Ref<SavedQuery[]>, status: Ref<string>, entry: SavedQuery) => {
  const snapshot = [...list.value]
  list.value = list.value.filter((saved) => saved.id !== entry.id)
  status.value = `Deleted “${entry.name}”.`
  toast.info(`Saved query “${entry.name}” deleted.`, {
    id: 'events-saved-query',
    actions: [
      {
        label: 'Undo',
        onClick: () => {
          list.value = snapshot
          status.value = `Restored “${entry.name}”.`
        }
      }
    ]
  })
}

const clearWithUndo = (recent: { value: QueryEntry[] }) => {
  const snapshot = [...recent.value]
  recent.value = []
  toast.info('Recent queries cleared.', {
    id: 'events-recent-queries',
    actions: [{ label: 'Undo', onClick: () => (recent.value = snapshot) }]
  })
}

export function useSavedQueries(eventQuery: UseEventQueryReturn): UseSavedQueriesReturn {
  const savedQueries = ref<SavedQuery[]>(initialSaved())
  let savedSeed = 2
  const savedOpen = ref(false)
  const recentOpen = ref(false)
  const saveName = ref('')
  const savedStatus = ref('')

  const canSave = computed(() => Boolean(saveName.value.trim() && eventQuery.appliedText.value))

  const saveQuery = () => {
    if (!canSave.value) return
    savedSeed += 1
    const name = saveName.value.trim()
    savedQueries.value = [
      ...savedQueries.value,
      {
        id: `q${savedSeed}`,
        name,
        text: eventQuery.appliedText.value,
        query: eventQuery.appliedQuery.value
      }
    ]
    saveName.value = ''
    savedStatus.value = `Saved “${name}”.`
  }

  const deleteSavedQuery = (entry: SavedQuery) => deleteWithUndo(savedQueries, savedStatus, entry)

  const applySavedQuery = (entry: SavedQuery) => {
    eventQuery.runQuery(entry)
    savedOpen.value = false
  }

  const applyRecentQuery = (entry: QueryEntry) => {
    eventQuery.runQuery(entry)
    recentOpen.value = false
  }

  const clearRecentQueries = () => {
    recentOpen.value = false
    clearWithUndo(eventQuery.recentQueries)
  }

  onBeforeUnmount(() => {
    toast.dismiss('events-saved-query')
    toast.dismiss('events-recent-queries')
  })

  return {
    savedQueries: computed(() => savedQueries.value),
    savedOpen: writable(savedOpen),
    recentOpen: writable(recentOpen),
    saveName: writable(saveName),
    savedStatus: computed(() => savedStatus.value),
    canSave,
    saveQuery,
    deleteSavedQuery,
    applySavedQuery,
    applyRecentQuery,
    clearRecentQueries
  }
}
