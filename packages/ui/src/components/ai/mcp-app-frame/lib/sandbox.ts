import type {
  McpAppFrameMessage,
  McpAppFrameResource,
  McpAppFrameRpcMessage,
  McpAppFrameUiMessage
} from '../mcp-app-frame.vue'

const CONTENT_POLICY =
  "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; " +
  "media-src data:; font-src data:; connect-src 'none'; frame-src 'none'; form-action 'none'; " +
  "base-uri 'none'; object-src 'none'"

const MIN_HEIGHT = 48
const START_HEIGHT = 240
const MAX_TYPE_LENGTH = 128

type PlainObject = Record<string, unknown>

function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const prototype: unknown = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function hasOwn(target: PlainObject, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, key)
}

export function isInlineHtml(resource: McpAppFrameResource): boolean {
  const mimeType = typeof resource.mimeType === 'string' ? resource.mimeType : ''
  const essence = mimeType.split(';')[0].trim().toLowerCase()
  if (essence !== 'text/html') return false
  return typeof resource.text === 'string' || typeof resource.blob === 'string'
}

export function buildSrcdoc(html: string): string {
  const body = html.startsWith('\uFEFF') ? html.slice(1) : html
  return `<!doctype html><meta http-equiv="Content-Security-Policy" content="${CONTENT_POLICY}">${body}`
}

export function decodeBlob(blob: string): string {
  const binary = atob(blob)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}

export function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value === '') return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function clampHeight(value: number, maxHeight: number): number {
  const ceiling = Math.max(MIN_HEIGHT, maxHeight)
  return Math.min(ceiling, Math.max(MIN_HEIGHT, value))
}

export function startHeight(maxHeight: number): number {
  return Math.max(MIN_HEIGHT, Math.min(START_HEIGHT, maxHeight))
}

function readUiMessage(data: PlainObject): McpAppFrameUiMessage | null {
  const type = data['type']
  const payload = hasOwn(data, 'payload') ? data['payload'] : undefined
  const messageId = hasOwn(data, 'messageId') ? data['messageId'] : undefined
  if (typeof type !== 'string' || type.length < 1 || type.length > MAX_TYPE_LENGTH) return null
  const message: McpAppFrameUiMessage = { type }
  if (payload !== undefined) {
    if (!isPlainObject(payload)) return null
    message.payload = payload
  }
  if (messageId !== undefined) {
    if (typeof messageId !== 'string') return null
    message.messageId = messageId
  }
  return message
}

const ownValue = (data: PlainObject, key: string): unknown =>
  hasOwn(data, key) ? data[key] : undefined

const isRpcId = (id: unknown): id is string | number =>
  typeof id === 'string' || typeof id === 'number'

function rpcFieldsValid(data: PlainObject): boolean {
  const method = ownValue(data, 'method')
  const id = ownValue(data, 'id')
  const params = ownValue(data, 'params')
  const error = ownValue(data, 'error')
  if (method !== undefined && typeof method !== 'string') return false
  if (id !== undefined && !isRpcId(id)) return false
  if (method === undefined && id === undefined) return false
  if (params !== undefined && !isPlainObject(params) && !Array.isArray(params)) return false
  return error === undefined || isPlainObject(error)
}

function readRpcMessage(data: PlainObject): McpAppFrameRpcMessage | null {
  if (!rpcFieldsValid(data)) return null
  const method = ownValue(data, 'method')
  const id = ownValue(data, 'id')
  const params = ownValue(data, 'params')
  const error = ownValue(data, 'error')
  const message: McpAppFrameRpcMessage = { jsonrpc: '2.0' }
  if (isRpcId(id)) message.id = id
  if (typeof method === 'string') message.method = method
  if (isPlainObject(params) || Array.isArray(params)) message.params = params
  if (hasOwn(data, 'result')) message.result = data['result']
  if (isPlainObject(error)) message.error = error
  return message
}

export function readMessage(data: unknown): McpAppFrameMessage | null {
  if (!isPlainObject(data)) return null
  if (hasOwn(data, 'jsonrpc')) {
    return data['jsonrpc'] === '2.0' ? readRpcMessage(data) : null
  }
  return readUiMessage(data)
}

export function isSizeMessage(message: McpAppFrameMessage): boolean {
  if ('jsonrpc' in message) return message.method === 'ui/notifications/size-changed'
  return message.type === 'ui-size-change'
}

export function readSize(message: McpAppFrameMessage): number | null {
  if (!isSizeMessage(message)) return null
  const source = 'jsonrpc' in message ? message.params : message.payload
  if (!isPlainObject(source)) return null
  const height = source['height']
  return typeof height === 'number' && Number.isFinite(height) ? height : null
}
