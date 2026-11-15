# Creation bar

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

### A. Bar — `AppHeader` (required)

Default `content` placement spanning the whole window, `aria-label="Console"`. The start cluster lives in `AppHeader.Start`, the avatar in `AppHeader.End`; `AppHeader.Center` stays empty. Exactly one header per page.

### B. Back — `IconButton` (required until the flow is terminal)

Small, outlined, chevron icon, a link (`href`) to the list the flow started from, with an `aria-label` that names the destination (`Back to Resources`) and a `Tooltip` with the same text. Drop it only on terminal screens (provisioning, success), where there is nothing left to go back to.

### C. Brand — `Brand` (required)

Inside `AppHeader.Brand`, linked to the home route with `aria-label="Azion home"`.

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
