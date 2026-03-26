interface UseFrozenColumnsOptions {
  frozenColumns: string[]
}

export function useFrozenColumns(options: UseFrozenColumnsOptions) {
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
