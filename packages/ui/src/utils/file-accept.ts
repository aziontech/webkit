const parseAccept = (accept: string): string[] =>
  accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 0)

const matchesToken = (file: globalThis.File, token: string): boolean => {
  const type = file.type.toLowerCase()
  if (token.startsWith('.')) return file.name.toLowerCase().endsWith(token)
  if (token.endsWith('/*')) return type !== '' && type.startsWith(token.slice(0, -1))
  return type !== '' && type === token
}

export function matchesAccept(file: globalThis.File, accept: string): boolean {
  const tokens = parseAccept(accept)
  if (tokens.length === 0) return true
  return tokens.some((token) => matchesToken(file, token))
}
