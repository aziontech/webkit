import type { AiChatMessage } from '@aziontech/webkit/utils/ai-chat'

export const failureText = (error: unknown): string => {
  if (!error) return ''
  if (typeof error === 'string') return error
  return 'The connection was interrupted before the response finished.'
}

export const turnTime = (
  turn: Pick<AiChatMessage, 'createdAt'>,
  formatDate: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
): string =>
  turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''
