import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import {
  COLLECT_NAVIGATION_SCRIPT,
  NAVIGATION_RULE,
  navigationFindings
} from './navigation-levels.js'
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

const firstLine = (error) => String(error?.message || error).split('\n')[0]

async function checkRoute(browser, url, timeout) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout })
    const snapshot = await page.evaluate(COLLECT_NAVIGATION_SCRIPT)
    return navigationFindings(snapshot).map((f) =>
      finding(f.message, { file: url, rule: f.rule, route: f.route })
    )
  } catch (error) {
    return [
      finding(`could not check the navigation levels of this route: ${firstLine(error)}`, {
        file: url,
        rule: NAVIGATION_RULE
      })
    ]
  } finally {
    await page.close()
  }
}

const NO_PLAYWRIGHT = () =>
  finding(
    `--url drives the routes in a browser and needs Playwright in this project: install it with ` +
      `\`npm i -D playwright && npx playwright install chromium\`, then run \`npx ${PACKAGE_NAME} ` +
      `check --url <url>\` again.`
  )

export async function runNavigationCheck(projectDir, urls, { timeout = 30000, chromium } = {}) {
  if (!urls.length) return []
  const engine = chromium ?? (await loadChromium(projectDir))
  if (!engine) return [NO_PLAYWRIGHT()]

  let browser
  try {
    browser = await engine.launch()
  } catch (error) {
    return [
      finding(
        `Chromium did not start (${firstLine(error)}): run \`npx playwright install chromium\`.`
      )
    ]
  }

  const findings = []
  try {
    for (const url of urls) findings.push(...(await checkRoute(browser, url, timeout)))
  } finally {
    await browser.close()
  }
  return findings
}
