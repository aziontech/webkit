# AuthHeader (`headers/auth-header`)

> The console bar for the signed-out and onboarding screens: sign in, sign up, password recovery and the first-run steps. A `GlobalHeader` in its default `content` placement with the brand at the start and one outlined Documentation button at the end. There is no navigation, no search and no account control, because there is no session to act on yet. Built from `GlobalHeader`, `Button` and `Brand`.

- Surface: product
- Source: `blocks/headers/auth-header/auth-header.vue` in `@aziontech/webkit`
- MCP: `get_pattern("headers/auth-header")`
- Components: [Brand](../../components/brand.md), [Button](../../components/button.md), [GlobalHeader](../../components/global-header.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

auth header; signed-out header; login page header; onboarding header; public console header; header without navigation; logged-out top bar; cabeçalho de login; cabeçalho deslogado; barra do topo sem navegação

The top bar of every signed-out and first-run screen: sign in, sign up, password recovery and the onboarding steps. The user has no session yet, so the bar has one job: say where they are (Azion) and offer the one way out that needs no account, the documentation. Everything a signed-in bar carries (navigation, search, Create, the account avatar) is left out because there is nothing to act on.

## When to use

- Above the auth card on sign in, sign up, reset password and MFA screens (`platform/auth`).
- Above the onboarding steps that run before the organization exists (`platform/account/onboarding-form`).

## When not to use

- Any page with a session: use `headers/resource-header` inside the console shell (`shells/console`), or `headers/creation-header` for a create, edit or deploy flow.
- Documentation pages: use `headers/docs-header`. Marketing pages: use `headers/site-header`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

The bar in its default `content` placement, labelled `aria-label="Console"`. Fill `GlobalHeader.Brand` and `GlobalHeader.Right`; keep `GlobalHeader.Middle` empty. Never a bare `<header>`.

### B. Brand — `Brand` (required)

`kind="default"`, `size="small"`, wrapped in a link to the home route with `aria-label="Azion home"`. The link carries the focus ring and a hover opacity that respects `motion-reduce`.

### C. Documentation — `Button` (required)

One outlined, medium button with the book icon and an `href` to the docs. It is the only action in the bar; do not add Contact, Sign up or a language switch next to it.

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

- The `GlobalHeader` is a landmark with its own label (`Console`); keep one per page.
- The brand is a link with an accessible name, not a decorative image.
- Tab order is brand, then Documentation; nothing else in the bar takes focus.

## States

- Default: the only state; the bar never changes between signed-out steps.

## Related

- `platform/auth` — the sign-in and sign-up card this bar sits above.
- `platform/account/onboarding-form` — the first-run steps render the same bar.
- `headers/resource-header` — the bar once the user is signed in.

## Variants

- `Default` — primary (the code below)

Each variant is the same screen in another state: `get_pattern("headers/auth-header", { variant })`, or the file under `blocks/headers/auth-header/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <GlobalHeader
      aria-label="Console"
      class="shrink-0"
    >
      <GlobalHeader.Brand>
        <a
          href="/home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </a>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          href="/docs"
        />
      </GlobalHeader.Right>
    </GlobalHeader>
  </div>
</template>
```
