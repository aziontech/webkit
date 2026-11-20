import type { ComponentDoc } from '../types'

declare const loaders: Record<string, () => Promise<{ default: ComponentDoc }>>
export default loaders
