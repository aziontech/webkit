export const toggleIn = (list: readonly string[], key: string): string[] =>
  list.includes(key) ? list.filter((entry) => entry !== key) : [...list, key]
