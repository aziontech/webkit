import type { Component } from 'vue'

declare const frameStyles: Record<string, () => Promise<Component>>
export default frameStyles
