import { readonly, shallowRef } from 'vue'

const owner = shallowRef<symbol | null>(null)

export const openStepOwner = readonly(owner)

export function claimOpenStep(id: symbol): void {
  owner.value = id
}

export function claimOpenStepIfFree(id: symbol): void {
  if (owner.value === null) owner.value = id
}

export function releaseOpenStep(id: symbol): void {
  if (owner.value === id) owner.value = null
}
