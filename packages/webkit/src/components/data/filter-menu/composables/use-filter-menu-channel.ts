import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onScopeDispose,
  type Ref,
  shallowRef,
  toRaw,
  toValue,
  watch
} from 'vue'

import type { FilterMenuField } from '../types'

export interface FilterMenuOpenRequest {
  fieldId: string
  origin: HTMLElement | null
  token: number
}

export interface UseFilterMenuChannelOptions {
  /** The caller is a FilterMenu that answers open requests on this channel. */
  listen?: boolean
}

export interface UseFilterMenuChannelReturn {
  request: ComputedRef<FilterMenuOpenRequest | null>
  requestOpen: (fieldId: string, origin: HTMLElement | null) => void
}

const channels = new WeakMap<object, Ref<FilterMenuOpenRequest | null>>()
const listeners = new WeakMap<Ref<FilterMenuOpenRequest | null>, number>()

const addListener = (channel: Ref<FilterMenuOpenRequest | null>, step: 1 | -1): void => {
  listeners.set(channel, Math.max(0, (listeners.get(channel) ?? 0) + step))
}

const channelFor = (fields: object): Ref<FilterMenuOpenRequest | null> => {
  let channel = channels.get(fields)
  if (!channel) {
    channel = shallowRef<FilterMenuOpenRequest | null>(null)
    channels.set(fields, channel)
  }
  return channel
}

export function useFilterMenuChannel(
  fields: MaybeRefOrGetter<FilterMenuField[]>,
  options: UseFilterMenuChannelOptions = {}
): UseFilterMenuChannelReturn {
  const channel = computed(() => channelFor(toRaw(toValue(fields))))
  if (options.listen) {
    watch(
      channel,
      (next, previous) => {
        if (previous) addListener(previous, -1)
        addListener(next, 1)
      },
      { immediate: true }
    )
    onScopeDispose(() => addListener(channel.value, -1))
  }
  const request = computed(() => channel.value.value)
  const requestOpen = (fieldId: string, origin: HTMLElement | null): void => {
    const target = channel.value
    if (!listeners.get(target)) {
      console.warn('[webkit] FilterMenu.Chips: no FilterMenu has these fields.')
    }
    target.value = { fieldId, origin, token: (target.value?.token ?? 0) + 1 }
  }
  return { request, requestOpen }
}
