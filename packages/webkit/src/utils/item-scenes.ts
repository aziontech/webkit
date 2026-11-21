import type { Component } from 'vue'

import { resolveScene, type SceneRef } from '../assets/scene-registry'

export const resolveItemScenes = (items: { scene?: SceneRef }[]): (Component | null)[] =>
  items.map((item) => (item.scene ? resolveScene(item.scene.component) : null))
