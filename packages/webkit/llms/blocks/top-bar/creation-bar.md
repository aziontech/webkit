# CreationBar (`top-bar/creation-bar`)

> The console bar for the focused creation shell: create, edit and deploy flows that run without the navigation rail. A `GlobalHeader` in its default `content` placement, spanning the whole window. Start: a small back link with a `Tooltip`, the brand and the breadcrumb of where the flow lives. End: the account avatar alone, opening the account `DropdownMenu`, so the signed-in user stays visible. The bar carries no search, Create or Agent: the flow is the one thing on screen. Every one-screen create page (SinglePageCreate), every stepped one (MultipageCreate, with its CreateAndDeploy wizard), the deploy flows (DeployTemplate) and the CreateHub render it. The back button returns to the list the flow started from; a wizard drops it and the crumb once they reach the provisioning and success screens. Built from `GlobalHeader`, `Breadcrumb`, `IconButton`, `Tooltip`, `Avatar`, `DropdownMenu` and `Brand`.

- Surface: app
- Source: `blocks/top-bar/creation-bar/creation-bar.vue` in `@aziontech/webkit`
- MCP: `get_block("top-bar/creation-bar")`
- Components: [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [DropdownMenu](../../components/dropdown-menu.md), [GlobalHeader](../../components/global-header.md), [IconButton](../../components/icon-button.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

creation header; focused shell header; create flow header; flow header with back button; header without sidebar; edit flow header; deploy flow header; cabeçalho de criação; cabeçalho de fluxo; barra com botão voltar; create page header; create zone header; wizard header; header with back and breadcrumb; creation flow top bar; focused page header; cabeçalho da página de criação; cabeçalho do assistente; top bar; creation bar; top navigation without rail; focused top bar; barra de criação

The top bar of the focused creation shell: create, edit and deploy flows that run without the navigation rail. The user is doing one task with a start and an end, so the bar gives them a linear way out (the back button and the breadcrumb to the list the flow started from) and keeps their identity visible (the avatar), and nothing else. No search, no Create, no Agent: the flow is the only thing on screen.

## When to use

- Use creation-bar on focused create, edit and deploy pages that run without the navigation rail.
- Every one-screen create page (`create/create-page`) and stepped one (`create/create-wizard`, including its CreateAndDeploy wizard).
- The deploy flows (`create/deploy-template`) and the Creation Center (`create/create-hub`).

## When not to use

- Browse pages (lists, dashboards, details, settings): `ConsoleLayout` renders their bar (`shell/console`).
- A create form that should keep the list visible behind it: use `create/create-drawer` and keep the console header.
- Signed-out screens: use `top-bar/auth-bar`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

Default `content` placement spanning the whole window, `aria-label="Console"`. The start cluster lives in `GlobalHeader.Start`, the avatar in `GlobalHeader.End`; `GlobalHeader.Center` stays empty. Exactly one header per page.

### B. Back — `IconButton` (required until the flow is terminal)

Small, outlined, chevron icon, a link (`href`) to the list the flow started from, with an `aria-label` that names the destination (`Back to Resources`) and a `Tooltip` with the same text. Drop it only on terminal screens (provisioning, success), where there is nothing left to go back to.

### C. Brand — `Brand` (required)

Inside `GlobalHeader.Brand`, linked to the home route with `aria-label="Azion home"`.

### D. Breadcrumb — `Breadcrumb` (required until the flow is terminal)

Where the flow lives: the module with an `href`, then the current page with none (`Resources › Create Resource`). The crumb links are a way out alongside the back button. A step of a wizard is not a crumb.

### E. Account — `DropdownMenu` + `Avatar` (required)

The signed-in user, inside a button labelled `Account menu` that opens the account `DropdownMenu`: name and email on top, Account settings, then Docs and Log out. It stays on every screen of the flow, including terminal ones, so the user never looks signed out.

### F. Hint — `Tooltip` (required)

Names the icon-only back link with the same text as its `aria-label` (`Back to Resources`).

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
- **Avatar label:** `Account menu`.

## Accessibility

- The back control is icon-only, so its `aria-label` is required and must name where it goes.
- `Breadcrumb` renders a labelled `nav`; the last crumb is the current page (`aria-current`).
- Focus order: back, brand, crumbs, avatar.

## States

- Default: back button, brand, breadcrumb to the list, and the avatar.
- CreateHub: the back control returns Home and the crumb is the single current page.
- Terminal: provisioning and success screens keep only the brand and the avatar, with no back control and no crumb.

## Related

- `shell/console` — the persistent shell the flow returns to.
- `top-bar/auth-bar` — the bar of signed-out screens.
- `create/create-hub`, `create/create-wizard` — render the CreateHub and Terminal states.

## Variants

- `Default` — primary (the code below)
- `CreateHub` — The Creation Center header: the back control returns Home and the crumb is the single current page.
- `Terminal` — A creation wizard once the last step is submitted: the provisioning and success screens keep only the brand and the avatar, with no back control and no crumb.

Each variant is the same screen in another state: `get_block("top-bar/creation-bar", { variant })`, or the file under `blocks/top-bar/creation-bar/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  const breadcrumb = [{ label: 'Resources', href: '/resources' }, { label: 'Create Resource' }]

  const account = { name: 'Amy Chen', email: 'amy.chen@example.com' }
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Start>
        <Tooltip
          text="Back to Resources"
          placement="bottom"
        >
          <IconButton
            icon="ai ai-chevron-left"
            aria-label="Back to Resources"
            kind="outlined"
            size="small"
            href="/resources"
          />
        </Tooltip>
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Start>
      <GlobalHeader.Center />
      <GlobalHeader.End>
        <DropdownMenu placement="bottom-end">
          <DropdownMenu.Trigger>
            <button
              type="button"
              aria-label="Account menu"
              class="rounded-(--shape-button) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            >
              <Avatar
                :label="account.name"
                size="medium"
                kind="square"
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <template #top>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-label-md text-(--text-default)">{{ account.name }}</span>
                <span class="truncate text-body-xs text-(--text-muted)">{{ account.email }}</span>
              </div>
            </template>
            <DropdownMenu.Item
              value="settings"
              label="Account settings"
            >
              <template #trailing>
                <i
                  class="ai ai-settings"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="docs"
              label="Docs"
            >
              <template #trailing>
                <i
                  class="ai ai-book"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              value="logout"
              label="Log out"
            >
              <template #trailing>
                <i
                  class="ai ai-log-out"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu>
      </GlobalHeader.End>
    </GlobalHeader>
  </div>
</template>
```
