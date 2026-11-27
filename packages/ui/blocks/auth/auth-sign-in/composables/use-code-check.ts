import { type MaybeRefOrGetter, onScopeDispose, readonly, type Ref, ref, toValue } from 'vue'

export interface CodeCheckMessages {
  /** The message when nothing was entered. */
  empty: string
  /** The message when the code is shorter than its length. */
  short: string
  /** The message when the server rejects the code. */
  rejected: string
}

export interface UseCodeCheckOptions {
  /** The code the person types, bound to the input. */
  code: Ref<string>
  /** How many characters a full code has. */
  length: MaybeRefOrGetter<number>
  /** The messages of the field. */
  messages: MaybeRefOrGetter<CodeCheckMessages>
  /** Moves focus back to the code input. */
  focus: () => void
  /** Runs when the server accepts the code. */
  onAccepted: (code: string) => void
  /** True while another request of the screen is in flight: the check does not start. */
  blocked?: () => boolean
}

export interface UseCodeCheckReturn {
  /** The validation or rejection message; empty shows none. */
  error: Readonly<Ref<string>>
  /** The code is being checked. */
  checking: Readonly<Ref<boolean>>
  /** The check could not reach the server. */
  unreachable: Readonly<Ref<boolean>>
  /** Checks the code: all zeros is rejected and all nines cannot be reached, as a sample server. */
  check: () => void
  /** Clears the message, as the person types. */
  clearError: () => void
  /** Clears the code, the message and the unreachable notice. */
  reset: () => void
}

export function useCodeCheck(options: UseCodeCheckOptions): UseCodeCheckReturn {
  const { code, focus, onAccepted, blocked = () => false } = options
  const error = ref('')
  const checking = ref(false)
  const unreachable = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(timer))

  const answer = (rejected: string) => {
    checking.value = false
    if (/^0+$/.test(code.value)) {
      error.value = rejected
      code.value = ''
      focus()
      return
    }
    if (/^9+$/.test(code.value)) {
      unreachable.value = true
      return
    }
    onAccepted(code.value)
  }

  const check = () => {
    if (checking.value || blocked()) return
    unreachable.value = false
    const messages = toValue(options.messages)
    if (code.value.length < toValue(options.length)) {
      error.value = code.value ? messages.short : messages.empty
      focus()
      return
    }
    error.value = ''
    checking.value = true
    timer = setTimeout(() => answer(messages.rejected), 600)
  }

  const clearError = () => {
    error.value = ''
  }

  const reset = () => {
    code.value = ''
    error.value = ''
    unreachable.value = false
  }

  return {
    error: readonly(error),
    checking: readonly(checking),
    unreachable: readonly(unreachable),
    check,
    clearError,
    reset
  }
}
