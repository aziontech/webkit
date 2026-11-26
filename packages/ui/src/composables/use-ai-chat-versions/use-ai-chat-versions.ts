import { type MaybeRefOrGetter, shallowRef, toValue, watch } from 'vue'

import type { AiChatMessage } from '../../utils/lib/ai-chat-types'

/** Where a message stands among its versions. */
export interface AiChatVersions {
  /** How many versions the message has. */
  count: number
  /** Zero-based index of the version shown. */
  index: number
}

/** What `useAiChatVersions` returns. */
export interface UseAiChatVersionsReturn {
  /** The versions of a message, or `null` while it has only one. */
  versionsOf: (message: AiChatMessage) => AiChatVersions | null
  /** Keeps the conversation from `message` on as a version before an edit or Try again replaces it. */
  fork: (message: AiChatMessage) => void
  /** Shows another version of `message`; returns the whole conversation to hand to `setMessages`, or `null` when nothing changes. */
  select: (message: AiChatMessage, index: number) => AiChatMessage[] | null
  /** Forgets every version, for a new chat. */
  clear: () => void
}

interface AiChatBranch {
  at: number
  before: string
  tails: ReadonlyArray<AiChatMessage>[]
  active: number
}

const NO_MESSAGE = '\u0000'

const beforeOf = (list: ReadonlyArray<AiChatMessage>, at: number): string =>
  at === 0 ? '' : (list[at - 1]?.id ?? NO_MESSAGE)

const indexOf = (list: ReadonlyArray<AiChatMessage>, message: AiChatMessage): number =>
  list.findIndex((entry) => entry.id === message.id)

function follow(branch: AiChatBranch, list: ReadonlyArray<AiChatMessage>): AiChatBranch {
  const head = list[branch.at]
  if (!head || beforeOf(list, branch.at) !== branch.before) return branch
  const tail = list.slice(branch.at)
  const tails = [...branch.tails]
  const match = tails.findIndex((entry) => entry[0]?.id === head.id)
  if (match < 0) {
    tails.push(tail)
    return { ...branch, tails, active: tails.length - 1 }
  }
  tails[match] = tail
  return { ...branch, tails, active: match }
}

export function useAiChatVersions(
  messages: MaybeRefOrGetter<ReadonlyArray<AiChatMessage>>
): UseAiChatVersionsReturn {
  const branches = shallowRef<AiChatBranch[]>([])

  function branchOf(message: AiChatMessage): AiChatBranch | null {
    const list = toValue(messages)
    const at = indexOf(list, message)
    if (at < 0) return null
    const before = beforeOf(list, at)
    return branches.value.find((branch) => branch.at === at && branch.before === before) ?? null
  }

  watch(
    () => toValue(messages),
    (list) => {
      if (branches.value.length)
        branches.value = branches.value.map((branch) => follow(branch, list))
    },
    { deep: 1 }
  )

  function versionsOf(message: AiChatMessage): AiChatVersions | null {
    const branch = branchOf(message)
    return branch && branch.tails.length > 1
      ? { count: branch.tails.length, index: branch.active }
      : null
  }

  function fork(message: AiChatMessage): void {
    const list = toValue(messages)
    const at = indexOf(list, message)
    if (at < 0 || branchOf(message)) return
    const branch = { at, before: beforeOf(list, at), tails: [list.slice(at)], active: 0 }
    branches.value = [...branches.value, branch]
  }

  function select(message: AiChatMessage, index: number): AiChatMessage[] | null {
    const branch = branchOf(message)
    const tail = branch?.tails[index]
    if (!branch || !tail || index === branch.active) return null
    branches.value = branches.value.map((entry) =>
      entry === branch ? { ...entry, active: index } : entry
    )
    return [...toValue(messages).slice(0, branch.at), ...tail]
  }

  function clear(): void {
    branches.value = []
  }

  return { versionsOf, fork, select, clear }
}
