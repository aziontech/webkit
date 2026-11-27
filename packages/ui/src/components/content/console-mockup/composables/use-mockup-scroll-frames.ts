import type { ComponentPublicInstance } from 'vue'

import {
  type MockupFrameTiming,
  useMockupFrames,
  type UseMockupFramesOptions,
  type UseMockupFramesReturn
} from './use-mockup-frames'

export interface MockupScrollColumnHandle {
  measure: () => void
}

export type UseMockupScrollFramesOptions = Omit<UseMockupFramesOptions, 'beforeStep' | 'onAdvance'>

export interface UseMockupScrollFramesReturn<T> extends UseMockupFramesReturn<T> {
  bindColumn: (instance: Element | ComponentPublicInstance | null) => void
}

const isColumn = (instance: object | null): instance is MockupScrollColumnHandle =>
  instance !== null && 'measure' in instance

export function useMockupScrollFrames<T extends MockupFrameTiming>(
  frames: readonly T[],
  options: UseMockupScrollFramesOptions
): UseMockupScrollFramesReturn<T> {
  let column: MockupScrollColumnHandle | null = null

  const bindColumn = (instance: Element | ComponentPublicInstance | null) => {
    column = isColumn(instance) ? instance : null
  }

  const scene = useMockupFrames(frames, { ...options, beforeStep: () => column?.measure() })

  return { ...scene, bindColumn }
}
