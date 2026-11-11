import type { BrowserCommand } from 'vitest/node'

export interface MediaEmulation {
  colorScheme?: 'light' | 'dark' | null
  reducedMotion?: 'reduce' | 'no-preference' | null
  forcedColors?: 'active' | 'none' | null
}

declare module 'vitest/browser' {
  interface BrowserCommands {
    emulateMedia: (media: MediaEmulation) => Promise<void>
  }
}

export const emulateMedia: BrowserCommand<[media: MediaEmulation]> = async ({ page }, media) => {
  await page.emulateMedia(media)
}
