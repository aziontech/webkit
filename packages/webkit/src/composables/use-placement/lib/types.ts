import type { Direction } from '../../use-direction'

/** Side of the anchor the panel opens on; `start` and `end` follow the text direction. */
export type Side = 'top' | 'bottom' | 'start' | 'end'
/** Alignment of the panel along the anchor edge; `start` and `end` follow the text direction on `top`/`bottom`. */
export type Align = 'start' | 'center' | 'end'
/** A screen side, after `start`/`end` resolved against the text direction. */
export type PhysicalSide = 'top' | 'right' | 'bottom' | 'left'

/** Viewport-space rectangle (the shape `getBoundingClientRect()` returns). */
export interface Rect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

export interface Size {
  width: number
  height: number
}

/** Distance kept from the boundary edges: both axes, or one inset per axis. */
export type CollisionPadding = number | { x: number; y: number }

export interface ComputePlacementInput {
  /** The anchor, in viewport pixels. */
  triggerRect: Rect
  /** The panel's natural (unconstrained) size, in viewport pixels. */
  panelSize: Size
  /** The area the panel must stay inside: the clipping ancestors intersected with the viewport. */
  boundary: Rect
  /** Preferred side, or `'auto'` for the first of `autoSides` that fits. */
  side: Side | 'auto'
  /** Alignment along the anchor edge. Defaults to `'center'`. */
  align?: Align
  /** Text direction that resolves `start`/`end`. Defaults to `'ltr'`. */
  dir?: Direction
  /** Candidates tried in order when `side === 'auto'`. */
  autoSides?: Side[]
  /** Flip an explicit side to the opposite one when it does not fit. */
  flip: boolean
  /** Gap between trigger and panel along the main axis. */
  sideOffset: number
  /** Minimum distance kept from the boundary edges, together or per axis. */
  collisionPadding: CollisionPadding
  /** Shift along the alignment axis, in px, away from the aligned edge (towards the inline end for `center`). */
  alignOffset?: number
  /** Vertical sides only: the panel spans exactly the trigger, so it is never shifted or capped across. */
  matchTriggerWidth?: boolean
}

export interface ComputePlacementResult {
  /** Resolved side after flipping, in the logical vocabulary. */
  side: Side
  /** Resolved alignment, in the logical vocabulary. */
  align: Align
  /** The screen side the panel landed on. */
  physicalSide: PhysicalSide
  /** CSS transform origin facing the anchor. */
  origin: string
  top: number
  left: number
  /** Final panel size after shrinking; equals the natural size when nothing was capped. */
  width: number
  height: number
  /** Cap to apply on the panel, or `null` when the natural size fits. */
  maxWidth: number | null
  maxHeight: number | null
}
