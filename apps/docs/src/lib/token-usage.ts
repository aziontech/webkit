import type { Token, TokenUsage } from './types'

export const usageKey = (usage: TokenUsage) => `${usage.job}\u0000${usage.usedBy}`

export function sharedUsage(tokens: Token[]): { usage?: TokenUsage; tokens: Token[] } {
  const keys = [...new Set(tokens.flatMap((token) => (token.usage ? [usageKey(token.usage)] : [])))]
  const first = tokens.find((token) => token.usage)?.usage
  if (keys.length === 1 && first)
    return { usage: first, tokens: tokens.map(({ usage: _usage, ...token }) => token) }
  const rank = (token: Token) => (token.usage ? keys.indexOf(usageKey(token.usage)) : keys.length)
  return { tokens: [...tokens].sort((a, b) => rank(a) - rank(b)) }
}

export type TokenGroup = { usage?: TokenUsage; tokens: Token[] }

export function usageGroups(tokens: Token[]): TokenGroup[] {
  const runs = new Map<string, TokenGroup>()
  for (const token of tokens) {
    if (!token.usage) continue
    const key = usageKey(token.usage)
    const run = runs.get(key) ?? { usage: token.usage, tokens: [] }
    run.tokens.push(token)
    runs.set(key, run)
  }
  const shared = [...runs.values()].filter((run) => run.tokens.length > 1)
  const grouped = new Set(shared.flatMap((run) => run.tokens))
  const alone = tokens.filter((token) => !grouped.has(token))
  return [
    ...(alone.length ? [{ tokens: alone }] : []),
    ...shared.map((run) => ({
      usage: run.usage,
      tokens: run.tokens.map(({ usage: _usage, ...token }) => token)
    }))
  ]
}

export type UsageSection = { ids: string[]; usage?: TokenUsage; tokens: Token[] }

export function usageSections(groups: { id: string; vars: Token[] }[]): UsageSection[] {
  const sections: UsageSection[] = []
  for (const group of groups) {
    const { usage, tokens } = sharedUsage(group.vars)
    const last = sections.at(-1)
    if (usage && last?.usage && usageKey(last.usage) === usageKey(usage)) {
      last.ids.push(group.id)
      last.tokens.push(...tokens)
      continue
    }
    sections.push({ ids: [group.id], usage, tokens })
  }
  return sections
}
