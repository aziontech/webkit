export const SCENE_WIDTH = 240
export const SCENE_HEIGHT = 180

export const sceneCanvasStyle = {
  width: `${SCENE_WIDTH}px`,
  height: `${SCENE_HEIGHT}px`
}

export const centreX = (size) => Math.round((SCENE_WIDTH - size) / 2)

export const centreY = (size) => Math.round((SCENE_HEIGHT - size) / 2)
