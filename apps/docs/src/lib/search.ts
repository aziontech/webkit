export const titleWords = (title: string) => title.replace(/([a-z0-9])([A-Z])/g, '$1 $2')

export const searchKeywords = (title: string, hint: string, aliases: string[] = []) => [
  titleWords(title),
  ...aliases,
  ...aliases.map((alias) => alias.replace(/-/g, ' ')),
  hint
]
