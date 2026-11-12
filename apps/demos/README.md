# WebKit demos

`@aziontech/webkit-demos` is a routed Vue 3 app that shows WebKit blocks working together as a
product, on mock data. It is assembled the way a consumer would assemble one: every screen was
copied with the CLI from the workspace package, then only its content (copy, data, handlers) was
changed to wire it to the router and to a shared store. `webkit.blocks.json` records where each
file came from, so `npx @aziontech/webkit diff <file>` shows what the demo changed.

```bash
pnpm demos:dev       # dev server
pnpm demos:build     # static build in apps/demos/dist
pnpm demos:preview   # preview the build on http://localhost:4174
```

## Flows

| Route                                | Screen (block)                                                   | What it does                                                                                     |
| ------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `/resources`                         | `platform/view/table-view` in `ConsoleLayout` (`shells/console`) | List with filters, preferences and row actions (View, Deploy, Delete)                            |
| `/resources/new`                     | `platform/create/single-page-create`                             | Create with validation; Save adds the resource, toasts and opens its detail                      |
| `/resources/:id`                     | `platform/detail/details-page`                                   | Detail of the resource; Resource actions → Edit, Deploy, Delete                                  |
| `/resources/:id/edit`                | `platform/edit/edit-resource`                                    | Edit with the save bar; Save updates the store, toasts and returns to the detail                 |
| `/resources/:id/delete`              | `platform/delete/delete-with-confirmation` over the list         | Typed confirmation; Delete removes the row, toasts and closes                                    |
| `/resources/:id/deploy`              | `platform/states/async-submit`                                   | A deploy that runs outside the page: progress toast, then a toast with **Edit** and **Redeploy** |
| `/settings`                          | `platform/settings/settings-form`                                | Account settings with save all / per group / per card                                            |
| `/onboarding` → `/plan` → `/profile` | `platform/account/onboarding-form` (Organization, Plan, Profile) | Three steps; creating the organization goes to the list                                          |
| `/assistant`                         | `platform/ai/ai-chat`                                            | AI assistant: prompt, streamed answer with reasoning and sources, suggestions                    |

`src/App.vue` is the `shells/console` block: it composes `ConsoleLayout` once around `RouterView`
with the demo's navigation (`src/lib/navigation.ts`), the breadcrumbs from the route meta, the ⌘K
palette (recent resources, Create Resource, Switch theme) and the account menu. Every browse route
(list, detail, edit, deploy, settings, assistant) renders only its page body in the layout's default
slot; the detail, edit and deploy pages set their own trail with `ConsoleLayout.Breadcrumbs`. The
focused flows (create and the onboarding steps) carry `meta: { shell: 'focused' }` and render
outside the layout, with their own header and no rail.

The bar at the bottom corner switches the flow, the theme (light / dark), the direction (left to
right / right to left) and the language (English / Português, through the opt-in
`@aziontech/webkit/locales/pt-BR` catalog on `WebkitProvider`). The settings can also be given in
the URL: `?theme=light&dir=rtl&lang=pt-BR`.

## How it was built

```bash
cd apps/demos
node ../../packages/webkit/src/cli/cli.js add shells/console --dest src/App.vue
node ../../packages/webkit/src/cli/cli.js add platform/view/table-view --dest src/views
node ../../packages/webkit/src/cli/cli.js add platform/account/onboarding-form --dest src/views
node ../../packages/webkit/src/cli/cli.js add platform/account/onboarding-form --variant Plan --dest src/views
# … one `add` per screen in the table above
```

Outside this repository the same commands are `npx @aziontech/webkit add <block>`. The shared
pieces are small: `src/lib/navigation.ts` (the rail and palette data), `src/lib/store.ts` (the resources), `src/lib/deploy.ts` (the deploy run and its
toast), `src/lib/settings.ts` (theme, direction, language) and `src/router.ts`. Styles come in through
`src/webkit.css` (the theme and `@aziontech/webkit/styles`, as `webkit init` writes it), and the app
lints with the strict `@aziontech/webkit/eslint-plugin` preset and the webkit Stylelint config. Blocks import their images from `@aziontech/webkit/assets/<file>`, so the demos have no public folder.

Every route is screenshotted by the styled visual suite (`apps/visual`, `tests/demos.spec.ts`),
which also runs the flows end to end (create, edit, delete, deploy toast, onboarding, assistant).
