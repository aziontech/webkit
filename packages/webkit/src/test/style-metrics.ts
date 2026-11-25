import type { CDPSession, Page } from 'playwright'
import type { BrowserCommand } from 'vitest/node'

declare module 'vitest/browser' {
  interface BrowserCommands {
    styleTraceStart: () => Promise<void>
    styleTraceStop: () => Promise<number>
  }
}

interface TraceEvent {
  name: string
  args?: { elementCount?: number; data?: { elementCount?: number } }
}

const RECALC_EVENTS = new Set(['UpdateLayoutTree', 'RecalculateStyles'])

const sessions = new WeakMap<Page, CDPSession>()
const traces = new WeakMap<Page, TraceEvent[]>()

async function sessionOf(page: Page): Promise<CDPSession> {
  let session = sessions.get(page)
  if (!session) {
    session = await page.context().newCDPSession(page)
    session.on('Tracing.dataCollected', ({ value }) => {
      traces.get(page)?.push(...(value as TraceEvent[]))
    })
    sessions.set(page, session)
  }
  return session
}

export const styleTraceStart: BrowserCommand<[]> = async ({ page }) => {
  const session = await sessionOf(page)
  traces.set(page, [])
  await session.send('Tracing.start', {
    traceConfig: { includedCategories: ['devtools.timeline'] },
    transferMode: 'ReportEvents'
  })
}

export const styleTraceStop: BrowserCommand<[]> = async ({ page }) => {
  const session = await sessionOf(page)
  const complete = new Promise<void>((resolve) => {
    session.once('Tracing.tracingComplete', () => resolve())
  })
  await session.send('Tracing.end')
  await complete
  return (traces.get(page) ?? [])
    .filter((event) => RECALC_EVENTS.has(event.name))
    .reduce(
      (sum, event) => sum + (event.args?.elementCount ?? event.args?.data?.elementCount ?? 0),
      0
    )
}
