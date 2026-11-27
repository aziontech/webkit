import { safeWebUrl } from '../../../../utils/safe-href'

const SANDBOX = [
  'allow-scripts',
  'allow-forms',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-presentation'
]

export function embedSource(src: string): string | null {
  const url = safeWebUrl(src)
  return url && /^https:/i.test(url.replace(/[\s\p{Cf}]/gu, '')) ? url : null
}

export function embedSandbox(src: string, pageOrigin: string): string {
  let frameOrigin: string | null = null
  try {
    frameOrigin = new URL(src).origin
  } catch {
    frameOrigin = null
  }
  const foreign = frameOrigin !== null && frameOrigin !== pageOrigin
  return (foreign ? [...SANDBOX, 'allow-same-origin'] : SANDBOX).join(' ')
}
