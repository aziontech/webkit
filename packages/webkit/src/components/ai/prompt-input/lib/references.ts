import type { PromptInputReference } from '../types'

export const referenceToken = (reference: PromptInputReference): string =>
  `${reference.trigger}${reference.label}`

export function withoutReference(text: string, reference: PromptInputReference): string {
  const token = referenceToken(reference)
  const at = text.indexOf(token)
  if (at === -1) return text
  const end = text[at + token.length] === ' ' ? at + token.length + 1 : at + token.length
  return text.slice(0, at) + text.slice(end)
}
