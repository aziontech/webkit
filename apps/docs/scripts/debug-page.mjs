import { chromium } from 'playwright'
import { serve } from './serve.mjs'
const server = process.env.ORIGIN ? null : await serve(0)
const origin = process.env.ORIGIN ?? `http://localhost:${server.address().port}`
const browser = await chromium.launch()
const page = await browser.newPage()
page.on('console', async (m) => {
  const args = await Promise.all(
    m
      .args()
      .map((a) =>
        a
          .evaluate((n) =>
            n && n.nodeType
              ? `${n.nodeName}#${n.id}.${n.className} parent=${n.parentNode?.nodeName}#${n.parentNode?.id}`
              : String(n)
          )
          .catch(() => '?')
      )
  )
  console.log('console', m.type(), m.text().slice(0, 3000), args.join(' | ').slice(0, 600))
})
page.on('response', (r) => r.status() >= 400 && console.log('resp', r.status(), r.url()))
page.on('pageerror', (e) => console.log('pageerror', e.message))
await page.goto(origin + (process.env.ROUTE || '/foundations/color'), {
  waitUntil: 'load',
  timeout: 240000
})
await page.waitForTimeout(Number(process.env.WAIT ?? 1500))
console.log((await page.content()).slice(-2500))
console.log(
  'htmlLen',
  (await page.content()).length,
  'text',
  (await page.evaluate(() => document.body.innerText)).slice(0, 300)
)
await page.screenshot({ path: 'debug.png' })
await browser.close()
server?.close()
