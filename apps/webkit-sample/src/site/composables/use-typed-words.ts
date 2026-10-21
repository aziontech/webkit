import {
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

export interface UseTypedWordsOptions {
  /** Milliseconds per typed character. */
  typeMs?: number
  /** Milliseconds per erased character. */
  eraseMs?: number
  /** Milliseconds a finished word holds before it is erased. */
  holdMs?: number
}

export interface UseTypedWordsReturn {
  /** The word typed so far; under reduced motion, every word joined. */
  text: Readonly<Ref<string>>
}

export function useTypedWords(
  words: MaybeRefOrGetter<string[]>,
  options: UseTypedWordsOptions = {}
): UseTypedWordsReturn {
  const { typeMs = 90, eraseMs = 45, holdMs = 1800 } = options
  const text = ref('')
  let timer: ReturnType<typeof globalThis.setTimeout> | undefined
  let index = 0
  let length = 0
  let erasing = false

  function schedule(delay: number) {
    timer = globalThis.setTimeout(step, delay)
  }

  function step() {
    const list = toValue(words)
    if (!list.length) return
    const word = list[index % list.length]
    if (!erasing) {
      length += 1
      text.value = word.slice(0, length)
      if (length < word.length) return schedule(typeMs)
      erasing = true
      return schedule(holdMs)
    }
    length -= 1
    text.value = word.slice(0, length)
    if (length > 0) return schedule(eraseMs)
    erasing = false
    index += 1
    schedule(typeMs * 3)
  }

  onMounted(() => {
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      text.value = toValue(words).join(', ')
      return
    }
    schedule(typeMs)
  })

  onScopeDispose(() => globalThis.clearTimeout(timer))

  return { text: readonly(text) }
}
