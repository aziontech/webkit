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

## Flows

| Route                                | Screen (block)                                               | What it does                                                                                     |
| ------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `/resources`                         | `view/view-table` in `ConsoleLayout` (`shell/shell-console`) | List with filters, preferences and row actions (View, Deploy, Delete)                            |
| `/resources/new`                     | `create/create-page`                                         | Create with validation; Create resource adds it, toasts and opens its detail                     |
| `/resources/:id`                     | `detail/detail-resource`                                     | Detail of the resource; Resource actions → Copy URL, Settings (opens the edit page)              |
| `/resources/:id/edit`                | `edit/edit-resource`                                         | Edit with the save bar; Save updates the store, toasts and returns to the detail                 |
| `/resources/:id/delete`              | `edit/edit-delete-dialog` over the list                      | Typed confirmation; Delete removes the row, toasts and closes                                    |
| `/resources/:id/deploy`              | `state/state-async-submit`                                   | A deploy that runs outside the page: progress toast, then a toast with **Edit** and **Redeploy** |
| `/settings`                          | `settings/settings-form`                                     | Account settings with save all / per group / per card                                            |
| `/onboarding` → `/plan` → `/profile` | `account/account-onboarding-form`                            | One wizard, its step bound to the route; creating the organization goes to the list              |
| `/assistant`                         | `ai/ai-chat`                                                 | AI assistant: prompt, streamed answer with reasoning and sources, suggestions                    |
| `/settings/ai-keys`                  | `ai/ai-api-key`                                              | Bring your own key: pick a provider, save, test and remove a key, kept in memory                 |

`src/app.vue` is the `shell/shell-console` block: it composes `ConsoleLayout` once around `RouterView`
with the demo's navigation (`src/lib/navigation.ts`), the breadcrumbs from the route meta, the ⌘K
palette (recent resources, Create Resource, Switch theme) and the account menu. Every browse route
(list, detail, edit, deploy, settings, assistant) renders only its page body in the layout's default
slot; the detail, edit and deploy pages set their own trail with `ConsoleLayout.Breadcrumb`. The
focused flows (create and the onboarding steps) carry `meta: { shell: 'focused' }` and render
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

`add` writes kebab-case files named after the block (`table-view.vue`) and its sample data beside
it (`table-view.sample.ts`). The blocks take their data as props and report what the user did as
events, so most copies are unchanged; a page such as `src/pages/table-view-page.vue` binds
`:resources` to the store and handles `@delete`. Three copies changed content only: `create-page`
names the resource flow in its breadcrumb and title and wires its back button to `cancel`,
`async-submit` takes the service `name` and leaves the toasts to `src/lib/deploy.ts` (so the run
reports back after you leave the page), and `src/app.vue`, the `shell/shell-console` shell, renders
`RouterView` with the demo's navigation.

To update after a release, run `npx @aziontech/webkit check`; for each block it reports, look at
`npx @aziontech/webkit diff <file>`, copy it again with `add <block> --dest src/blocks --force`,
and reapply the content changes listed above.

Outside this repository the same commands are `npx @aziontech/webkit add <block>`. The shared
pieces are small: `src/lib/navigation.ts` (the rail and palette data), `src/lib/store.ts` (the resources), `src/lib/deploy.ts` (the deploy run and its
toast), `src/lib/assistant.ts` (the assistant's canned answers), `src/lib/assistant-model.ts` (TanStack AI's `fakeText` model behind `useChat`, run in the browser with no server or key, with a deployment tool that asks for approval), `src/lib/settings.ts` (theme, direction, language) and `src/router.ts`. Styles come in through
`src/webkit.css` (the theme and `@aziontech/webkit/styles/all`: the demos render every block, so they register every component instead of an app's `webkit.sources.css`) and `src/styles/main.css` (the app's own base styles), and the app
lints with the strict `@aziontech/webkit/eslint-plugin` preset and the webkit Stylelint config. Blocks import their images from `@aziontech/webkit/assets/<file>`, so the demos have no public folder.

Every route is screenshotted by the styled visual suite (`apps/visual`, `tests/demos.spec.ts`),
which also runs the flows end to end (create, edit, delete, deploy toast, onboarding, assistant).
