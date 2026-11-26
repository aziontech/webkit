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
  args?: {
    elementCount?: number
    data?: { elementCount?: number; frame?: string }
    beginData?: { frame?: string }
  }
}

interface FrameTree {
  frame: { id: string; url: string }
  childFrames?: FrameTree[]
}

const RECALC_EVENTS = new Set(['UpdateLayoutTree', 'RecalculateStyles'])

const sessions = new WeakMap<Page, CDPSession>()
const traces = new WeakMap<Page, TraceEvent[]>()

async function sessionOf(page: Page): Promise<CDPSession> {
  let session = sessions.get(page)
  if (!session) {
    session = await page.context().newCDPSession(page)
    session.on('Tracing.dataCollected', ({ value }) => {
      traces.get(page)?.push(...(value as unknown as TraceEvent[]))
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

function frameIdOf(tree: FrameTree, url: string): string | null {
  if (tree.frame.url === url) return tree.frame.id
  for (const child of tree.childFrames ?? []) {
    const id = frameIdOf(child, url)
    if (id) return id
  }
  return null
}

const frameOfEvent = (event: TraceEvent): string | undefined =>
  event.args?.beginData?.frame ?? event.args?.data?.frame

export const styleTraceStop: BrowserCommand<[]> = async (context) => {
  const { page } = context
  const session = await sessionOf(page)
  const complete = new Promise<void>((resolve) => {
    session.once('Tracing.tracingComplete', () => resolve())
  })
  await session.send('Tracing.end')
  await complete
  const { frameTree } = await session.send('Page.getFrameTree')
  const testFrame = frameIdOf(frameTree, (await context.frame()).url())
  return (traces.get(page) ?? [])
    .filter((event) => RECALC_EVENTS.has(event.name))
    .filter((event) => !testFrame || frameOfEvent(event) === testFrame)
    .reduce(
      (sum, event) => sum + (event.args?.elementCount ?? event.args?.data?.elementCount ?? 0),
      0
    )
}
