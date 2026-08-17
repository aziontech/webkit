// The canvas the app's own illustration scenes are composed on.
//
// The DS's registry assets are authored against a 170×128 canvas
// (`--illustration-canvas-width/height`), and at that size a scene made of 32px boxes
// and a 64px window has almost no air left: the frameworks fan-in filled 156 of its 170
// columns, so the drawing read as parts pushed against a frame rather than as a diagram
// sitting in one.
//
// A scene composed HERE is not bound to that canvas — it only has to fit the card's
// stage, which is 4/3 and ~300px wide at the row's desktop width. So the app's scenes use
// a larger canvas at the same 4/3 ratio, and spend the extra room entirely on the gaps
// between parts. The part sizes are untouched: a 32px box is a 32px box in every scene,
// which is what keeps three different drawings reading as one system.
//
// Registry assets keep their own 170×128 (they are authored to it); only the composed
// scenes use this.
export const SCENE_WIDTH = 240
export const SCENE_HEIGHT = 180

/** Inline size for a composed scene's canvas element. */
export const sceneCanvasStyle = {
  width: `${SCENE_WIDTH}px`,
  height: `${SCENE_HEIGHT}px`
}

/** Left offset that centres a part of `size` on the canvas. */
export const centreX = (size) => Math.round((SCENE_WIDTH - size) / 2)

/** Top offset that centres a part of `size` on the canvas. */
export const centreY = (size) => Math.round((SCENE_HEIGHT - size) / 2)
