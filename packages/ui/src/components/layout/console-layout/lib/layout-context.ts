import { readonly, type Ref } from 'vue'

import type { ConsoleLayoutContext } from '../injection-key'

export function createLayoutContext(
  searchOpen: Ref<boolean>,
  toolsOpen: Ref<boolean>,
  toolsId: string
): ConsoleLayoutContext {
  const setSearch = (open: boolean) => {
    searchOpen.value = open
  }
  const setTools = (open: boolean) => {
    toolsOpen.value = open
  }
  return {
    openSearch: () => setSearch(true),
    closeSearch: () => setSearch(false),
    searchOpen: readonly(searchOpen),
    openTools: () => setTools(true),
    closeTools: () => setTools(false),
    toggleTools: () => setTools(!toolsOpen.value),
    toolsOpen: readonly(toolsOpen),
    toolsId
  }
}
