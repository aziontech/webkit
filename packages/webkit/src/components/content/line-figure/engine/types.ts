import type { Tour } from './stage'

export type Readout = { textContent: string | null }

export type FigureEls = { stage: HTMLElement; svg: SVGSVGElement; read: Readout }

export type FigureHandle = { set(value: number): void; destroy(): void }

export type FigureMount = (els: FigureEls, value: number) => FigureHandle

export type FigureRange = readonly [number, number, number]

export type FigureDefinition = {
  id: string
  label: string
  rest: string
  range: FigureRange
  tour: Tour
  mount: FigureMount
}
