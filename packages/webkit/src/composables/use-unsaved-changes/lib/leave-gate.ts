import type { Ref } from 'vue'

export interface LeaveGate {
  request: () => Promise<boolean>
  settle: (allowed: boolean) => void
  cancel: () => void
}

export function createLeaveGate(open: Ref<boolean>): LeaveGate {
  let release: ((allowed: boolean) => void) | null = null

  const settle = (allowed: boolean) => {
    const resolve = release
    release = null
    open.value = false
    resolve?.(allowed)
  }

  const request = () => {
    release?.(false)
    open.value = true
    return new Promise<boolean>((resolve) => {
      release = resolve
    })
  }

  return { request, settle, cancel: () => release?.(false) }
}
