# DeployTemplate (`platform/create/deploy-template`)

> The deploy template page, a focused flow outside the console shell: the creation header with Back to Creation Center and the Start from a template crumb, the template preview card naming the repository it clones from, then the step the flow is on with Browse templates under it. Without a Git provider the step is the Connect a Git provider card; once one is connected it is the Deploy your project form, with the scope and the repository name with its privacy switch side by side over the template settings, and the Deploy button that stays disabled until every required setting is filled. Deploying hands the same column to the build logs (the DeploymentFlow template) and then to the success screen (the DeploySuccess template). Import from Git and Upload a Project reach the same page with the form trimmed to the repository or the uploaded files. Built from `GlobalHeader`, `Breadcrumb`, `Card`, `EmptyState`, `Field`, `Select`, `Label`, `InputGroupRoot`, `InputGroupAddon`, `InputGroupInput`, `Switch`, `Input` and `Button`.

- Surface: product
- Source: `blocks/platform/create/deploy-template/deploy-template.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/deploy-template")`
- Components: [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [GlobalHeader](../../../components/global-header.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), `InputGroupAddon`, `InputGroupInput`, `InputGroupRoot`, [Label](../../../components/label.md), [Link](../../../components/link.md), [Select](../../../components/select.md), [Switch](../../../components/switch.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-errors`

## Asked as

deploy template; clone template; template deploy page; connect git provider; deploy from template; one click deploy; start from a template; implantar template; clonar template; conectar git

A focused page, outside the console shell, where the user turns a template into a running project. They chose a template in the Creation Center and now need to see what it clones, connect a Git provider if they have none, name the repository it creates, fill the settings the template requires and deploy. The same column then shows the build and the outcome, so the user never leaves the page.

## When to use

- The user picked a template, a Git import or an upload from `platform/create/create-hub`, and the next step is to deploy it.
- The flow creates a repository from a source in the user's Git account and deploys from it on every push.
- The template needs a few settings (tokens, a domain) before its first build can run.

## When not to use

- Choosing what to start from: use `platform/create/create-hub`.
- A first-level resource created from a form with no source code: use `platform/create/single-page-create`.
- A source that needs several steps (where it runs, how it builds): use `platform/create/source-wizard`.
- Provisioning a resource and binding it to another: use `platform/create/provision-wizard`.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

The creation header from `headers/creation-header`: a small outlined back `IconButton` to the Creation Center, the `Brand` linking home, a `Breadcrumb` whose last crumb is the template and is current, and the account `Avatar` alone on the right. No sidebar, no search.

### B. Template and Git step — `Card`, `EmptyState`, `Button`, `Link` (required)

Above the step, a preview card names the template, its one-sentence description and the repository and path it clones from; it stays on screen for the whole flow. Without a Git provider the step is a `Card` holding a medium `EmptyState` on a dashed surface: the provider glyph, the title, one sentence on what happens to the clone, then Continue with GitHub as the secondary large `Button`, Continue without Git as a transparent `Button` and Manage connected providers as a `Link`. Once a provider is connected the same `Card` becomes the Deploy your project form: the scope and the repository name side by side, a privacy switch on the name, then the template settings stacked, and a full-width primary Deploy in the footer that stays disabled until every required setting is filled.

### C. Browse templates — `Button` (optional)

An outlined medium `Button` under the step that returns to the template list. It is the way back to choose another template; the header's back control leaves the flow.

## Do

- Keep the template preview card at the top of the column through every phase, so the user always sees what is being deployed.
- Ask for Git first; show the form only once a provider is connected.
- Disable Deploy until the repository name and every required template setting have a value.
- Hand the same column to `platform/create/deployment-flow` on Deploy, then to `platform/create/deploy-success`.
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
- **Commit:** "Deploy", the same verb on the button and in the run that follows.
- Follow `skills/webkit-microcopy`: sentence case, no em dash in labels or `aria-label`s, no parentheses in labels.

## Accessibility

- One `main` landmark under the header; the step title is an `h2` and the settings group an `h3`.
- The back `IconButton`, the brand link and the account button each have an `aria-label`.
- The repository name has a visible `Label` tied to its input; the privacy switch is labelled Public repository and announces its on or off state.
- Settings use `Field` labels and descriptions, so each input announces its name and constraint.
- A disabled Deploy is explained by the required markers on the fields, not by the button alone.
- The page enter animation stops under reduced motion.

## States

- ConnectGit: no Git provider yet; the template preview over the Connect a Git provider card and Browse templates.
- Form: GitHub connected; scope and repository name side by side, public by default, over the template settings, with Deploy disabled until the access token is filled.

## Related

- `platform/create/create-hub` — where the user picks the template.
- `platform/create/deployment-flow` — the build card the column shows after Deploy.
- `platform/create/deploy-success` — the outcome the column ends on.
- `headers/creation-header` — the header this page uses.
- `platform/states/project-intake` — the upload path that reaches this page with files instead of a template.

## Steps

- connect-git
- form

## Variants

- `ConnectGit` — primary (the code below)
- `Form` — GitHub connected: the gab-lisboa scope and the nuxt-ecommerce repository name, public by default, over the three store settings of the Nuxt E-commerce template; Deploy waits for the access token.

Each variant is the same screen in another state: `get_pattern("platform/create/deploy-template", { variant })`, or the file under `blocks/platform/create/deploy-template/variants/`.

## Code (`ConnectGit`)

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'

  const breadcrumb = [
    { label: 'Start from a template' },
    { label: 'Nuxt E-commerce', current: true }
  ]
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Creation Center"
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

    <main
      class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto"
    >
      <div
        class="layout-column-focused relative flex min-h-full flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-xxl)"
      >
        <div
          class="flex w-full items-start gap-(--spacing-md) overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) max-w-none! motion-reduce:transition-none! motion-reduce:transform-none!"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
          >
            <i
              class="ai-cor ai-nuxt text-body-lg leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>

          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
            <div class="flex w-full min-w-0 flex-col overflow-hidden">
              <span class="flex items-center gap-(--spacing-xs)">
                <span class="truncate text-heading-xxs text-(--text-default)">Nuxt E-commerce</span>
              </span>
              <span class="text-body-xs text-(--text-muted)">
                Launch a Nuxt e-commerce or content app in a few steps.
              </span>
            </div>

            <div class="flex w-full flex-col gap-(--spacing-xxs)">
              <span class="truncate text-body-xxs text-(--text-muted)">Cloning from GitHub</span>
              <div class="flex items-center gap-(--spacing-md)">
                <span
                  class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-default)"
                >
                  <i
                    class="ai ai-github text-[length:inherit] leading-none"
                    aria-hidden="true"
                  />
                  acme
                </span>
                <span
                  class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)"
                >
                  <i
                    class="pi pi-folder text-[length:inherit] leading-none"
                    aria-hidden="true"
                  />
                  templates/nuxt-ecommerce
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          data-phase="connect"
          class="flex w-full flex-col items-center gap-(--spacing-xl) data-[phase=success]:my-auto motion-reduce:transition-none! motion-reduce:transform-none!"
        >
          <Card class="w-full">
            <template #content>
              <div
                class="flex rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
              >
                <EmptyState
                  size="medium"
                  title="Connect a Git provider"
                  description="Nuxt E-commerce is cloned into a repository in your account, then deployed from it on every push."
                  class="w-full"
                >
                  <template #icon>
                    <span class="relative flex size-10 items-center justify-center">
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                      />
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                      />
                      <span
                        class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                      >
                        <i
                          class="ai ai-github text-body-md leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Continue with GitHub"
                      icon="ai ai-github"
                      kind="secondary"
                      size="large"
                    />
                    <Button
                      label="Continue without Git"
                      kind="transparent"
                      size="large"
                    />
                    <Link
                      label="Manage connected providers"
                      href="#"
                      size="large"
                    />
                  </template>
                </EmptyState>
              </div>
            </template>
          </Card>

          <Button
            label="Browse templates"
            kind="outlined"
            size="medium"
          />
        </div>
      </div>
    </main>
  </div>
</template>
```
