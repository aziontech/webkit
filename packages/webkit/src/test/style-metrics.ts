import type { CDPSession, Page } from 'playwright'
import type { BrowserCommand } from 'vitest/node'

declare module 'vitest/browser' {
  interface BrowserCommands {
    styleRecalcMs: () => Promise<number>
  }
}

const sessions = new WeakMap<Page, CDPSession>()

export const styleRecalcMs: BrowserCommand<[]> = async ({ page }) => {
  let session = sessions.get(page)
  if (!session) {
    session = await page.context().newCDPSession(page)
    await session.send('Performance.enable')
    sessions.set(page, session)
  }
  const { metrics } = await session.send('Performance.getMetrics')
  return (metrics.find((m) => m.name === 'RecalcStyleDuration')?.value ?? 0) * 1000
}
