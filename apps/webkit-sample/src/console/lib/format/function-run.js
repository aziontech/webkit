// Running a function, for the editor's preview and terminal.
//
// THE PROTOTYPE DOES NOT EXECUTE ANYTHING, and the screen never pretends it does:
// the panel is labelled Preview, the terminal names the sample request it answered,
// and nothing here reaches the network. What it DOES do is produce a deterministic,
// plausible response for the one request below, so the Code tab can show the shape
// an edge function's output actually has — a status, response headers, and a body —
// instead of an empty panel with a "run" button that changes nothing.
//
// The response is derived from the source by a few honest signals (an explicit
// status, a header the code sets, whether it forwards the request), because that is
// what makes editing the code visibly change the preview. It is pattern matching,
// not evaluation, and it is deliberately shallow: a reader who writes something it
// cannot read gets the pass-through answer, which is the common case anyway.

/** The one request every preview answers. Stated on screen, never implied. */
export const SAMPLE_REQUEST = {
  method: 'GET',
  url: 'https://www.example.com/checkout/cart',
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'x-geo-country': 'BR',
    accept: 'text/html'
  }
}

const STATUS_TEXT = {
  200: 'OK',
  301: 'Moved Permanently',
  302: 'Found',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found'
}

/** The first explicit `status: <n>` / `status = <n>` the source names, if any. */
const declaredStatus = (code) => {
  const match = code.match(/status\s*[:=]\s*(\d{3})/)
  const status = match ? Number(match[1]) : 0
  return status >= 100 && status < 600 ? status : 0
}

/** Response headers the source sets, as `headers.set('name', 'value')`. */
const declaredHeaders = (code) => {
  const headers = {}
  const pattern = /headers\.set\(\s*['"`]([\w-]+)['"`]\s*,\s*['"`]?([^'"`)]*)['"`]?\s*\)/g
  let match
  while ((match = pattern.exec(code))) headers[match[1].toLowerCase()] = match[2].trim()
  return headers
}

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  )

/**
 * The body the preview renders. An edge function usually forwards the origin's
 * response, so what the panel shows is that page as it would arrive AFTER the
 * function ran — with whatever the function changed called out on it. Written as a
 * standalone document because the panel renders it in a sandboxed frame, which has
 * no access to the console's own stylesheet.
 */
const previewDocument = ({ status, headers, args }) => {
  const rows = Object.entries(headers)
  const argRows = Object.entries(args ?? {})
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<style>
  :root { color-scheme: light dark; }
  body { margin: 0; padding: 24px; font: 14px/1.5 ui-sans-serif, system-ui, sans-serif; color: #111; background: #fff; }
  @media (prefers-color-scheme: dark) { body { color: #f4f4f5; background: #131313; } }
  h1 { margin: 0 0 4px; font-size: 18px; font-weight: 600; }
  p { margin: 0 0 20px; opacity: .65; }
  h2 { margin: 20px 0 8px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; opacity: .55; }
  table { width: 100%; border-collapse: collapse; font: 12px/1.6 ui-monospace, SFMono-Regular, monospace; }
  td { padding: 4px 0; vertical-align: top; }
  td:first-child { width: 40%; opacity: .6; padding-right: 12px; }
  .empty { font: 12px/1.6 ui-monospace, monospace; opacity: .45; }
</style></head>
<body>
  <h1>Cart</h1>
  <p>The origin document, as it leaves the edge after this function ran.</p>
  <h2>Response headers</h2>
  ${
    rows.length
      ? `<table>${rows.map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`).join('')}</table>`
      : '<p class="empty">The function set none.</p>'
  }
  <h2>Arguments in effect</h2>
  ${
    argRows.length
      ? `<table>${argRows.map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(JSON.stringify(v))}</td></tr>`).join('')}</table>`
      : '<p class="empty">This function takes no default arguments.</p>'
  }
  <h2>Status</h2>
  <table><tr><td>status</td><td>${status}</td></tr></table>
</body></html>`
}

/**
 * Answers {@link SAMPLE_REQUEST} with the function as written.
 *
 * @param {{ code: string, args: object, runtimeLabel: string }} input
 * @returns {{ status: number, statusText: string, durationMs: number,
 *             headers: Record<string,string>, body: string, log: string[] }}
 */
export function runFunction({ code = '', args = {}, runtimeLabel = 'JavaScript' } = {}) {
  const status = declaredStatus(code) || 200
  const forwards = /\bfetch\s*\(/.test(code)
  const headers = {
    'content-type': 'text/html; charset=utf-8',
    ...declaredHeaders(code)
  }

  // Deterministic, so the same source always reports the same timing: a number that
  // changed on every run would read as a measurement, and this is not one.
  const durationMs = 1 + (code.length % 7) + (forwards ? 4 : 0)

  const log = [
    `${SAMPLE_REQUEST.method} ${SAMPLE_REQUEST.url}`,
    `runtime: ${runtimeLabel.toLowerCase()} · execution: on request`,
    forwards
      ? 'fetch(request) → origin responded 200'
      : 'no origin fetch. The function answered on its own',
    ...Object.entries(headers)
      .filter(([key]) => key !== 'content-type')
      .map(([key, value]) => `response header set: ${key}: ${value}`),
    `${status} ${STATUS_TEXT[status] ?? ''} in ${durationMs} ms`.trim()
  ]

  return {
    status,
    statusText: STATUS_TEXT[status] ?? '',
    durationMs,
    headers,
    body: previewDocument({ status, headers, args }),
    log
  }
}
