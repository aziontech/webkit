import type { FixedFrame } from '../../../utils/containing-block'
import type { ComputePlacementResult, Rect, Size } from './types'

export type PanelStyle = Record<string, string>

export function offScreenStyle(zIndex: number): PanelStyle {
  return {
    position: 'fixed',
    top: '0',
    left: '0',
    translate: '-9999px -9999px',
    zIndex: String(zIndex)
  }
}

export function measurePanel(panel: globalThis.HTMLElement, frame: FixedFrame): Size {
  const rect = panel.getBoundingClientRect()
  return {
    width: panel.offsetWidth ? panel.offsetWidth * frame.scaleX : rect.width,
    height: panel.offsetHeight ? panel.offsetHeight * frame.scaleY : rect.height
  }
}

export function placedStyle(
  result: ComputePlacementResult,
  frame: FixedFrame,
  zIndex: number
): PanelStyle {
  const x = Math.round((result.left - frame.left) / frame.scaleX)
  const y = Math.round((result.top - frame.top) / frame.scaleY)
  const style: PanelStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    translate: `${x}px ${y}px`,
    zIndex: String(zIndex),
    '--popup-origin': result.origin
  }
  if (result.maxHeight !== null) style['maxHeight'] = `${result.maxHeight / frame.scaleY}px`
  if (result.maxWidth !== null) style['maxWidth'] = `${result.maxWidth / frame.scaleX}px`
  return style
}

export function capPanel(panel: globalThis.HTMLElement, style: PanelStyle): void {
  if (style['maxHeight']) panel.style.maxHeight = style['maxHeight']
  if (style['maxWidth']) panel.style.maxWidth = style['maxWidth']
}

export function lockWidth(style: PanelStyle, triggerRect: Rect, frame: FixedFrame): void {
  style['width'] = `${triggerRect.width / frame.scaleX}px`
}
