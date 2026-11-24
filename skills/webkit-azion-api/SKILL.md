---
name: webkit-azion-api
description: Calling the Azion API from a browser app built on @aziontech/webkit — why a direct fetch to api.azion.com fails (CORS), the Vite dev proxy for local work, a same-origin edge function proxy for production, where the person's personal token lives (memory or sessionStorage, never a bundle, a URL or localStorage), and how each API answer maps to a webkit state. Use when an app signs in with a personal token (auth/auth-sign-in PersonalToken) or calls the Azion REST or GraphQL APIs.
status: active
last_updated: 2026-11-19
scope: general
enforced_by: [webkit-example-data, webkit-component-states, review]
---

# Skill: webkit-azion-api

## Purpose

A console app on WebKit (a dashboard, a storage browser, an events explorer) calls the Azion API with the signed-in person's **personal token**. Three things go wrong the first time: the browser blocks the call, the token ends up somewhere it should not, and API errors surface as a blank screen. This skill fixes all three. The query explorer recipe built on top of it is `webkit-query-explorer`.

## Why a direct call fails

`https://api.azion.com` does not send `Access-Control-Allow-Origin` for your app's origin, so the browser refuses to hand the response to your code. A `fetch('https://api.azion.com/v4/…')` from `http://localhost:5173` or `https://app.example.com` fails with a CORS error before your code sees a status, even though the same request works in `curl`. You cannot fix that from the page (`mode: 'no-cors'` gives an empty, unreadable response). Send every API call to **your own origin** and let a proxy forward it:

```ts
const API = '/azion-api'

export async function azion(path: string, token: string, init: RequestInit = {}) {
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
      ...init.headers
    }
  })
}
```

## Local development: the Vite proxy

The dev server forwards `/azion-api/*` to the API. The browser only ever talks to `localhost`, so there is no CORS check.

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/azion-api': {
        target: 'https://api.azion.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/azion-api/, '')
      }
    }
  }
})
```

`server.proxy` exists only in `vite dev` (and `vite preview` with `preview.proxy`). A static build has no proxy, so production needs the next step.

## Production: a same-origin proxy at the edge

Serve the app and the proxy from the same host (`app.example.com` and `app.example.com/azion-api/*`): an Azion Function on the same application, or any edge or server route you already run. It forwards the person's own `Authorization` header and adds nothing of its own.

```ts
const UPSTREAM = 'https://api.azion.com'
const ALLOWED = /^\/v4\/(workspace|storage|metrics|events)\//

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname.replace(/^\/azion-api/, '')
    if (!ALLOWED.test(path)) return new Response('Not found', { status: 404 })
    const headers = new Headers()
    for (const name of ['accept', 'content-type', 'authorization']) {
      const value = request.headers.get(name)
      if (value) headers.set(name, value)
    }
    const upstream = await fetch(`${UPSTREAM}${path}${url.search}`, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body
    })
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/json',
        'x-ratelimit-reset': upstream.headers.get('x-ratelimit-reset') ?? ''
      }
    })
  }
}
```

- **Allowlist the paths** the app uses; an open proxy to the whole API is a relay anyone can point at.
- **Forward, never inject.** The proxy holds no token. A token baked into the proxy (or into a `VITE_*` variable, which ships in the bundle) lets every visitor act as its owner.
- **Never log** the `Authorization` header or a request body that carries a token.
- Same origin means no CORS headers to configure. If the API must live on another host, answer `OPTIONS` and send `Access-Control-Allow-Origin` for your app's exact origin only, never `*` with credentials.

## Where the token lives

The person pastes the token into `auth/auth-sign-in` (`PersonalToken`, the `token-sign-in.vue` card), which emits `sign-in` with `(event, token)` and stores nothing. Your app checks it with one API call, passes `loading` while it waits, and answers with `error`: `rejected` (401), `no-access` (403), `rate-limited` (429), `unreachable` (no answer) or a message. The card's Remember for this tab option (`v-model:remember`, off by default) tells your app where the token goes:

| Place                                | Use it                             | Why                                                                      |
| ------------------------------------ | ---------------------------------- | ------------------------------------------------------------------------ |
| A module `ref` (memory)              | yes, the default                   | Gone on reload or tab close; nothing persists.                           |
| `sessionStorage`                     | when a reload must not sign out    | One tab, cleared when it closes. Wrap reads and writes in `try`/`catch`. |
| `localStorage`, `IndexedDB`          | no                                 | Outlives the session and every tab reads it.                             |
| A URL, a query string, a route param | no                                 | Lands in history, logs and `Referer`.                                    |
| A cookie your server can read        | only with your own backend session | Then the browser never holds the Azion token at all.                     |
| `.env`, `VITE_*`, the bundle         | never                              | Public to everyone who loads the app.                                    |

Sign-out clears it (`token.value = ''` and `sessionStorage.removeItem`). Tell the person in the copy that closing the tab signs them out, and suggest a token with only the permissions the app needs.

## Map every answer to a state

| Answer                        | What it means                                                                                                 | What the screen does                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200` with data               | success                                                                                                       | Render; an empty list is the component's empty state (`EmptyState`, the table's empty slot), not an error.                                                  |
| `204 No Content`              | nothing at that path                                                                                          | Treat as empty, not as a failure (some v4 collections answer 204 instead of `{ results: [] }`).                                                             |
| `401`, `403`                  | token rejected, expired or revoked (401), or valid without the permissions (403)                              | Clear the token and route to sign-in with a reason (`/login?reason=expired`); on sign-in itself, `error="rejected"` or `error="no-access"`. Never toast it. |
| `429`                         | rate limited                                                                                                  | A warning with Retry; read `x-ratelimit-reset` for when.                                                                                                    |
| `400` with `{ detail }`       | the request or query is invalid (GraphQL limits and validation arrive this way, not as `errors[]` with `200`) | Show `detail` next to the control that built the request.                                                                                                   |
| `200` with GraphQL `errors[]` | the query ran but a field failed                                                                              | Show the messages where the result would be.                                                                                                                |
| `5xx`, network failure        | the API or the network is down                                                                                | The component's `error` state (`Chart`, `FilePreview` and `DataTable` take one) with Retry; keep what the person typed.                                     |

`webkit-errors` decides where each message goes (field, section, toast); this table only says which answer is which.

## Hard rules

- What the screen does with the answer (names instead of IDs, pickers, freshness, typed records) is `/webkit-api-data`.
- Every browser call goes to your own origin; never `fetch('https://api.azion.com/…')` from the page.
- The token comes from the person, at sign-in, and stays in memory or `sessionStorage`.
- Proxies forward the person's `Authorization` header and allowlist paths; they hold no token.
- A 401 or 403 signs the person out with a reason; it is not a toast and not a retry.
- Sample hosts in code and docs are `example.com` (`webkit-example-data`); never paste a real token, even an expired one.

## How to check it works

- No request in the Network panel goes from the page to `api.azion.com` directly.
- `vite dev` works through `server.proxy`; production through a same-origin proxy with a path allowlist.
- The token is not in `localStorage`, a URL, the bundle or a log.
- 401/403, 429, 400 and 5xx each render the state in the table above.
