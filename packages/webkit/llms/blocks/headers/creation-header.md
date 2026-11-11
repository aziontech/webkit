# CreationHeader (`headers/creation-header`)

> The console bar for the focused creation shell: create, edit and deploy flows that run without the navigation rail. A `GlobalHeader` in its default `content` placement, spanning the whole window. Start: a small back button, the brand and the breadcrumb of where the flow lives. End: the account avatar alone, so the signed-in user stays visible. The bar carries no search, Create or Agent: the flow is the one thing on screen. Every one-screen create page (SinglePageCreate), every stepped one (MultipageCreate), the creation wizards (SourceWizard, ProvisionWizard), the deploy flows and the CreateHub render it. The back button returns to the list the flow started from; the wizards drop it and the crumb once they reach the provisioning and success screens. Built from `GlobalHeader`, `Breadcrumb`, `IconButton`, `Avatar` and `Brand`.

- Surface: product
- Source: `blocks/headers/creation-header/creation-header.vue` in `@aziontech/webkit`
- MCP: `get_pattern("headers/creation-header")`
- Components: [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [GlobalHeader](../../components/global-header.md), [IconButton](../../components/icon-button.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

creation header; focused shell header; create flow header; flow header with back button; header without sidebar; edit flow header; deploy flow header; cabeçalho de criação; cabeçalho de fluxo; barra com botão voltar; create page header; create zone header; wizard header; header with back and breadcrumb; creation flow top bar; focused page header; cabeçalho da página de criação; cabeçalho do assistente

The top bar of the focused creation shell: create, edit and deploy flows that run without the navigation rail. The user is doing one task with a start and an end, so the bar gives them a linear way out (the back button and the breadcrumb to the list the flow started from) and keeps their identity visible (the avatar), and nothing else. No search, no Create, no Agent: the flow is the only thing on screen.

## When to use

- Every one-screen create page (`platform/create/single-page-create`) and stepped one (`platform/create/multipage-create`).
- The creation wizards (`platform/create/source-wizard`, `platform/create/provision-wizard`), the deploy flows and the Creation Center (`platform/create/create-hub`).

## When not to use

- Browse pages (lists, dashboards, details, settings): use `headers/resource-header` inside `shells/console`.
- A create form that should keep the list visible behind it: use `platform/create/create-in-drawer` and keep the console header.
- Signed-out screens: use `headers/auth-header`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

Default `content` placement spanning the whole window, `aria-label="Console"`. The start cluster lives in `GlobalHeader.Left`, the avatar in `GlobalHeader.Right`; `GlobalHeader.Middle` stays empty. Exactly one header per page.

### B. Back — `IconButton` (required until the flow is terminal)

Small, outlined, chevron icon, with an `aria-label` that names the destination (`Back to Resources`). It returns to the list the flow started from. Drop it only on terminal screens (provisioning, success), where there is nothing left to go back to.

### C. Brand — `Brand` (required)

Inside `GlobalHeader.Brand`, linked to the home route with `aria-label="Azion home"`.

### D. Breadcrumb — `Breadcrumb` (required until the flow is terminal)

Where the flow lives: the module with an `href`, then the current page with none (`Resources › Create Resource`). The crumb links are a way out alongside the back button. A step of a wizard is not a crumb.

### E. Account — `Avatar` (required)

The signed-in user, inside a button labelled `Account settings`. It stays on every screen of the flow, including terminal ones, so the user never looks signed out.

## Do

- Wire the back button and the crumb links to the same place the user came from.
- Confirm before leaving when the form has unsaved input (the flow owns that dialog, not the bar).
- Keep the avatar even when back and crumb are gone.

## Don't

- Don't render the navigation rail or a second header under this one.
- Don't add Create, search or the Agent button: they invite the user to start a second task.
- Don't make the last crumb a link.

## Copy

- **Back label:** `Back to` plus the list name, matching the first crumb: `Back to Resources`.
- **Breadcrumb:** the module as the sidebar names it, then the create action with the entity capitalized: `Create Resource`, `Create Network List`.
- **Avatar label:** `Account settings`.

## Accessibility

- The back control is icon-only, so its `aria-label` is required and must name where it goes.
- `Breadcrumb` renders a labelled `nav`; the last crumb is the current page (`aria-current`).
- Focus order: back, brand, crumbs, avatar.

## States

- Default: back button, brand, breadcrumb to the list, and the avatar.
- CreateHub: the back control returns Home and the crumb is the single current page.
- Terminal: provisioning and success screens keep only the brand and the avatar, with no back control and no crumb.

## Related

- `shells/console` — the persistent shell the flow returns to.
- `headers/resource-header` — the bar on browse pages.
- `platform/create/create-hub`, `platform/create/provision-wizard` — render the CreateHub and Terminal states.

## Variants

- `Default` — primary (the code below)
- `CreateHub` — The Creation Center header: the back control returns Home and the crumb is the single current page.
- `Terminal` — A creation wizard once the last step is submitted: the provisioning and success screens keep only the brand and the avatar, with no back control and no crumb.

Each variant is the same screen in another state: `get_pattern("headers/creation-header", { variant })`, or the file under `blocks/headers/creation-header/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'

  const breadcrumb = [{ label: 'Resources', href: '/resources' }, { label: 'Create Resource' }]
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Resources"
          kind="outlined"
          size="small"
        />
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
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>
  </div>
</template>
```
