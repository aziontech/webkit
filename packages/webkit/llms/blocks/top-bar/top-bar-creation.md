# TopBarCreation (`top-bar/top-bar-creation`)

> The console bar for the focused creation shell: create, edit and deploy flows that run without the navigation rail. A `AppHeader` in its default `content` placement, spanning the whole window. Start: a small back link with a `Tooltip`, the brand and the breadcrumb of where the flow lives. End: the account avatar alone, opening the account `DropdownMenu`, so the signed-in user stays visible. The bar carries no search, Create or Agent: the flow is the one thing on screen. Every one-screen create page (SinglePageCreate), every stepped one (MultipageCreate, with its CreateAndDeploy wizard), the deploy flows (DeployTemplate) and the Creation Center (`create/create-hub`) render it. The back button returns to the list the flow started from; a wizard drops it and the crumb once they reach the provisioning and success screens. Built from `AppHeader`, `Breadcrumb`, `IconButton`, `Tooltip`, `AppHeaderAccount`, `DropdownMenu` and `Brand`.

- Surface: app
- Source: `blocks/top-bar/top-bar-creation/top-bar-creation.vue` in `@aziontech/webkit`
- MCP: `get_block("top-bar/top-bar-creation")`
- Components: [AppHeader](../../components/app-header.md), `AppHeaderAccount`, [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [DropdownMenu](../../components/dropdown-menu.md), [IconButton](../../components/icon-button.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

creation header; focused shell header; create flow header; flow header with back button; header without sidebar; edit flow header; deploy flow header; cabeçalho de criação; cabeçalho de fluxo; barra com botão voltar; create page header; create zone header; wizard header; header with back and breadcrumb; creation flow top bar; focused page header; cabeçalho da página de criação; cabeçalho do assistente; top bar; creation bar; top navigation without rail; focused top bar; barra de criação

The top bar of the focused creation shell: create, edit and deploy flows that run without the navigation rail. The user is doing one task with a start and an end, so the bar gives them a linear way out (the back button and the breadcrumb to the list the flow started from) and keeps their identity visible (the avatar), and nothing else. No search, no Create, no Agent: the flow is the only thing on screen.

## When to use

- Use top-bar-creation on focused create, edit and deploy pages that run without the navigation rail.
- Every one-screen create page (`create/create-page`) and stepped one (`create/create-wizard`, including its CreateAndDeploy wizard).
- The deploy flows (`create/create-deploy-template`) and the Creation Center (`create/create-hub`).

## When not to use

- Browse pages (lists, dashboards, details, settings): `ConsoleLayout` renders their bar (`shell/shell-console`).
- A create form that should keep the list visible behind it: use `create/create-drawer` and keep the console header.
- Signed-out screens: use `top-bar/top-bar-auth`.

## Building blocks

### A. Bar — `AppHeader` (required)

Default `content` placement spanning the whole window, `aria-label="Console"`. The start cluster lives in `AppHeader.Start`, the avatar in `AppHeader.End`; `AppHeader.Center` stays empty. Exactly one header per page.

### B. Back — `IconButton` (required until the flow is terminal)

Small, outlined, chevron icon, a link (`href`) to the list the flow started from, with an `aria-label` that names the destination (`Back to Resources`) and a `Tooltip` with the same text. Drop it only on terminal screens (provisioning, success), where there is nothing left to go back to.

### C. Brand — `Brand` (required)

Inside `AppHeader.Brand`, linked to the home route through its `href` with `aria-label="Azion home"`. Below `sm` it is the reduced "A" glyph (`variant="reduced"`), so the breadcrumb keeps the room to name both pages on a 320px phone.

### D. Breadcrumb — `Breadcrumb` (required until the flow is terminal)

Where the flow lives: the module with an `href`, then the current page with none (`Resources › Create Resource`). The crumb links are a way out alongside the back button. A step of a wizard is not a crumb.

### E. Account — `DropdownMenu` + `AppHeaderAccount` (required)

The signed-in user, inside a button labelled `Account menu` that opens the account `DropdownMenu`: name and email on top, Account settings, then Docs and Log out. It stays on every screen of the flow, including terminal ones, so the user never looks signed out.

### F. Hint — `Tooltip` (required)

Names the icon-only back link with the same text as its `aria-label` (`Back to Resources`).

## Data

The block fetches nothing; it takes the signed-in user and the way out through props and emits the menu choice. `CreationBarAccount`, `CreationBarCrumb` and `CreationBarProps` are exported from `top-bar-creation.vue`, and `sample.ts` holds the sample user the bar renders when `account` is left out.

| Prop         | Type                 | What it does                                                                    |
| ------------ | -------------------- | ------------------------------------------------------------------------------- |
| `account`    | `CreationBarAccount` | The signed-in user: the avatar initials and the name and email in the menu.     |
| `backHref`   | `string`             | Where the back control goes (`/resources`); empty hides it on terminal screens. |
| `backLabel`  | `string`             | The back control's name and tooltip (`Back to Resources`).                      |
| `homeHref`   | `string`             | Where the brand goes (`/home`).                                                 |
| `breadcrumb` | `CreationBarCrumb[]` | The trail beside the brand (`Resources › Create Resource`); `[]` hides it.      |

| Event            | Payload          | When                                                                |
| ---------------- | ---------------- | ------------------------------------------------------------------- |
| `account-select` | `(event, value)` | Account settings (`settings`), Docs (`docs`) or Log out (`logout`). |
| `navigate`       | `(event, href)`  | A crumb link was activated; call `preventDefault` to route in-app.  |

To go live, pass the session's user and the list the flow started from:

```vue
<script setup lang="ts">
  import TopBarCreation from './top-bar-creation.vue'

  const { user, signOut } = useSession()
  const onAccount = (event: Event, value: unknown) => {
    if (value === 'logout') signOut()
  }
</script>

<template>
  <TopBarCreation
    :account="{ name: user.name, email: user.email }"
    back-href="/domains"
    back-label="Back to Domains"
    :breadcrumb="[{ label: 'Domains', href: '/domains' }, { label: 'Create Domain' }]"
    @account-select="onAccount"
  />
</template>
```

Then delete `sample.ts` and its import.

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

- Default: back button, brand, breadcrumb to the list, and the avatar of `account`.
- CreateHub: `back-href="/home"` and `back-label="Back to Home"` return Home, and `breadcrumb` is the single current page.
- Terminal: `back-href=""` and `:breadcrumb="[]"` keep only the brand and the avatar on the provisioning and success screens, with no back control and no crumb.

## Related

- `shell/shell-console` — the persistent shell the flow returns to.
- `top-bar/top-bar-auth` — the bar of signed-out screens.
- `create/create-hub`, `create/create-wizard` — render the CreateHub and Terminal states.

## Variants

- `Default` — primary (the code below)
- `CreateHub` — The Creation Center header: the back control returns Home and the crumb is the single current page.
- `Terminal` — A creation wizard once the last step is submitted: the provisioning and success screens keep only the brand and the avatar, with no back control and no crumb.

Each variant is the same screen in another state: `get_block("top-bar/top-bar-creation", { variant })`, or the file under `blocks/top-bar/top-bar-creation/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb, { type BreadcrumbItemData } from '@aziontech/webkit/breadcrumb-root'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import { sampleAccount } from './sample'

  /** The signed-in user shown on the avatar and in the account menu. */
  export interface CreationBarAccount {
    /** Full name; the avatar shows its initials. */
    name: string
    /** Email shown under the name in the menu. */
    email: string
  }

  /** One crumb of the trail beside the brand. */
  export type CreationBarCrumb = BreadcrumbItemData

  export interface CreationBarProps {
    /** The signed-in user. Left out, the sample renders. */
    account?: CreationBarAccount
    /** Where the back control goes; empty hides it, as on the terminal screens. */
    backHref?: string
    /** Name of the back control, read by its tooltip and by screen readers. */
    backLabel?: string
    /** Where the brand goes. */
    homeHref?: string
    /** The trail beside the brand; empty hides it. */
    breadcrumb?: CreationBarCrumb[]
  }

  const props = withDefaults(defineProps<CreationBarProps>(), {
    account: undefined,
    backHref: '/resources',
    backLabel: 'Back to Resources',
    homeHref: '/home',
    breadcrumb: () => [{ label: 'Resources', href: '/resources' }, { label: 'Create Resource' }]
  })

  const emit = defineEmits<{
    'account-select': [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
    navigate: [event: MouseEvent, href: string]
  }>()

  const account = computed(() => props.account ?? sampleAccount)
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <Tooltip
          v-if="backHref"
          :content="backLabel"
          side="bottom"
        >
          <IconButton
            icon="az az-chevron-left"
            :aria-label="backLabel"
            variant="outline"
            size="small"
            :href="backHref"
          />
        </Tooltip>
        <AppHeader.Brand
          :href="homeHref"
          aria-label="Azion home"
        >
          <span class="flex max-sm:hidden">
            <Brand
              variant="default"
              size="small"
            />
          </span>
          <span class="flex sm:hidden">
            <Brand
              variant="reduced"
              size="small"
            />
          </span>
        </AppHeader.Brand>
        <Breadcrumb
          v-if="breadcrumb.length > 0"
          :items="breadcrumb"
          @navigate="(event, href) => emit('navigate', event, href)"
        />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <DropdownMenu
          side="bottom"
          align="end"
          @select="(event, value) => emit('account-select', event, value)"
        >
          <DropdownMenu.Trigger>
            <AppHeaderAccount
              :name="account.name"
              aria-label="Account menu"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <template #header>
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
                  class="az az-settings"
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
                  class="az az-book"
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
                  class="az az-log-out"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu>
      </AppHeader.End>
    </AppHeader>
  </div>
</template>
```

## `sample.ts`

```ts
import type { CreationBarAccount } from './top-bar-creation.vue'

export const sampleAccount: CreationBarAccount = {
  name: 'Amy Chen',
  email: 'amy.chen@example.com'
}
```
