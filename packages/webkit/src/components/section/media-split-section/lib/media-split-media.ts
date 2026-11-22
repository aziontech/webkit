import type { Component } from 'vue'

import { resolveScene, type SceneName } from '../../../../assets/scene-registry'
import type { ConsoleMockupName } from '../../../content/console-mockup/console-mockup.vue'

/** What a media cell draws. */
export type MediaSplitMediaKind = 'scene' | 'widget' | 'illustration'

/** The pictures a media cell may be given; the first one set wins. */
export type MediaSplitMediaSource = {
  /** Scene asset drawn in the cell, with the props bound onto it. */
  scene?: { component: SceneName; props?: Record<string, unknown> }
  /** Name of the product console widget drawn in the cell. */
  widget?: ConsoleMockupName
  /** Registry name of the illustration drawn in the cell. */
  illustration?: string
}

/** The picture a media cell resolves to. */
export type MediaSplitMedia = {
  /** What the cell draws; null when it has no picture. */
  kind: MediaSplitMediaKind | null
  /** The resolved scene component, when the cell draws a scene. */
  scene: Component | null
  /** Whether the cell draws a console picture, which fills the cell. */
  mockup: boolean
}

export function resolveMedia(source: MediaSplitMediaSource): MediaSplitMedia {
  const scene =
    source.scene && source.scene.component !== 'Diagram'
      ? resolveScene(source.scene.component)
      : null
  if (scene) return { kind: 'scene', scene, mockup: source.scene?.component === 'ConsoleMockup' }
  if (source.widget) return { kind: 'widget', scene: null, mockup: true }
  if (source.illustration) return { kind: 'illustration', scene: null, mockup: false }
  return { kind: null, scene: null, mockup: false }
}
