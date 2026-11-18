import type { CDPSession, Page } from 'playwright'
import type { BrowserCommand } from 'vitest/node'

declare module 'vitest/browser' {
  interface BrowserCommands {
    emulateTouch: (enabled: boolean) => Promise<void>
  }
}

const sessions = new WeakMap<Page, CDPSession>()

export const emulateTouch: BrowserCommand<[enabled: boolean]> = async ({ page }, enabled) => {
  const session = sessions.get(page) ?? (await page.context().newCDPSession(page))
  sessions.set(page, session)
  await session.send(
    'Emulation.setTouchEmulationEnabled',
    enabled ? { enabled, maxTouchPoints: 5 } : { enabled }
  )
}
