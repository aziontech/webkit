# GetStarted (`platform/detail/get-started`)

> The onboarding block for a resource made from the CLI: a section heading with a toggle between the CLI and GitHub Actions paths, then three numbered step cards, each with a code block for its commands. It sits under the summary on a resource Overview tab and at the end of a create wizard, on the deploy success screen. Built from `SectionHeader`, `ToggleGroup`, `Card` and `CodeBlock`.

- Surface: product
- Source: `blocks/platform/detail/get-started/get-started.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/detail/get-started")`
- Components: [Card](../../../components/card.md), [CodeBlock](../../../components/code-block.md), [SectionHeader](../../../components/section-header.md), [ToggleGroup](../../../components/toggle-group.md)
- Skills: `webkit-microcopy`

## Asked as

get started; cli setup steps; github actions setup; onboarding steps; deploy with cli; numbered steps with code; primeiros passos; como começar; passos de configuração

The first thing a user reads about a resource they created from the CLI and have not deployed yet. They need the exact commands to build and ship it, in order, for the path they work with: the CLI on their own machine or a GitHub Actions workflow. The block names the two paths, lets them pick one and walks them through three numbered steps, each with commands they can copy.

## When to use

- Under the summary card on the Overview tab of a resource made from the CLI that has no deployment yet.
- At the end of a create wizard, on the deploy success screen, when the next move happens in a terminal.
- Any onboarding that comes down to three ordered steps with commands per step.

## When not to use

- A resource that already serves traffic: show the summary and its deployments in `platform/detail/details-page` instead.
- A list of gates to pass before going to production (domain, policy, error pages): use `platform/detail/production-checklist`.
- A module the account has never used: use `platform/states/first-use`, which explains the module before any resource exists.
- Connecting a repository or editing build commands: that is the Build tab of `platform/detail/details-page`.

## Building blocks

### A. Section heading — `SectionHeader` (required)

`SectionHeader` titled "Get started" with a one-sentence description that ends on a link to the CLI docs. It is a section inside the page, never the page title.

### B. Path switch — `ToggleGroup` (required)

A large `ToggleGroup` in the heading's actions slot, `aria-label="Deploy with"`, with two options: CLI and GitHub Actions. Switching swaps all three steps at once; the heading and the layout stay put.

### C. Step cards — `Card` (required)

Three `Card`s with `:padded="false"`, one per step, each led by a round step number, an `h3` title and one sentence of context. They sit in one column and go to three columns from the `@4xl` container width (1024 px, where each step card fits its commands), joined by a dashed connector that is hidden from assistive technology.

### D. Commands — `CodeBlock` (required)

One `CodeBlock` per step with `:show-line-numbers="false"` and a `copy-aria-label` that names the step. A step with alternatives (npm, yarn, pnpm, brew) carries them as tabs of the same block; a workflow file shows its `fileName`.

## Do

- Keep exactly three steps per path, in the order the user runs them: install or authenticate, connect, deploy.
- Make every command copyable and runnable as shown, with the resource name already filled in.
- Keep the two paths parallel: same number of steps, same card shape, same last step that ends in a live deployment.
- Point to the docs from the description, not from a separate button.

## Don't

- Don't add a primary button to the block; the action happens in the terminal or the repository.
- Don't put secrets or real tokens in a command; refer to the repository secret by name.
- Don't nest cards or put more than one `CodeBlock` in a step.
- Don't let a long command push the page sideways; the code block scrolls inside its card.

## Copy

- **Section title:** "Get started".
- **Description:** one sentence that names the choice, then the docs link, e.g. "Two ways to build and deploy this resource. Select one and follow the steps, or read the CLI docs."
- **Path options:** the tool names as their makers write them, e.g. "CLI", "GitHub Actions".
- **Step titles:** verb first, sentence case, no period, e.g. "Install the CLI", "Link your project", "Push to deploy".
- **Step descriptions:** one or two sentences that say what the step does and why, e.g. "Authenticate, then link the local project to this resource so every deploy lands on it."
- **Copy button label:** names the step, e.g. "Copy the commands for Install the CLI".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The section title is a heading below the page `h1`; each step title is an `h3`.
- The toggle group carries `aria-label="Deploy with"`, so the switch reads as a choice of path.
- The step number is visible text, so the order is announced; the dashed connector is `aria-hidden`.
- Each copy button names its step, so several copy buttons on the page stay distinguishable.
- The docs link opens in a new tab with `rel="noopener noreferrer"` and keeps a visible focus ring.

## States

- Cli: the CLI path, install the CLI, link the project, then deploy and sync.
- Ci: the GitHub Actions path, store a personal token as a repository secret, add the deploy workflow, then push to the production branch.

## Related

- `platform/detail/details-page` — the resource Overview tab this block sits on, under the summary card.
- `platform/create/deploy-success` — the end of a create flow that can show these steps.
- `platform/detail/production-checklist` — the next set of tasks once the resource is live.
- `CodeBlock` — tabs, file name and copy for each step's commands.

## Variants

- `Cli` — primary (the code below)
- `Ci` — The GitHub Actions path: store a personal token as a repository secret, add the deploy workflow, then push to the production branch.

Each variant is the same screen in another state: `get_pattern("platform/detail/get-started", { variant })`, or the file under `blocks/platform/detail/get-started/variants/`.

## Code (`Cli`)

```vue
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import SectionHeader from '@aziontech/webkit/section-header'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref } from 'vue'

  const PATHS = [
    { label: 'CLI', value: 'cli' },
    { label: 'GitHub Actions', value: 'actions' }
  ]

  const CLI_STEPS = [
    {
      title: 'Install the CLI',
      description:
        'Install it globally. It builds with your framework preset and ships the build in one step.',
      tabs: [
        {
          label: 'npm',
          value: 'npm',
          language: 'bash',
          code: 'npm install -g platform-cli'
        },
        {
          label: 'yarn',
          value: 'yarn',
          language: 'bash',
          code: 'yarn global add platform-cli'
        },
        { label: 'pnpm', value: 'pnpm', language: 'bash', code: 'pnpm add -g platform-cli' },
        {
          label: 'brew',
          value: 'brew',
          language: 'bash',
          code: 'brew install platform-cli'
        }
      ]
    },
    {
      title: 'Link your project',
      description:
        'Authenticate, then link the local project to this resource so every deploy lands on it.',
      tabs: [
        {
          label: 'Link',
          value: 'link',
          language: 'bash',
          code: `platform login
platform link \\
  --name analytics-app`
        }
      ]
    },
    {
      title: 'Deploy and visit your site',
      description:
        'Build and ship. The CLI prints the domain when it finishes, and sync reconciles platform.json with what the console shows.',
      tabs: [
        {
          label: 'Deploy',
          value: 'deploy',
          language: 'bash',
          code: `platform deploy --auto --local
platform sync`
        }
      ]
    }
  ]

  const ACTIONS_STEPS = [
    {
      title: 'Store your personal token',
      description:
        'Create a personal token in Account settings and keep it as the repository secret the workflow authenticates with.',
      tabs: [
        {
          label: 'Secret',
          value: 'secret',
          language: 'bash',
          code: `gh secret set \\
  PLATFORM_TOKEN`
        }
      ]
    },
    {
      title: 'Add the deploy workflow',
      description:
        'One job that installs the CLI and deploys the build. Every push to the production branch runs it.',
      tabs: [
        {
          label: 'deploy.yml',
          value: 'workflow',
          fileName: '.github/workflows/deploy.yml',
          language: 'yaml',
          code: `on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g platform-cli
      - run: platform login --token \${{ secrets.PLATFORM_TOKEN }}
      - run: platform deploy --auto --local`
        }
      ]
    },
    {
      title: 'Push to deploy',
      description:
        'Every push to the production branch builds and ships. The deployment lands on the Overview tab as it runs.',
      tabs: [{ label: 'Push', value: 'push', language: 'bash', code: 'git push origin main' }]
    }
  ]

  const path = ref('cli')
  const steps = computed(() => (path.value === 'actions' ? ACTIONS_STEPS : CLI_STEPS))
</script>

<template>
  <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
    <SectionHeader title="Get started">
      <template #description>
        Two ways to build and deploy this resource. Select one and follow the steps, or read the
        <a
          href="https://example.com/docs/cli"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) underline hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
          >CLI docs</a
        >.
      </template>
      <template #actions>
        <ToggleGroup
          v-model="path"
          :options="PATHS"
          size="large"
          aria-label="Deploy with"
        />
      </template>
    </SectionHeader>

    <div class="grid min-w-0 gap-(--spacing-lg) @4xl:grid-cols-3">
      <div
        v-for="(step, index) in steps"
        :key="step.title"
        class="relative flex min-w-0"
      >
        <span
          v-if="index > 0"
          aria-hidden="true"
          class="absolute end-full top-9 hidden w-(--spacing-lg) border-t border-dashed border-(--border-default) @4xl:block"
        />
        <div class="flex min-w-0 flex-1">
          <Card
            :padded="false"
            class="w-full"
          >
            <template #content>
              <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <span
                    class="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--bg-surface-overlay) text-label-sm text-(--text-default)"
                  >
                    {{ index + 1 }}
                  </span>
                  <h3 class="min-w-0 text-heading-xs text-(--text-default)">{{ step.title }}</h3>
                </div>
                <p class="text-pretty text-body-sm text-(--text-muted)">{{ step.description }}</p>
                <div class="mt-(--spacing-xxs) min-w-0">
                  <CodeBlock
                    :tabs="step.tabs"
                    :show-line-numbers="false"
                    :copy-aria-label="`Copy the commands for ${step.title}`"
                    class="w-full"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
```
