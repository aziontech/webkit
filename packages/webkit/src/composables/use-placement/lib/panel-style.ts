import type { FixedFrame } from '../../../utils/containing-block'
import type { ComputePlacementResult, Size } from './types'

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
  zIndex: number,
  panel: globalThis.HTMLElement,
  width: string | null
): PanelStyle {
  const style: PanelStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    translate: `${Math.round((result.left - frame.left) / frame.scaleX)}px ${Math.round(
      (result.top - frame.top) / frame.scaleY
    )}px`,
    zIndex: String(zIndex),
    '--popup-origin': result.origin
  }
  if (result.maxHeight !== null) {
    style['maxHeight'] = `${result.maxHeight / frame.scaleY}px`
    panel.style.maxHeight = style['maxHeight']
  }
  if (result.maxWidth !== null) {
    style['maxWidth'] = `${result.maxWidth / frame.scaleX}px`
    panel.style.maxWidth = style['maxWidth']
  }
  if (width !== null) style['width'] = width
  return style
}
