import { inject, onScopeDispose } from 'vue'

import { ShellDocsInjectionKey } from '../injection-key'

export function useShellDocsPage(id: string): void {
  const current = inject(ShellDocsInjectionKey, null)
  if (!current) return
  current.value = id
  onScopeDispose(() => {
    if (current.value === id) current.value = ''
  })
}
