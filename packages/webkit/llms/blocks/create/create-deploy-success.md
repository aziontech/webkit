# CreateDeploySuccess (`create/create-deploy-success`)

> The outcome screen a create flow ends on, in the terminal column of the wizard page: a heading with its lead and, for a Git source, the scope as a Tag; the deployment card with a preview tile, the service name with a Live Tag and its creation time, Visit site, the domain with Add custom domain, and the repository with its branch; the Resources list that tags each row Created or Bound; Next steps as `IntegrationCard`s that open the docs or carry on in the console; Get started with the CLI or GitHub Actions for a resource made from the CLI; and the Manage service button. Any create flow can end on it, with its own title and, when there is no Git source, no scope. Built from `Subheader`, `Card`, `IntegrationCard`, `Tag`, `Button`, `Link`, `Tooltip`, `Item`, `ToggleGroup` and `CodeBlock`.

- Surface: app
- Source: `blocks/create/create-deploy-success/create-deploy-success.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-deploy-success")`
- Components: [Button](../../components/button.md), [Card](../../components/card.md), [CodeBlock](../../components/code-block.md), [IntegrationCard](../../components/integration-card.md), [Item](../../components/item.md), [Link](../../components/link.md), [Subheader](../../components/subheader.md), [Tag](../../components/tag.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-ui-states`, `webkit-microcopy`

## Asked as

deploy success; deployment successful; deployed; success page; deployment complete; next steps after deploy; wizard finish; deploy concluído; sucesso do deploy; aplicação publicada

The screen a create flow ends on. The user has just watched a deploy finish and needs three answers before leaving: is it live and where, what exactly was created or bound along the way, and what to do next. The page answers them in that order in the terminal column of the wizard, then offers one way out to manage the resource.

## When to use

- A create flow (a template deploy, an import from Git, a source or provision wizard) has finished and the resource is serving, or was created for the first time.
- The flow created or bound more than one resource and the user should see each one.
- A resource was made from the CLI and nothing serves it yet: the CliCreated state shows how to deploy it.

## When not to use

- The run is still going or has failed: keep the create-flow card of `detail/detail-deployment-logs` (InCreateFlow) on screen.
- A resource created from a form that does not deploy: end on the resource's page with a success toast that names it, as `skills/webkit-create-surface` describes; there is no outcome screen.
- An item added inside a resource from a drawer: use `create/create-drawer` and close it on save.
- The onboarding steps for a CLI resource on its Overview tab: use `detail/detail-get-started`.

## Building blocks

### A. Outcome heading — `Tag` (required)

A large `h1` stating the outcome and one muted lead sentence under it. For a Git source the lead ends with the scope as a secondary `Tag` with the provider glyph; without a Git source there is no scope tag. The heading enters with the content animation and respects reduced motion.

### B. Deployment card — `Card`, `Tag`, `Button`, `Link`, `Tooltip` (required)

The live service: a decorative preview tile (hidden from assistive technology; Visit site is the link), the service name as an `h2` with a small success `Tag` reading Live, and its creation time. An outlined medium `Button` Visit site opens the domain in a new tab. Under it, one row for the domain (a small `Link` with `target="_blank"`) with Add custom domain beside it (a small `Button variant="link"` with `href`), and one row for the repository (a small `Link`) with its branch. Each external `Link` carries a `Tooltip` naming where it goes and its external-link glyph. Never hand-roll the anchors. Leave the card out when nothing serves the resource yet.

### C. Resources list — `Card`, `Item`, `Tag` (required)

A small heading, "Resources", over `Card :padded="false"` holding an `Item` list, one small row per resource: kind glyph, name, its ID or contents as the description, and a small `Tag` reading Created or Bound. Bound marks a resource that already existed and was attached, so the user can tell new things from reused ones.

### D. Next steps — `IntegrationCard` (required)

`IntegrationCard` tiles in a row from the small breakpoint, each with a glyph (`logo`), a title and one sentence. A step with `href` is a link stretched over the tile; a step that acts in place (Deploy this resource) has no `href`, and its title is a button that emits `select`. Mark at most one with a primary Recommended badge (`badges`). Docs steps open in the same tab, so no new-tab notice is needed.

### E. Get started — `Subheader`, `ToggleGroup`, `CodeBlock`, `Card` (optional)

Only for a resource nothing serves yet (`getStarted` set to its name): a `Subheader` with a link to the CLI docs and a large `ToggleGroup` between the CLI and GitHub Actions paths, then three numbered step `Card`s, each with its commands in a `CodeBlock` without line numbers. The Link your project command names the resource.

### F. Manage — `Button` (required)

One full-width secondary large `Button`, "Manage service", at the end of the column that opens the resource. It is the only exit; do not add a second.

## Data

The block takes what the flow made through props and emits its actions; it fetches nothing. `DeploySuccessProps`, `DeploySuccessDeployment`, `DeploySuccessResource` and `DeploySuccessNextStep` are exported from `create-deploy-success.vue`, and `sample.ts` holds the sample deployment, resources and next steps the block renders when a data prop is left out.

| Prop          | Type                              | What it does                                                                                      |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| `title`       | `string`                          | The outcome heading, "Resource deployed" by default.                                              |
| `description` | `string`                          | The lead sentence; "Source:" and the scope tag follow it when the deployment has a Git `source`.  |
| `deployment`  | `DeploySuccessDeployment \| null` | The live service of the deployment card. `null` leaves the card out when nothing serves it.       |
| `resources`   | `DeploySuccessResource[]`         | One row per resource the flow created or bound.                                                   |
| `nextSteps`   | `DeploySuccessNextStep[]`         | The next-step tiles; a step without `href` is a button that emits `next-step`.                    |
| `getStarted`  | `string`                          | The resource name the Get started commands link; set it to show the CLI and GitHub Actions paths. |

| Event       | Payload         | When                                           |
| ----------- | --------------- | ---------------------------------------------- |
| `next-step` | `(event, step)` | A next-step tile without `href` was activated. |
| `manage`    | `(event)`       | Manage service.                                |

To go live, render the block from the page the create flow ends on and pass what the flow returned:

```vue
<script setup lang="ts">
  import CreateDeploySuccess from './create-deploy-success.vue'

  const { deployment, resources, nextSteps } = useCreateFlowResult()
</script>

<template>
  <CreateDeploySuccess
    :deployment="deployment"
    :resources="resources"
    :next-steps="nextSteps"
    @manage="openService"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Lead with the outcome and the live address; the user came to see it work.
- Tag every resource Created or Bound so the list doubles as a receipt of what the flow touched.
- Open the domain and the repository in a new tab with `Link target="_blank"`, and a `Tooltip` saying so.
- Drop the scope tag and the repository row when the flow had no Git source.
- In CliCreated, replace the deployment card with next steps that deploy the resource, and add the Get started paths for the CLI and GitHub Actions.

## Don't

- Don't celebrate: no confetti, no exclamation, no emoji. State the fact.
- Don't put more than one Recommended tag among the next steps.
- Don't add a Deploy again or Create another action; the user starts a new flow from the Creation Center.
- Don't leave the screen without a way into the resource; Manage is required.
- Don't repeat the resource list inside the deployment card.

## Copy

- **Heading:** the object and the past-tense result in sentence case, e.g. "Resource deployed", or "Resource created" when nothing serves it.
- **Lead:** one sentence with a period, e.g. "You deployed a new resource." followed by "Source:" and the source tag. Never a dangling fragment after the period.
- **Status tag:** one word, e.g. "Live"; resource tags "Created" or "Bound".
- **Links:** verb first, e.g. "Visit site", "Add custom domain"; tooltips name the target, e.g. "Open acme/web-app in a new tab".
- **Next steps:** title verb first in two or three words, e.g. "Customize domain", "View analytics"; description one sentence with a period.
- **Exit:** "Manage service", the verb and its object.
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no ampersand, no "please".

## Accessibility

- The heading is the page's only `h1`; the service name and the section titles are `h2`.
- The preview tile is decorative (`aria-hidden`); Visit site names the address.
- Links that open a new tab say so in their `Tooltip`, not only with the external-link glyph.
- Glyphs in rows and cards are decorative and carry `aria-hidden="true"`; the Created or Bound tag gives the state in words.
- A next-step card is one focusable link or button with a visible focus ring; its title and description are its name.
- Focus order follows reading order: heading, deployment card, resources, next steps, Manage.

## States

- Default: a deployed service from a Git source (`deployment` with a `source`), with the scope, the deployment card, four `resources` and three `nextSteps`.
- CliCreated: a resource made from the CLI that nothing serves yet; `:deployment="null"` leaves out the deployment card, one resource row, next steps to deploy it here or on a new service, and `get-started` shows the Get started paths.

## Related

- `detail/detail-deployment-logs` — the run this screen follows (InCreateFlow).
- `create/create-deploy-template` — a flow that ends here.
- `create/create-wizard` — its CreateAndDeploy variant ends here with its own title.
- `detail/detail-get-started` — the source of the CLI and GitHub Actions steps the CliCreated state embeds; CliCreated copies its section verbatim, so change the command copy there first and copy it here.
- `detail/detail-resource` — where Manage leads.

## Variants

- `Default` — primary (the code below)
- `CliCreated` — A resource made from the CLI that nothing serves yet: no deployment card, the resource as the only row, next steps that deploy it here (Recommended) or on a new service, and Get started with the CLI and GitHub Actions paths.

Each variant is the same screen in another state: `get_block("create/create-deploy-success", { variant })`, or the file under `blocks/create/create-deploy-success/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import IntegrationCard, { type IntegrationCardBadge } from '@aziontech/webkit/integration-card'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import ConnectPaths from './parts/connect-paths.vue'
  import DeploymentCard from './parts/deployment-card.vue'
  import { sampleDeployment, sampleNextSteps, sampleResources } from './sample'
  import type {
    DeploySuccessDeployment,
    DeploySuccessNextStep,
    DeploySuccessResource
  } from './types'

  export type {
    DeploySuccessDeployment,
    DeploySuccessNextStep,
    DeploySuccessResource,
    DeploySuccessResourceState,
    DeploySuccessSource
  } from './types'

  export interface DeploySuccessProps {
    /** The outcome heading. */
    title?: string
    /** The lead sentence; the scope tag follows it when the deployment has a Git source. */
    description?: string
    /** The live service; null leaves the card out when nothing serves the resource. Left out, the sample renders. */
    deployment?: DeploySuccessDeployment | null
    /** What the flow created or bound. Left out, the sample renders. */
    resources?: DeploySuccessResource[]
    /** The next-step tiles. Left out, the sample renders. */
    nextSteps?: DeploySuccessNextStep[]
    /** Resource name the Get started commands link; empty leaves the Get started section out. */
    getStarted?: string
  }

  const props = withDefaults(defineProps<DeploySuccessProps>(), {
    title: 'Resource deployed',
    description: 'You deployed a new resource.',
    deployment: undefined,
    resources: undefined,
    nextSteps: undefined,
    getStarted: ''
  })

  const emit = defineEmits<{
    /** A next-step tile without href was activated. */
    'next-step': [event: MouseEvent, step: DeploySuccessNextStep]
    /** Manage service was pressed. */
    manage: [event: MouseEvent]
  }>()

  const recommendedBadge: IntegrationCardBadge[] = [{ label: 'Recommended', variant: 'primary' }]

  const currentDeployment = computed(() =>
    props.deployment === undefined ? sampleDeployment : props.deployment
  )
  const source = computed(() => currentDeployment.value?.source)
  const lead = computed(() => (source.value ? `${props.description} Source:` : props.description))
  const currentResources = computed(() => props.resources ?? sampleResources)
  const currentNextSteps = computed(() => props.nextSteps ?? sampleNextSteps)
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <div class="flex min-h-full flex-1 flex-col pb-(--layout-section-gap)">
      <div
        class="layout-column-form layout-boundary-inline flex min-w-0 flex-1 flex-col pt-(--layout-section-gap)"
      >
        <div class="layout-column-content my-auto flex flex-col gap-(--spacing-xl)">
          <header
            class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-2xs)"
          >
            <h1 class="text-balance text-heading-lg text-(--text-default)">{{ title }}</h1>
            <p
              class="flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)"
            >
              {{ lead }}
              <Tag
                v-if="source"
                :label="source.scope"
                severity="neutral"
                :icon="source.icon"
              />
            </p>
          </header>

          <div
            class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-lg) [--content-enter-delay:var(--transition-duration-fast-01)]"
          >
            <DeploymentCard
              v-if="currentDeployment"
              :deployment="currentDeployment"
            />

            <section class="flex flex-col gap-(--spacing-sm)">
              <h2 class="text-label-md text-(--text-default)">Resources</h2>
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <Item
                      v-for="resource in currentResources"
                      :key="resource.key"
                      size="small"
                    >
                      <Item.Media>
                        <span
                          class="flex size-8 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface)"
                        >
                          <i
                            :class="resource.icon"
                            class="text-body-sm leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </Item.Media>
                      <Item.Content>
                        <Item.Title>{{ resource.name }}</Item.Title>
                        <Item.Description>
                          {{ resource.kind }} · {{ resource.reference }}
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions>
                        <Tag
                          :label="resource.state === 'bound' ? 'Bound' : 'Created'"
                          :severity="resource.state === 'bound' ? 'info' : 'success'"
                          size="small"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="flex flex-col gap-(--spacing-sm)">
              <h2 class="text-label-md text-(--text-default)">Next steps</h2>
              <div class="grid grid-cols-1 gap-(--spacing-sm) sm:grid-cols-3">
                <IntegrationCard
                  v-for="step in currentNextSteps"
                  :key="step.title"
                  :title="step.title"
                  :logo="step.icon"
                  :description="step.description"
                  :href="step.href ?? ''"
                  :badges="step.recommended ? recommendedBadge : []"
                  @select="(event: MouseEvent) => emit('next-step', event, step)"
                />
              </div>
            </section>

            <ConnectPaths
              v-if="getStarted"
              :get-started="getStarted"
            />

            <Button
              class="w-full"
              label="Manage service"
              variant="secondary"
              size="large"
              @click="(event: MouseEvent) => emit('manage', event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type {
  DeploySuccessDeployment,
  DeploySuccessNextStep,
  DeploySuccessResource
} from './create-deploy-success.vue'

export const sampleDeployment: DeploySuccessDeployment = {
  name: 'web-app',
  created: 'Created just now',
  domain: 'web-app-k3x9q2.example.com',
  url: 'https://web-app-k3x9q2.example.com',
  addDomainHref: '/services/1482736015?name=web-app&tab=settings',
  source: {
    scope: 'acme',
    icon: 'az az-github',
    repository: 'acme/web-app',
    href: 'https://github.com/acme/web-app',
    branch: 'main'
  }
}

export const sampleResources: DeploySuccessResource[] = [
  {
    key: 'service',
    kind: 'Service',
    icon: 'az az-server',
    name: 'web-app',
    state: 'created',
    reference: '1482736015'
  },
  {
    key: 'resource',
    kind: 'Resource',
    icon: 'az az-box',
    name: 'web-app',
    state: 'created',
    reference: '1739204418'
  },
  {
    key: 'integration',
    kind: 'Integration',
    icon: 'az az-link',
    name: 'web-app-storage',
    state: 'created',
    reference: '1215583907'
  },
  {
    key: 'storage',
    kind: 'Storage',
    icon: 'az az-inbox',
    name: 'web-app-assets',
    state: 'created',
    reference: '24 files · 1.2 MB'
  }
]

export const sampleNextSteps: DeploySuccessNextStep[] = [
  {
    icon: 'az az-globe',
    title: 'Customize domain',
    description:
      'Associate a custom domain and subdomains with this service to handle user access.',
    href: 'https://example.com/docs'
  },
  {
    icon: 'az az-sitemap',
    title: 'Point traffic',
    description:
      'Redirect the traffic of a domain to the platform and take advantage of the distributed network.',
    href: 'https://example.com/docs'
  },
  {
    icon: 'az az-chart-line',
    title: 'View analytics',
    description: 'Gain powerful insights into your performance, availability, and security.',
    href: 'https://example.com/docs'
  }
]

export const sampleCliResources: DeploySuccessResource[] = [
  {
    key: 'resource',
    kind: 'Resource',
    icon: 'az az-box',
    name: 'analytics-app',
    state: 'created',
    reference: '1650382274'
  }
]

export const sampleCliNextSteps: DeploySuccessNextStep[] = [
  {
    icon: 'az az-cloud-upload',
    title: 'Deploy this resource',
    description:
      'Provision a service for it and deploy, without leaving this flow. The platform names the domain, and you can change it after.',
    recommended: true
  },
  {
    icon: 'az az-server',
    title: 'Deploy using a new service',
    description: 'Name the service, put a policy in front of it, and compose the release yourself.',
    href: '/services/new?resource=analytics-app'
  }
]
```

## `lib/connect-paths.ts`

```ts
export const PATHS = [
  { label: 'CLI', value: 'cli' },
  { label: 'GitHub Actions', value: 'actions' }
]

export const cliSteps = (name: string) => [
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
  --name ${name}`
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

export const ACTIONS_STEPS = [
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
```

## `parts/connect-paths.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Link from '@aziontech/webkit/link'
  import Subheader from '@aziontech/webkit/subheader'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref } from 'vue'

  import { ACTIONS_STEPS, cliSteps, PATHS } from '../lib/connect-paths'

  export interface ConnectPathsProps {
    /** The project name the CLI steps use. */
    getStarted: string
  }

  const props = defineProps<ConnectPathsProps>()

  const path = ref('cli')
  const steps = computed(() =>
    path.value === 'actions' ? ACTIONS_STEPS : cliSteps(props.getStarted)
  )
</script>

<template>
  <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
    <Subheader title="Get started">
      <template #description>
        Two ways to build and deploy this resource. Select one and follow the steps, or read the
        <Link
          href="https://example.com/docs/cli"
          target="_blank"
          inline
          >CLI docs</Link
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
    </Subheader>

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
            <template #default>
              <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <span
                    class="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--bg-surface-overlay) text-label-sm text-(--text-default)"
                  >
                    {{ index + 1 }}
                  </span>
                  <h3 class="min-w-0 text-heading-xs text-(--text-default)">
                    {{ step.title }}
                  </h3>
                </div>
                <p class="text-pretty text-body-sm text-(--text-muted)">
                  {{ step.description }}
                </p>
                <div class="mt-(--spacing-2xs) min-w-0">
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

## `parts/deployment-card.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Link from '@aziontech/webkit/link'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import type { DeploySuccessDeployment } from '../types'

  export interface DeploymentCardProps {
    /** The deployment that went live. */
    deployment: DeploySuccessDeployment
  }

  const props = defineProps<DeploymentCardProps>()

  const source = computed(() => props.deployment.source)
</script>

<template>
  <Card>
    <template #default>
      <div class="flex flex-col gap-(--spacing-md) sm:flex-row">
        <div
          aria-hidden="true"
          class="relative flex aspect-16/10 w-full shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-canvas) sm:w-56"
        >
          <span
            class="relative flex size-10 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface)"
          >
            <i
              class="az az-globe text-body-md leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
          <div class="flex flex-wrap items-start justify-between gap-(--spacing-sm)">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <h2 class="min-w-0 truncate text-heading-xs text-(--text-default)">
                  {{ deployment.name }}
                </h2>
                <Tag
                  label="Live"
                  severity="success"
                  size="small"
                />
              </div>
              <span class="text-body-sm text-(--text-muted)">{{ deployment.created }}</span>
            </div>

            <Button
              label="Visit site"
              variant="outline"
              size="medium"
              icon="az az-external-link"
              icon-position="trailing"
              :href="deployment.url"
              target="_blank"
            />
          </div>

          <ul class="flex flex-col gap-(--spacing-xs)">
            <li class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)">
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="az az-globe shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <div class="min-w-0">
                  <Tooltip
                    :content="`Open ${deployment.domain} in a new tab`"
                    class="w-full"
                  >
                    <Link
                      :label="deployment.domain"
                      :href="deployment.url"
                      target="_blank"
                      size="small"
                    />
                  </Tooltip>
                </div>
              </span>
              <Button
                label="Add custom domain"
                variant="link"
                size="small"
                icon="az az-circle-plus"
                :href="deployment.addDomainHref"
              />
            </li>
            <li
              v-if="source"
              class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)"
            >
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  :class="source.icon"
                  class="shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <div class="min-w-0">
                  <Tooltip
                    :content="`Open ${source.repository} in a new tab`"
                    class="w-full"
                  >
                    <Link
                      :label="source.repository"
                      :href="source.href"
                      target="_blank"
                      size="small"
                    />
                  </Tooltip>
                </div>
              </span>
              <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                <i
                  class="az az-git-branch shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-body-sm text-(--text-default)">{{ source.branch }}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Card>
</template>
```

## `types.ts`

```ts
/** Whether the flow made the resource or attached one that already existed. */
export type DeploySuccessResourceState = 'created' | 'bound'

/** The Git source the service deploys from. */
export interface DeploySuccessSource {
  /** The account or organization, shown as the scope tag in the lead. */
  scope: string
  /** Provider glyph class. */
  icon: string
  /** The repository as owner and name. */
  repository: string
  /** Where the repository opens, in a new tab. */
  href: string
  /** The production branch. */
  branch: string
}

/** The live service the deployment card shows. */
export interface DeploySuccessDeployment {
  /** Service name, the card heading. */
  name: string
  /** When it was created, already formatted, such as Created just now. */
  created: string
  /** The domain it answers on, without the scheme. */
  domain: string
  /** The full address Visit site and the domain link open. */
  url: string
  /** Where Add custom domain leads. */
  addDomainHref: string
  /** The Git source; left out, the lead drops the scope tag and the repository row. */
  source?: DeploySuccessSource
}

/** One resource the flow created or bound. */
export interface DeploySuccessResource {
  /** Stable key. */
  key: string
  /** Kind, such as Service or Storage. */
  kind: string
  /** Kind glyph class. */
  icon: string
  /** Display name. */
  name: string
  /** Created or bound. */
  state: DeploySuccessResourceState
  /** Its ID or its contents, shown after the kind. */
  reference: string
}

/** One next-step tile. */
export interface DeploySuccessNextStep {
  /** Glyph class. */
  icon: string
  /** Title, verb first. */
  title: string
  /** One sentence. */
  description: string
  /** Where the tile leads; left out, the tile is a button that emits next-step. */
  href?: string
  /** Shows the Recommended badge. */
  recommended?: boolean
}
```
