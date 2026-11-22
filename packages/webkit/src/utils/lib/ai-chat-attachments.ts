import type { PromptQueueItem } from '../../components/ai/prompt-queue/prompt-queue.vue'
import type { AiChatAttachment, AiChatQueuedMessage, AiChatSendContent } from './ai-chat-types'

const ATTACHMENT_KINDS = ['image', 'audio', 'video'] as const

export function attachmentKindOf(mimeType: string): AiChatAttachment['type'] {
  return ATTACHMENT_KINDS.find((kind) => mimeType.startsWith(`${kind}/`)) ?? 'document'
}

function base64Of(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : ''
      resolve(url.slice(url.indexOf(',') + 1))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function attachmentOf(file: File): Promise<AiChatAttachment> {
  const mimeType = file.type || 'application/octet-stream'
  return {
    type: attachmentKindOf(mimeType),
    source: { type: 'data', value: await base64Of(file), mimeType },
    metadata: { name: file.name }
  }
}

export async function contentOf(
  text: string,
  files: ReadonlyArray<File>
): Promise<AiChatSendContent> {
  if (!files.length) return text
  const attachments = await Promise.all(files.map(attachmentOf))
  return {
    content: [...(text.trim() ? [{ type: 'text' as const, content: text }] : []), ...attachments]
  }
}

export function queueItemOf(message: AiChatQueuedMessage): PromptQueueItem {
  const content =
    message.content && typeof message.content === 'object' && 'content' in message.content
      ? (message.content as { content: unknown }).content
      : message.content
  if (typeof content === 'string') return { id: message.id, text: content }
  const parts: unknown[] = Array.isArray(content) ? content : []
  const texts = parts.flatMap((part) =>
    part &&
    typeof part === 'object' &&
    (part as { type?: unknown }).type === 'text' &&
    typeof (part as { content?: unknown }).content === 'string'
      ? [(part as { content: string }).content]
      : []
  )
  return { id: message.id, text: texts.join(' '), attachmentCount: parts.length - texts.length }
}
