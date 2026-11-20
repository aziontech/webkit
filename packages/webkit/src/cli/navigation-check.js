import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { collectNavigation, NAVIGATION_RULE, navigationFindings } from './navigation-levels.js'
import { PACKAGE_NAME } from './source.js'

const finding = (message, extra = {}) => ({
  source: 'navigation',
  severity: 'error',
  message,
  ...extra
})

export function parseUrls(value) {
  return String(value ?? '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean)
}

async function loadChromium(projectDir) {
  try {
    const require = createRequire(join(projectDir, 'package.json'))
    const mod = await import(pathToFileURL(require.resolve('playwright')).href)
    return mod.chromium ?? mod.default?.chromium ?? null
  } catch {
    return null
  }
}

export async function runNavigationCheck(projectDir, urls, { timeout = 30000, chromium } = {}) {
  if (!urls.length) return []
  const engine = chromium ?? (await loadChromium(projectDir))
  if (!engine) {
    return [
      finding(
        `--url drives the routes in a browser and needs Playwright in this project: install it with \`npm i -D playwright && npx playwright install chromium\`, then run \`npx ${PACKAGE_NAME} check --url <url>\` again.`
      )
    ]
  }

  let browser
  try {
    browser = await engine.launch()
  } catch (error) {
    return [
      finding(
        `Chromium did not start (${String(error?.message || error).split('\n')[0]}): run \`npx playwright install chromium\`.`
      )
    ]
  }

  const findings = []
  try {
    for (const url of urls) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout })
        const snapshot = await page.evaluate(collectNavigation)
        for (const f of navigationFindings(snapshot)) {
          findings.push(finding(f.message, { file: url, rule: f.rule, route: f.route }))
        }
      } catch (error) {
        findings.push(
          finding(
            `could not check the navigation levels of this route: ${String(error?.message || error).split('\n')[0]}`,
            { file: url, rule: NAVIGATION_RULE }
          )
        )
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
  return findings
}
