interface FrozenColumnsOptions {
  frozenColumns: string[]
}

interface FrozenColumnsReturn {
  isFrozen: (field: string) => boolean
  shouldNavigateOnClick: (field: string) => boolean
}

export function useFrozenColumns(options: FrozenColumnsOptions): FrozenColumnsReturn {
  const { frozenColumns } = options

  function isFrozen(field: string): boolean {
    return frozenColumns.includes(field)
  }

  function shouldNavigateOnClick(field: string): boolean {
    return isFrozen(field)
  }

  return {
    isFrozen,
    shouldNavigateOnClick
  }
}
