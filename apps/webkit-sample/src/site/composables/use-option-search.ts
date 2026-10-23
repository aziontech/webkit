import { ref } from 'vue'

export interface UseOptionSearchReturn {
  searchable: (options: unknown[]) => boolean
  query: (key: string) => string
  setQuery: (key: string, value: string) => void
  narrow: <T>(key: string, options: T[], text: (option: T) => string) => T[]
}

const SEARCH_THRESHOLD = 5

export function useOptionSearch(): UseOptionSearchReturn {
  const queries = ref<Record<string, string>>({})

  const searchable = (options: unknown[]) => options.length > SEARCH_THRESHOLD

  const query = (key: string) => queries.value[key] ?? ''

  const setQuery = (key: string, value: string) => {
    queries.value[key] = value
  }

  const narrow = <T>(key: string, options: T[], text: (option: T) => string) => {
    const term = query(key).trim().toLowerCase()
    return term ? options.filter((option) => text(option).toLowerCase().includes(term)) : options
  }

  return { searchable, query, setQuery, narrow }
}
