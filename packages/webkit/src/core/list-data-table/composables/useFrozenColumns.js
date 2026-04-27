export function useFrozenColumns(options) {
  const { frozenColumns } = options

  function isFrozen(field) {
    return frozenColumns.includes(field)
  }

  function shouldNavigateOnClick(field) {
    return isFrozen(field)
  }

  return {
    isFrozen,
    shouldNavigateOnClick
  }
}
