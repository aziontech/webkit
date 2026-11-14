import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  shallowRef,
  toRaw,
  toValue
} from 'vue'

import type { FilterMenuField } from '../types'

export interface FilterMenuOpenRequest {
  fieldId: string
  origin: HTMLElement | null
  token: number
}

export interface UseFilterMenuChannelReturn {
  request: ComputedRef<FilterMenuOpenRequest | null>
  requestOpen: (fieldId: string, origin: HTMLElement | null) => void
}

const channels = new WeakMap<object, Ref<FilterMenuOpenRequest | null>>()

const channelFor = (fields: object): Ref<FilterMenuOpenRequest | null> => {
  let channel = channels.get(fields)
  if (!channel) {
    channel = shallowRef<FilterMenuOpenRequest | null>(null)
    channels.set(fields, channel)
  }
  return channel
}

export function useFilterMenuChannel(
  fields: MaybeRefOrGetter<FilterMenuField[]>
): UseFilterMenuChannelReturn {
  const channel = computed(() => channelFor(toRaw(toValue(fields))))
  const request = computed(() => channel.value.value)
  const requestOpen = (fieldId: string, origin: HTMLElement | null): void => {
    const target = channel.value
    target.value = { fieldId, origin, token: (target.value?.token ?? 0) + 1 }
  }
  return { request, requestOpen }
}
