import tokens from 'virtual:docs-tokens'
import { onMounted, onScopeDispose, readonly, type Ref, ref } from 'vue'

export function useBreakpoint(): Readonly<Ref<string>> {
  const active = ref('_')
  const queries: { name: string; query: MediaQueryList }[] = []

  function update() {
    active.value = queries.filter((entry) => entry.query.matches).at(-1)?.name ?? '_'
  }

  onMounted(() => {
    for (const token of tokens.breakpoints) {
      const query = window.matchMedia(`(min-width: ${token.value})`)
      query.addEventListener('change', update)
      queries.push({ name: token.name.replace('--breakpoint-', ''), query })
    }
    update()
  })

  onScopeDispose(() => {
    for (const entry of queries) entry.query.removeEventListener('change', update)
  })

  return readonly(active)
}
