import type { BrowserCommand } from 'vitest/node'

declare module 'vitest/browser' {
  interface BrowserCommands {
    ariaSnapshot: (selector?: string) => Promise<string>
  }
}

export const ariaSnapshot: BrowserCommand<[selector?: string]> = async (context, selector) => {
  const frame = (context as unknown as { iframe: import('playwright').FrameLocator }).iframe
  return frame.locator(selector ?? 'body').ariaSnapshot()
}
