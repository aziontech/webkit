# WebKit demos

`@aziontech/webkit-demos` is a routed Vue 3 app that shows WebKit blocks working together as a
product, on mock data. It is assembled the way a consumer would assemble one: every block was
copied with the CLI from the workspace package into `src/blocks/`, and each route in `src/pages/`
renders its block, passes it the demo's data (the shared store) and handles the events it emits
(navigate, update the store, show a toast). `webkit.blocks.json` records where each copied file came
from, so `npx @aziontech/webkit diff <file>` shows what the demo changed and
`npx @aziontech/webkit check` warns when a canonical block moved on.

```bash
pnpm dev:demos       # dev server
pnpm build:demos     # static build in apps/demos/dist
pnpm preview:demos   # preview the build on http://localhost:4174
```

`preview:demos` serves the build with the docs server (`apps/docs/scripts/serve.mjs --root dist
--spa`), so the demos get the same security headers as the docs: `nosniff`, a strict referrer
policy and a content security policy that allows only the app's own scripts and the hash of its
inline theme script. A host that deploys the demos sends the same headers (see the docs README,
"Build and deploy").

## Flows

| Route                                | Screen (block)                                               | What it does                                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/resources`                         | `view/view-table` in `ConsoleLayout` (`shell/shell-console`) | List with filters, preferences and row actions (View, Deploy, Delete)                                                                                        |
| `/resources/new`                     | `create/create-page`                                         | Create with validation; Create resource adds it, toasts and opens its detail                                                                                 |
| `/resources/:id`                     | `detail/detail-resource`                                     | Detail of the resource; Resource actions → Copy URL, Settings (opens the edit page)                                                                          |
| `/resources/:id/edit`                | `edit/edit-resource`                                         | Edit with the save bar; Save updates the store, toasts and returns to the detail                                                                             |
| `/resources/:id/delete`              | `edit/edit-delete-dialog` over the list                      | Typed confirmation; Delete removes the row, toasts and closes                                                                                                |
| `/resources/:id/deploy`              | `state/state-async-submit`                                   | A deploy that runs outside the page: progress toast, then a toast with **Edit** and **Redeploy**                                                             |
| `/settings`                          | `settings/settings-form`                                     | Account settings with save all / per group / per card                                                                                                        |
| `/profile`                           | `account/account-user-profile`                               | The whole profile page: contributions year over year, then the profile, security, notification and preference tabs; Save updates the account menu and toasts |
| `/onboarding` → `/plan` → `/profile` | `account/account-onboarding-form`                            | One wizard, its step bound to the route; creating the organization goes to the list                                                                          |
| `/assistant`                         | `ai/ai-chat`                                                 | AI assistant: prompt, streamed answer with reasoning and sources, suggestions                                                                                |
| `/settings/api-keys`                 | `settings/settings-api-key`                                  | Integration API keys: pick a provider (GitHub, OpenAI, etc.), save, test and remove a key                                                                    |
| `/support`                           | `view/view-ticket-inbox`                                     | Ticket inbox: saved views with live counts, filters, bulk Assign, Change status, Merge and Close                                                             |
| `/support/tickets/new`               | `create/create-ticket`                                       | Create a ticket: adds it, toasts with Open ticket and opens it; Save and add another stays                                                                   |
| `/support/tickets/:id`               | `detail/detail-ticket`                                       | One ticket: send a reply or a note, change status and properties, insert a canned response, Reopen                                                           |
| `/support/customers/:id`             | `detail/detail-customer`                                     | Customer profile: their tickets, activity and notes; New ticket opens create with the requester                                                              |
| `/support/settings/canned-responses` | `settings/settings-canned-responses`                         | Canned responses: create, edit, duplicate and delete; the ticket composer inserts the same list                                                              |

`src/app.vue` is the `shell/shell-console` block: it composes `ConsoleLayout` once around `RouterView`
with the demo's navigation (`src/lib/navigation.ts`), the breadcrumbs from the route meta, the ⌘K
palette (recent resources, Create Resource, Switch theme) and the account menu. Every browse route
(list, detail, edit, deploy, settings, assistant) renders only its page body in the layout's default
slot; the detail, edit and deploy pages set their own trail with `ConsoleLayout.Breadcrumb`. The
focused flows (create, create ticket and the onboarding steps) carry `meta: { shell: 'focused' }` and render
outside the layout, with their own header and no rail.

The bar at the bottom corner switches the flow, the theme (light / dark), the direction (left to
right / right to left) and the language (English / Português, through the opt-in
`@aziontech/webkit/locales/pt-BR` catalog on `ConfigProvider`). The settings can also be given in
the URL: `?theme=light&dir=rtl&lang=pt-BR`.

## How it was built

```bash
cd apps/demos
node ../../packages/webkit/src/cli/cli.js add shell/shell-console --dest src/app.vue
node ../../packages/webkit/src/cli/cli.js add view/view-table --dest src/blocks
node ../../packages/webkit/src/cli/cli.js add account/account-onboarding-form --dest src/blocks
# … one `add` per block in the table above
```

`add` writes kebab-case files named after the block (`table-view.vue`) with its parts and sample
data beside it (`table-view-collection-controls.vue`, `table-view.sample.ts`); parts the demo never
renders are dropped with `remove <path>`. The blocks take their data as props and report what the
user did as events, so most copies change only their imports, re-sorted for the app's lint. The
content changes, which `npx @aziontech/webkit diff <file>` lists:

- `create-page` names the resource flow (breadcrumb, title, copy), takes the signed-in account and
  stops above the demo bar, like `create-ticket` and `onboarding-form` (`h-(--demo-viewport-height)`).
- `table-view` stacks its rows on a phone and hands Delete to the page, which opens the shared
  delete dialog route.
- `resource-detail` and `edit-resource` share one header and one tab set: the resource name, then
  Overview, Versions, Build, Deployments and Settings. Settings on the detail opens the edit page;
  the edit page asks before a route change drops unsaved edits, as `settings-form` does.
- `async-submit` takes the service `name` and leaves the toasts to `src/lib/deploy.ts`, so the run
  reports back after you leave the page.
- The `ai-chat` copies call the assistant the Agent, and the chat history lives in the shell's
  side menu (`src/components/copilot-history.vue`), so the block's own history panel is left out.
- `create-ticket`'s header shows the demo account.
- `src/app.vue`, the `shell/shell-console` shell, renders `RouterView` with the demo's navigation,
  the Agent rail and the demo bar; it is the demo's own shell and keeps only the block's layout.

The ticket links of the support blocks point at `/tickets` and `/tickets/:id`, which the router
redirects to `/support`.

To update after a release, run `npx @aziontech/webkit check`; for each block it reports, look at
`npx @aziontech/webkit diff <file>`, copy it again with `add <block> --dest src/blocks --force`,
and reapply the content changes listed above.

Outside this repository the same commands are `npx @aziontech/webkit add <block>`. The shared
pieces are small: `src/lib/navigation.ts` (the rail and palette data), `src/lib/store.ts` (the resources), `src/lib/deploy.ts` (the deploy run and its
toast), `src/lib/assistant.ts` (the assistant's canned answers), `src/lib/assistant-model.ts` (TanStack AI's `fakeText` model behind `useChat`, run in the browser with no server or key, with a deployment tool that asks for approval), `src/lib/settings.ts` (theme, direction, language) and `src/router.ts`. Styles come in through
`src/webkit.css` (the theme, `@aziontech/webkit/styles` and the `webkit.sources.css` the WebKit Vite plugin writes from the demos' imports, the setup `webkit init` gives an app) and `src/styles/main.css` (the app's own base styles), and the app
lints with the strict `@aziontech/webkit/eslint-plugin` preset and the webkit Stylelint config. Blocks import their images from `@aziontech/webkit/assets/<file>`, so the demos have no public folder.

Every route is screenshotted by the styled visual suite (`apps/visual`, `tests/demos.spec.ts`),
which also runs the flows end to end (create, edit, delete, deploy toast, onboarding, assistant).
