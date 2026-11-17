# AuthBar (`top-bar/auth-bar`)

> The console bar for the signed-out and onboarding screens: sign in, sign up, password recovery and the first-run steps. A `AppHeader` in its default `content` placement with the brand at the start and one outlined Documentation button at the end. There is no navigation, no search and no account control, because there is no session to act on yet. Built from `AppHeader`, `Button` and `Brand`.

- Surface: app
- Source: `blocks/top-bar/auth-bar/auth-bar.vue` in `@aziontech/webkit`
- MCP: `get_block("top-bar/auth-bar")`
- Components: [AppHeader](../../components/app-header.md), [Brand](../../components/brand.md), [Button](../../components/button.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

auth header; signed-out header; login page header; onboarding header; public console header; header without navigation; logged-out top bar; cabeçalho de login; cabeçalho deslogado; barra do topo sem navegação; top bar; auth bar; signed-out top bar; barra de autenticação

The top bar of every signed-out and first-run screen: sign in, sign up, password recovery and the onboarding steps. The user has no session yet, so the bar has one job: say where they are (Azion) and offer the one way out that needs no account, the documentation. Everything a signed-in bar carries (navigation, search, Create, the account avatar) is left out because there is nothing to act on.

## When to use

- Use auth-bar on signed-out and onboarding screens (brand + Documentation, no navigation).
- Above the auth card on sign in, sign up, reset password and MFA screens (`auth/sign-in`).
- Above the onboarding steps that run before the organization exists (`account/onboarding-form`).

## When not to use

- Any page with a session: `ConsoleLayout` already renders the console bar (`shell/console`); a create, edit or deploy flow uses `top-bar/creation-bar`.
- Documentation pages: `DocLayout` renders their bar (`shell/docs`). Marketing pages: `SiteLayout` and `SiteHeaderSection` render theirs (`shell/site`).

## Building blocks

### A. Bar — `AppHeader` (required)

The bar in its default `content` placement, labelled `aria-label="Console"`. Fill `AppHeader.Brand` and `AppHeader.End`; keep `AppHeader.Center` empty. Never a bare `<header>`.

### B. Brand — `Brand` (required)

`variant="default"`, `size="small"`, wrapped in a link to the home route with `aria-label="Azion home"`. The link carries the focus ring and a hover opacity that respects `motion-reduce`.

### C. Documentation — `Button` (required)

One outlined, medium button with the book icon and an `href` to the docs. It is the only action in the bar; do not add Contact, Sign up or a language switch next to it.

## Data

The bar shows no records and fetches nothing; a real app sets only where its two links go. `AuthBarProps` is exported from `auth-bar.vue`.

| Prop       | Type     | What it does                        |
| ---------- | -------- | ----------------------------------- |
| `homeHref` | `string` | Where the brand goes (`/home`).     |
| `docsHref` | `string` | Where Documentation goes (`/docs`). |

| Event  | Payload   | When                                                              |
| ------ | --------- | ----------------------------------------------------------------- |
| `docs` | `(event)` | Documentation was clicked; call `preventDefault` to route in-app. |

To go live, point the links at the app's routes:

```vue
<script setup lang="ts">
  import AuthBar from './auth-bar.vue'
</script>

<template>
  <AuthBar
    home-href="/"
    docs-href="https://example.com/docs"
  />
</template>
```

## Do

- Keep the bar identical across every signed-out step so the user knows they are still in the same flow.
- Let the page under it own the heading and the primary action (the auth card).

## Don't

- Don't add an avatar, a menu or a search: a control that implies a session reads as broken when there is none.
- Don't put the Sign in or Sign up switch in the bar; it lives in the card as a link.

## Copy

- **Documentation button:** one noun, sentence case, no icon-only variant: `Documentation`.
- **Brand link label:** names the destination: `Azion home`.

## Accessibility

- The `AppHeader` is a landmark with its own label (`Console`); keep one per page.
- The brand is a link with an accessible name, not a decorative image.
- Tab order is brand, then Documentation; nothing else in the bar takes focus.

## States

- Default: the only state; the bar never changes between signed-out steps, and `homeHref` / `docsHref` only move its links.

## Related

- `auth/sign-in` — the sign-in and sign-up card this bar sits above.
- `account/onboarding-form` — the first-run steps render the same bar.
- `shell/console` — the bar once the user is signed in, rendered by `ConsoleLayout`.
- `top-bar/creation-bar` — the bar of a signed-in focused flow.

## Variants

- `Default` — primary (the code below)

Each variant is the same screen in another state: `get_block("top-bar/auth-bar", { variant })`, or the file under `blocks/top-bar/auth-bar/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'

  export interface AuthBarProps {
    /** Where the brand goes. */
    homeHref?: string
    /** Where Documentation goes. */
    docsHref?: string
  }

  withDefaults(defineProps<AuthBarProps>(), {
    homeHref: '/home',
    docsHref: '/docs'
  })

  const emit = defineEmits<{
    docs: [event: MouseEvent]
  }>()
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <AppHeader
      aria-label="Console"
      class="shrink-0"
    >
      <AppHeader.Brand>
        <a
          :href="homeHref"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            variant="default"
            size="small"
          />
        </a>
      </AppHeader.Brand>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Documentation"
          variant="outline"
          size="medium"
          icon="az az-book"
          :href="docsHref"
          @click="(event: MouseEvent) => emit('docs', event)"
        />
      </AppHeader.End>
    </AppHeader>
  </div>
</template>
```
