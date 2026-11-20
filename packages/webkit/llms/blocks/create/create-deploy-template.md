# CreateDeployTemplate (`create/create-deploy-template`)

> The deploy template page, a focused flow outside the console shell: the creation header with Back to Creation Center and the Start from a template crumb, the template preview card naming the repository it clones from, then the step the flow is on with Browse templates under it. Without a Git provider the step is the Connect a Git provider bordered EmptyState; once one is connected it is the Deploy your project form, with the scope and the repository name with its privacy switch side by side over the template settings and two collapsible groups, Build and output settings and Environment variables (a locked key, a value with a show control and a locked Secret checkbox), and a Deploy that checks the form and shows each missing value under its field. While the settings load they are Skeleton bands. Deploying hands the same column to the build logs (the InCreateFlow state of the DeploymentLogs template) and then to the success screen (the DeploySuccess template). Import from Git reaches the same page with the form trimmed to the repository and its build settings, and Upload a Project with the project name, a build preset and the uploaded files with a Root (/) pick for a static project without an index. WhereItRuns opens the flow on the service the project deploys to: a search over the services, six at a time, an inline Create Service row and a way to continue without one, before the Git step. InstallIntegration is the same page for an integration template (Origin Proxy): no Git and no build, its settings with the required origin, What gets added previewing the origin record, the request-phase rule and its behaviors on the service, and Add to the service. Built from `AppHeader`, `Breadcrumb`, `Card`, `EmptyState`, `Field`, `Select`, `InputGroupRoot`, `InputGroupAddon`, `InputGroupInput`, `Switch`, `Input`, `Accordion`, `Checkbox`, `Tooltip`, `Skeleton`, `Item`, `Tag` and `Button`.

- Surface: app
- Source: `blocks/create/create-deploy-template/create-deploy-template.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-deploy-template")`
- Components: [Accordion](../../components/accordion.md), [AppHeader](../../components/app-header.md), [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [Card](../../components/card.md), [Checkbox](../../components/checkbox.md), [ConfirmDialog](../../components/confirm-dialog.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), `InputGroupAddon`, `InputGroupInput`, `InputGroupRoot`, [Item](../../components/item.md), [Kbd](../../components/kbd.md), [Link](../../components/link.md), [Select](../../components/select.md), [Skeleton](../../components/skeleton.md), [Switch](../../components/switch.md), [Tag](../../components/tag.md), [Tooltip](../../components/tooltip.md), `use-escape-to-cancel`, `use-locale`, `use-shortcuts`, `use-unsaved-changes`
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-errors`

## Asked as

deploy template; clone template; template deploy page; connect git provider; deploy from template; one click deploy; start from a template; implantar template; clonar template; conectar git; deploy uploaded project; deploy imported repository; implantar projeto enviado; import from git form; import from git; importar do git; where it runs; select a service; choose service to deploy to; install integration template; integration template; add integration to service; origin proxy template; instalar integração

A focused page, outside the console shell, where the user turns a template into a running project. They chose a template in the Creation Center and now need to see what it clones, connect a Git provider if they have none, name the repository it creates, fill the settings the template requires and deploy. The same column then shows the build and the outcome, so the user never leaves the page.

## When to use

- Use create-deploy-template for the configure-and-deploy step once the source (repository, template or uploaded folder) is chosen.
- The user picked a template, a Git import or an upload from `create/create-hub`, and the next step is to deploy it.
- The flow creates a repository from a source in the user's Git account and deploys from it on every push.
- The template needs a few settings (tokens, a domain) before its first build can run.
- The project must first say which service it runs on (WhereItRuns), or the template is an integration that adds records and a rule to a service instead of cloning code (InstallIntegration).

## When not to use

- Choosing what to start from: use `create/create-hub`.
- A first-level resource created from a form with no source code: use `create/create-page`.
- Provisioning a resource and binding it to another: use `create/create-wizard` (CreateAndDeploy).

## Building blocks

### A. Creation header — `AppHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

The creation header from `top-bar/top-bar-creation`: a small outlined back `IconButton` to the Creation Center, the `Brand` linking home, a `Breadcrumb` whose last crumb is the template and is current, and the account `Avatar` alone on the right. No sidebar, no search.

### B. Template and Git step — `Card`, `EmptyState`, `Button`, `Link` (required)

Above the step, a preview `Card` names the template, its one-sentence description and the repository and path it clones from; it stays on screen for the whole flow. Without a Git provider the step is a medium `bordered` `EmptyState` (its own dashed surface, no wrapper): the provider glyph, the title, one sentence on what happens to the clone, then Continue with GitHub as the secondary large `Button`, Continue without Git as a transparent `Button` and Manage connected providers as a `Link`. Once a provider is connected the step becomes the Deploy your project form in a `Card`: the scope and the repository name side by side, a privacy switch on the name, then the template settings, and a full-width primary Deploy in the footer. While the template settings load, three `Skeleton` field bands stand in for them in an `aria-busy` region and Deploy is disabled.

**Advanced settings (when the source builds).** Under the template settings, two collapsible groups, each a large single `Accordion` with the chevron on the start side inside a bordered frame. **Build and output settings** holds the build fields filled with their defaults (root directory, install command), led by a Build preset `Select` when the framework was detected or must be picked. **Environment variables** holds one row pair per variable: a disabled Key row with the variable name, then a Value row with a show or hide `IconButton` for a secret and a locked Secret `Checkbox` whose `Tooltip` says whether the template keeps it secret. On a phone the Secret addon hides so the value input keeps its width, and the same sentence shows as a muted line under the row. A group opens on its own when it holds a required value. Deploy checks the form: each missing required value shows its `Field.Error` and the group that holds it opens.

**Uploaded project (Upload only).** Reached from a dropped folder there is no Git: the form asks for the project name and a Build preset, then a Project files card shows the folder summary (name, file count and total size, formatted with `Intl.NumberFormat` from the files themselves) and a scrollable list with each file's glyph, monospace path and size. The list shows the first 100 files and an "and N more" line counts the rest; its scroll region is focusable so a keyboard can scroll it. A static project with no `index.html` adds a required Root (/) `Select` of the top-level files, and Deploy waits for it.

**Where it runs (WhereItRuns).** When the project must be bound to a service, the flow opens on a `Card` headed Where it runs: a large search `Input` over the services, up to six small `clickable` `Item` rows (native `button`s with `aria-pressed`, a check on the chosen one), an "N more. Type to narrow the list." line or a no-match line, and a Create Service row that opens an inline New service `Field` with focus in it (Enter on a search with no match opens it prefilled). Continue without a service sits under the card as a transparent small `Button`. Picking a row answers the step; the Git step that follows names the service it deploys to.

**Integration template (InstallIntegration).** An integration template clones nothing and builds nothing: the preview card says which service it adds to, a Configure `Card` lists the template's settings as `Field`s (the required ones flagged only after the action is pressed), and a flush What gets added `Card` previews the origin record, the rule (an `Item` with a Request phase `Tag`) and its behaviors as `Tag`s, updating as the user types. The footer action names the service, e.g. Add to service-01.

### C. Browse templates — `Button` (optional)

An outlined medium `Button` under the step that returns to the template list. It is the way back to choose another template; the header's back control leaves the flow.

## Data

The block takes the template and the account through props and emits every action; it fetches nothing. `DeployTemplateProps` and `DeployTemplateTemplate` are exported from `create-deploy-template.vue`, and `sample.ts` holds the sample template and account the block renders when a prop is left out. The variants are their own screens (the later steps of the flow) and keep their own records.

| Prop            | Type                     | What it does                                                                       |
| --------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| `template`      | `DeployTemplateTemplate` | The template: its name in the crumb, the preview card and the connect description. |
| `account`       | `string`                 | The signed-in account, the avatar label.                                           |
| `providersHref` | `string`                 | Where Manage connected providers leads.                                            |

| Event      | Payload   | When                     |
| ---------- | --------- | ------------------------ |
| `back`     | `(event)` | Back to Creation Center. |
| `account`  | `(event)` | The account button.      |
| `connect`  | `(event)` | Continue with GitHub.    |
| `skip-git` | `(event)` | Continue without Git.    |
| `browse`   | `(event)` | Browse templates.        |

To go live, render the block from the page that loads the template and pass it:

```vue
<script setup lang="ts">
  import CreateDeployTemplate from './create-deploy-template.vue'

  const { template, account } = useTemplatePage()
</script>

<template>
  <CreateDeployTemplate
    :template="template"
    :account="account.email"
    providers-href="/account/git-providers"
    @connect="connectGitHub"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Leaving with typed work: on the Form state the header Back asks first once the scope, the repository name, its visibility or any setting or variable differs from what the form opened with: `useUnsavedChanges` tracks them, Back `await`s `guard.confirmLeave()` before it leaves, and one `ConfirmDialog v-bind="guard.dialogProps"` asks "Unsaved changes" with Keep editing and Discard changes. An untouched form leaves at once. In a router app pair it with `onBeforeRouteLeave(() => guard.confirmLeave())`.
- Keep the template preview card at the top of the column through every phase, so the user always sees what is being deployed.
- Ask for Git first; show the form only once a provider is connected.
- Let Deploy check the form: show each missing required value under its field and open the collapsed group that holds it. Disable Deploy only while the settings load, or on an upload until a Root (/) is picked.
- Keep build and variable settings in their collapsible groups, prefilled with defaults, so a template that needs nothing more deploys in one press.
- Mark a secret variable with the locked Secret checkbox and mask its value, with a show control beside it.
- Hand the same column to the create-flow card of `detail/detail-deployment-logs` (InCreateFlow) on Deploy, then to `create/create-deploy-success`.
- Trim the form to the repository fields for Import from Git, and to the uploaded files for Upload a Project.

## Don't

- Don't open this flow inside the console shell or a drawer; it is a page with its own header.
- Don't ask for settings the template does not use, or move a required setting out of view.
- Don't create the repository before Deploy is pressed.
- Don't replace the page with a new route for the build; the column changes, the page stays.
- Don't put a Cancel next to Deploy; the back control and Browse templates already leave.

## Copy

- **Breadcrumb:** the entry point, then the template name, e.g. "Start from a template" then "Nuxt E-commerce".
- **Back control:** `aria-label` names the destination, e.g. "Back to Creation Center".
- **Git step:** title states the task, e.g. "Connect a Git provider"; description one sentence saying what happens, e.g. "Nuxt E-commerce is cloned into a repository in your account, then deployed from it on every push."
- **Provider buttons:** verb first, e.g. "Continue with GitHub"; the link names the place, e.g. "Manage connected providers".
- **Form heading:** e.g. "Deploy your project"; settings labels 1 to 3 words with the constraint in the description, e.g. "You can find this token in the API credentials of your store."
- **Groups:** "Build and output settings", "Environment variables"; rows "Key", "Value", "Secret"; the reveal control "Show value" or "Hide value".
- **Errors:** "<label> is required.", e.g. "Root directory is required."
- **Upload:** breadcrumb "Upload a project"; "Project files"; "Root (/)" with "Select a file".
- **Import:** breadcrumb "Import from Git"; preview "Import and deploy the acme-web repository from GitHub."
- **Commit:** "Deploy", the same verb on the button and in the run that follows.
- Follow `skills/webkit-microcopy`: sentence case, no em dash in labels or `aria-label`s, no parentheses in labels.

## Accessibility

- **Escape on the page = Cancel.** Escape runs the same path as Back to Creation Center: `useEscapeToCancel` emits `back` from the template step, and the Form `await`s `guard.confirmLeave()` first, so an edited form opens the Unsaved changes dialog. It stays inert while an IME is composing, when another handler already used the key, while a menu, listbox, popover, tooltip or dialog is open, and when focus is in a control that uses Escape itself. Edit and settings pages are places, not tasks: Escape stays inert there.
- **The Form opens with the cursor in Scope**, its first field.
- **⌘ Enter deploys (`Ctrl Enter` off Apple)** through the same function as the Deploy button, from any field; the button carries `aria-keyshortcuts` and an `aria-hidden` `Kbd`, and the `?` dialog lists Deploy.
- One `main` landmark under the header; the step title is an `h2` and the settings group an `h3`.
- The back `IconButton`, the brand link and the account button each have an `aria-label`.
- The repository name has a visible `Field.Label` tied to its input by its `Field`; the privacy switch is labelled Public repository and announces its on or off state.
- Settings use `Field` labels and descriptions, so each input announces its name and constraint.
- Required fields carry the Required marker; a failed Deploy puts each error in a `Field.Error` (`role="alert"`) tied to its input.
- Each `Accordion` trigger is a button that announces its expanded state; the Value input is labelled by its Value label, the Key row by its Key label, and the show control is a toggle with `aria-pressed`.
- The uploaded files list is a `ul` named by the folder, inside a focusable scroll region (`role="region"`, `tabindex="0"`) so it scrolls from the keyboard; while settings load the region is `aria-busy` with one status line.
- The page enter animation stops under reduced motion.

## States

- ConnectGit: no Git provider yet; the `template` preview over the Connect a Git provider card and Browse templates.
- Form: GitHub connected; scope and repository name side by side, public by default, over the store domain setting and the Build and output settings and Environment variables groups; Deploy shows the missing access token under its field.
- BuildSettings: after a failed Deploy; both groups open, a Build preset on the detected Nuxt preset, and the required access token in error.
- SettingsLoading: the template settings loading as Skeleton bands, Deploy disabled.
- ImportFromGit: a repository imported from GitHub; scope and repository name over one collapsed Build and output settings group.
- Upload: a dropped folder; project name and build preset, the Project files card and a required Root (/) for a static project with no index.
- WhereItRuns: the service chooser before the Git step, with search, Create Service and Continue without a service.
- InstallIntegration: the Origin Proxy integration on service-01; its settings, What gets added and Add to service-01, which shows the required origin message.

## Related

- `create/create-hub` — where the user picks the template.
- `detail/detail-deployment-logs` — the build card (InCreateFlow) the column shows after Deploy.
- `create/create-deploy-success` — the outcome the column ends on.
- `top-bar/top-bar-creation` — the header this page uses.
- `state/state-project-intake` — the upload path that reaches this page with files instead of a template.

## Steps

- where-it-runs
- connect-git
- form

## Variants

- `ConnectGit` — primary (the code below)
- `WhereItRuns` — The first step, before Git: Where it runs, a search over the services with six rows at a time and an 'N more' line, an inline Create Service row that opens a New service name field with focus in it (Enter on a search with no match opens it prefilled), and Continue without a service. Picking one answers the step and shows the Connect a Git provider step naming the service it deploys to.
- `Form` — GitHub connected: the jane-doe scope and the nuxt-ecommerce repository name, public by default, over the store domain setting, then two collapsible groups in bordered frames: Build and output settings (root directory and install command, filled with their defaults) and Environment variables, open because the access token is required, each variable a locked Key row over a Value row with a show or hide control and a locked Secret checkbox. Deploy checks the form and shows each missing required value under its field, opening the group that holds it.
- `BuildSettings` — Deploy was pressed with the access token empty: both groups open, Build and output settings led by a Build preset `Select` on the detected Nuxt preset with its helper, and the required NUXT_STORE_ACCESS_TOKEN value showing its error.
- `SettingsLoading` — The template settings are still loading: scope and repository name are ready, three `Skeleton` field bands stand in for the settings in an `aria-busy` region with a status line, and Deploy is disabled.
- `ImportFromGit` — Reached from Import from Git: the crumb and preview card name the acme-web repository it imports from GitHub, the form keeps the scope and repository name and trims the settings to one collapsed Build and output settings group with the detected Vite preset; no template settings, no variables.
- `Upload` — Reached from a dropped folder: no Git and no repository, the project name and an empty Build preset `Select` side by side, then Project files, a card with the folder summary (file count and total size, formatted from the files) and a scrollable, keyboard-focusable list of up to 100 files with their glyph, monospace path and size (an 'and N more' line counts the rest), and, because the static project has no index.html, a required Root (/) `Select` of the top-level files; Deploy waits for it.
- `InstallIntegration` — An integration template (Origin Proxy) on service-01: the preview card says what it adds to, Configure Origin Proxy asks for the required Origin address and the optional Host header, What gets added previews the origin record, the Proxy every path rule tagged Request phase and the behaviors, and Add to service-01 checks the form and shows the required message under the empty origin.

Each variant is the same screen in another state: `get_block("create/create-deploy-template", { variant })`, or the file under `blocks/create/create-deploy-template/variants/`.

## Code (`ConnectGit`)

```vue
<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
  import { computed } from 'vue'

  import { sampleAccount, sampleTemplate } from './sample'

  /** The template the page deploys. */
  export interface DeployTemplateTemplate {
    /** Display name, the preview card title and the last crumb. */
    name: string
    /** One sentence on what it launches. */
    description: string
    /** Logo glyph class. */
    icon: string
    /** The Git provider it clones from, named in the preview card. */
    provider: string
    /** Provider glyph class. */
    providerIcon: string
    /** The account or organization that publishes it. */
    scope: string
    /** The folder or repository it clones. */
    path: string
  }

  export interface DeployTemplateProps {
    /** The template to deploy. Left out, the sample renders. */
    template?: DeployTemplateTemplate
    /** The signed-in account, the avatar label. Left out, the sample renders. */
    account?: string
    /** Where Manage connected providers leads. */
    providersHref?: string
  }

  const props = withDefaults(defineProps<DeployTemplateProps>(), {
    template: undefined,
    account: undefined,
    providersHref: '#'
  })

  const emit = defineEmits<{
    /** Back to Creation Center was pressed. */
    back: [event: MouseEvent | KeyboardEvent]
    /** The account menu button was pressed. */
    account: [event: MouseEvent]
    /** Continue with GitHub was pressed. */
    connect: [event: MouseEvent]
    /** Continue without Git was pressed. */
    'skip-git': [event: MouseEvent]
    /** Browse templates was pressed. */
    browse: [event: MouseEvent]
  }>()

  useEscapeToCancel((event) => emit('back', event))

  const currentTemplate = computed(() => props.template ?? sampleTemplate)
  const currentAccount = computed(() => props.account ?? sampleAccount)

  const breadcrumb = computed(() => [
    { label: 'Start from a template' },
    { label: currentTemplate.value.name, active: true }
  ])
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Creation Center"
          variant="outline"
          size="small"
          @click="(event: MouseEvent) => emit('back', event)"
        />
        <AppHeader.Brand
          href="/home"
          aria-label="Azion home"
        >
          <Brand
            variant="default"
            size="small"
          />
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <button
          type="button"
          aria-label="Account settings"
          @click="(event: MouseEvent) => emit('account', event)"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            :label="currentAccount"
            size="medium"
            variant="square"
          />
        </button>
      </AppHeader.End>
    </AppHeader>

    <main
      class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto"
    >
      <div
        class="layout-column-focused relative flex min-h-full flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-2xl)"
      >
        <Card class="w-full">
          <template #default>
            <div class="flex w-full items-start gap-(--spacing-md)">
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="currentTemplate.icon"
                  class="text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>

              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
                <div class="flex w-full min-w-0 flex-col overflow-hidden">
                  <span class="flex items-center gap-(--spacing-xs)">
                    <span class="truncate text-heading-2xs text-(--text-default)">{{
                      currentTemplate.name
                    }}</span>
                  </span>
                  <span class="text-body-xs text-(--text-muted)">
                    {{ currentTemplate.description }}
                  </span>
                </div>

                <div class="flex w-full flex-col gap-(--spacing-2xs)">
                  <span class="truncate text-body-2xs text-(--text-muted)"
                    >Cloning from {{ currentTemplate.provider }}</span
                  >
                  <div class="flex items-center gap-(--spacing-md)">
                    <span
                      class="flex h-5 items-center gap-(--spacing-2xs) text-label-sm text-(--text-default)"
                    >
                      <i
                        :class="currentTemplate.providerIcon"
                        class="text-[length:inherit] leading-none"
                        aria-hidden="true"
                      />
                      {{ currentTemplate.scope }}
                    </span>
                    <span
                      class="flex h-5 items-center gap-(--spacing-2xs) text-label-sm text-(--text-muted)"
                    >
                      <i
                        class="az az-folder text-[length:inherit] leading-none"
                        aria-hidden="true"
                      />
                      {{ currentTemplate.path }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <div
          data-phase="connect"
          class="flex w-full flex-col items-center gap-(--spacing-xl) data-[phase=success]:my-auto motion-reduce:transition-none! motion-reduce:transform-none!"
        >
          <EmptyState
            bordered
            size="medium"
            title="Connect a Git provider"
            :description="`${currentTemplate.name} is cloned into a repository in your account, then deployed from it on every push.`"
            class="w-full"
          >
            <template #icon>
              <span class="relative flex size-10 items-center justify-center">
                <span
                  aria-hidden="true"
                  class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                />
                <span
                  aria-hidden="true"
                  class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                />
                <span
                  class="relative flex size-10 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface)"
                >
                  <i
                    class="az az-github text-body-md leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </template>
            <template #actions>
              <Button
                label="Continue with GitHub"
                icon="az az-github"
                variant="secondary"
                size="large"
                @click="(event: MouseEvent) => emit('connect', event)"
              />
              <Button
                label="Continue without Git"
                variant="ghost"
                size="large"
                @click="(event: MouseEvent) => emit('skip-git', event)"
              />
              <Link
                label="Manage connected providers"
                :href="providersHref"
                size="large"
              />
            </template>
          </EmptyState>

          <Button
            label="Browse templates"
            variant="outline"
            size="medium"
            @click="(event: MouseEvent) => emit('browse', event)"
          />
        </div>
      </div>
    </main>
  </div>
</template>
```

## `sample.ts`

```ts
import type { DeployTemplateTemplate } from './create-deploy-template.vue'

export const sampleTemplate: DeployTemplateTemplate = {
  name: 'Nuxt E-commerce',
  description: 'Launch a Nuxt e-commerce or content app in a few steps.',
  icon: 'az-color az-nuxt',
  provider: 'GitHub',
  providerIcon: 'az az-github',
  scope: 'acme',
  path: 'templates/nuxt-ecommerce'
}

export const sampleAccount = 'name@example.com'
```
