import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CodeBlock from '@aziontech/webkit/code-block'
import Item from '@aziontech/webkit/item'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { blockScript, blockState, declare, getStarted } from './_summary-markup'

const DOCUMENTATION = 'https://www.azion.com/en/documentation/'

const LINK =
  'group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)'

const externalLink = (
  label,
  href
) => `<Tooltip text="Open ${label} in a new tab" class="min-w-0 shrink!">
  <a
    href="${href}"
    target="_blank"
    rel="noopener noreferrer"
    data-link
    class="${LINK}"
  >
    <span class="truncate underline-offset-2 group-hover/link:underline">
      ${label}
    </span>
    <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
    <i class="pi pi-external-link shrink-0 text-body-xs leading-none" aria-hidden="true" />
  </a>
</Tooltip>`

const lead = ({ text, scope }) =>
  scope
    ? `<p class="flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)">
  ${text}
  into
  <Tag label="${scope}" severity="secondary" icon="ai ai-github" />
</p>`
    : `<p class="flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)">
  ${text}
</p>`

const domainCard = ({ title, domain, created, workloadId, repository, branch }) => `<CardBox>
  <template #content>
    <div class="flex flex-col gap-(--spacing-md) sm:flex-row">
      <a
        href="https://${domain}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit ${domain} in a new tab"
        class="relative flex aspect-16/10 w-full shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-canvas) sm:w-56 before:pointer-events-none before:absolute before:inset-0 before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) motion-reduce:before:transition-none"
      >
        <span class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)">
          <i class="pi pi-globe text-body-md leading-none text-(--text-default)" aria-hidden="true" />
        </span>
      </a>

      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
        <div class="flex flex-wrap items-start justify-between gap-(--spacing-sm)">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
              <h2 class="min-w-0 truncate text-heading-xs text-(--text-default)">
                ${title}
              </h2>
              <Tag label="Live" severity="success" size="small" />
            </div>
            <span class="text-body-sm text-(--text-muted)">Created ${created}</span>
          </div>

          <Button
            label="Visit site"
            kind="outlined"
            size="medium"
            icon="pi pi-external-link"
            icon-position="trailing"
            href="https://${domain}"
            target="_blank"
          />
        </div>

        <ul class="flex flex-col gap-(--spacing-xs)">
          <li class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i class="ai ai-domains shrink-0 text-(--text-muted)" aria-hidden="true" />
${indent(externalLink(domain, `https://${domain}`), 7)}
            </span>
            <a
              href="/workloads/${workloadId}?name=${title}&tab=settings"
              class="group/link inline-flex min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
            >
              <i class="pi pi-plus-circle shrink-0 text-(--text-muted)" aria-hidden="true" />
              <span class="truncate underline-offset-2 group-hover/link:underline">Add custom domain</span>
            </a>
          </li>
          <li class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i class="ai ai-github shrink-0 text-(--text-muted)" aria-hidden="true" />
${indent(externalLink(repository, `https://github.com/${repository}`), 7)}
            </span>
            <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
              <i class="ai ai-branch shrink-0 text-(--text-muted)" aria-hidden="true" />
              <span class="truncate text-body-sm text-(--text-default)">${branch}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </template>
</CardBox>`

const RESOURCES_SECTION = (title) => `<section class="flex flex-col gap-(--spacing-sm)">
  <h2 class="text-label-md text-(--text-default)">${title}</h2>
  <CardBox :padded="false">
    <template #content>
      <Item.List>
        <Item v-for="resource in resources" :key="resource.key" size="small">
          <Item.Media>
            <span class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)">
              <i :class="resource.icon" class="text-body-sm leading-none text-(--text-default)" aria-hidden="true" />
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
  </CardBox>
</section>`

const NEXT_STEPS_SECTION = `<section class="flex flex-col gap-(--spacing-sm)">
  <h2 class="text-label-md text-(--text-default)">Next steps</h2>
  <div class="grid grid-cols-1 gap-(--spacing-sm) sm:grid-cols-3">
    <CardBox v-for="step in nextSteps" :key="step.title" :padded="false">
      <template #content>
        <component
          :is="step.action ? 'button' : 'a'"
          :type="step.action ? 'button' : undefined"
          :href="step.href || undefined"
          :target="step.external ? '_blank' : undefined"
          :rel="step.external ? 'noopener noreferrer' : undefined"
          class="group/step relative flex h-full w-full cursor-pointer flex-col gap-(--spacing-sm) rounded-(--shape-card) border-0 bg-transparent p-(--spacing-md) text-left text-inherit no-underline before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) motion-reduce:before:transition-none"
        >
          <span class="relative flex items-center justify-between gap-(--spacing-xs)">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)">
              <i :class="step.icon" class="text-body-sm leading-none text-(--text-default)" aria-hidden="true" />
            </span>
            <i
              :class="step.external ? 'pi pi-external-link' : 'pi pi-chevron-right'"
              class="text-body-xs leading-none text-(--text-muted)"
              aria-hidden="true"
            />
          </span>
          <span class="relative flex flex-col gap-(--spacing-xxs)">
            <span class="flex flex-wrap items-center gap-(--spacing-xs)">
              <span class="text-label-md text-(--text-default)">{{ step.title }}</span>
              <Tag v-if="step.recommended" label="Recommended" severity="primary" size="small" />
            </span>
            <span class="text-pretty text-body-sm text-(--text-muted)">{{ step.description }}</span>
          </span>
        </component>
      </template>
    </CardBox>
  </div>
</section>`

const MANAGE = '<Button class="w-full" label="Manage" kind="secondary" size="large" />'

const page = ({
  title,
  leadText,
  scope,
  card,
  resourcesTitle,
  getStartedTemplate
}) => `<div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
  <div class="flex min-h-full flex-1 flex-col pb-(--layout-section-gap)">
    <div class="layout-column-form layout-boundary-inline flex min-w-0 flex-1 flex-col pt-(--layout-section-gap)">
      <div class="layout-column-content my-auto flex flex-col gap-(--spacing-xl)">
        <header class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-xxs)">
          <h1 class="text-balance text-heading-lg text-(--text-default)">${title}</h1>
${indent(lead({ text: leadText, scope }), 4)}
        </header>

        <div class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-lg) [--content-enter-delay:var(--transition-duration-fast-01)]">
${indent([card, RESOURCES_SECTION(resourcesTitle), NEXT_STEPS_SECTION, getStartedTemplate, MANAGE].filter(Boolean).join('\n\n'), 5)}
        </div>
      </div>
    </div>
  </div>
</div>`

const DEFAULT_NEXT_STEPS = [
  {
    icon: 'pi pi-globe',
    title: 'Customize domain',
    description: 'Associate a custom domain and subdomains to Azion to handle user access.',
    href: DOCUMENTATION,
    external: true
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Point traffic',
    description:
      'Redirect the traffic of a domain to Azion and take advantage of the distributed network.',
    href: DOCUMENTATION,
    external: true
  },
  {
    icon: 'pi pi-chart-line',
    title: 'View analytics',
    description: 'Gain powerful insights into your performance, availability, and security.',
    href: DOCUMENTATION,
    external: true
  }
]

const GIT_DEPLOYMENT = {
  domain: 'k3x9q2m7wp.azion.run',
  workloadId: '1482736015',
  name: 'my-storefront',
  repository: 'gab-az/my-storefront',
  branch: 'main'
}

const GIT_RESOURCES = [
  {
    key: 'workload',
    kind: 'Workload',
    icon: 'ai ai-workloads',
    name: 'my-storefront',
    reference: '1482736015'
  },
  {
    key: 'application',
    kind: 'Application',
    icon: 'ai ai-edge-application',
    name: 'my-storefront',
    state: 'created',
    reference: '1739204418'
  },
  {
    key: 'connector',
    kind: 'Connector',
    icon: 'ai ai-edge-connectors',
    name: 'my-storefront-storage',
    reference: '1215583907'
  },
  {
    key: 'storage',
    kind: 'Storage',
    icon: 'ai ai-edge-storage',
    name: 'my-storefront-assets',
    reference: '24 objects · 1.2 MB'
  }
]

const CLI_NAME = 'analytics-edge'

const CLI_RESOURCES = [
  {
    key: 'application',
    kind: 'Application',
    icon: 'ai ai-edge-application',
    name: CLI_NAME,
    state: 'created',
    reference: '1650382274'
  }
]

const DEPLOY_METHODS = [
  {
    icon: 'pi pi-cloud-upload',
    title: 'Deploy this application',
    description:
      'Provision a workload for it and deploy, without leaving this flow. Azion names the domain, and you can change it after.',
    action: true,
    recommended: true
  },
  {
    icon: 'ai ai-workloads',
    title: 'Deploy using a new workload',
    description:
      'Name the workload, put a firewall in front of it, and compose the release yourself.',
    href: `/workloads/new?application=${CLI_NAME}`
  }
]

const GIT_TEMPLATE = page({
  title: 'Application deployed',
  leadText: 'You deployed a new application.',
  scope: 'gab-az',
  card: domainCard({
    title: GIT_DEPLOYMENT.name,
    domain: GIT_DEPLOYMENT.domain,
    created: 'just now',
    workloadId: GIT_DEPLOYMENT.workloadId,
    repository: GIT_DEPLOYMENT.repository,
    branch: GIT_DEPLOYMENT.branch
  }),
  resourcesTitle: 'Resources created'
})

const GIT_BLOCK = {
  parts: ['Button', 'CardBox', 'Item', 'Tag', 'Tooltip'],
  script: [declare('resources', GIT_RESOURCES), '', declare('nextSteps', DEFAULT_NEXT_STEPS)],
  state: () => ({ resources: GIT_RESOURCES, nextSteps: DEFAULT_NEXT_STEPS })
}

const CLI_GET_STARTED = getStarted(CLI_NAME)

const CLI_TEMPLATE = page({
  title: 'Application created',
  leadText: 'The application layer is ready. Nothing serves it yet. Deploy it from Next steps.',
  resourcesTitle: 'Resources created',
  getStartedTemplate: CLI_GET_STARTED.template
})

const CLI_BLOCK = {
  parts: ['Button', 'CardBox', 'Item', 'Tag'],
  script: [declare('resources', CLI_RESOURCES), '', declare('nextSteps', DEPLOY_METHODS), ''],
  state: () => ({ resources: CLI_RESOURCES, nextSteps: DEPLOY_METHODS })
}

const components = {
  Button,
  CardBox,
  CodeBlock,
  Item,
  'Item.List': Item.List,
  'Item.Media': Item.Media,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  SegmentedButton,
  Tag,
  Tooltip
}

const story = (blocks, template, description) => ({
  render: () => ({
    components,
    setup: () => blockState(...blocks),
    template
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(blockScript(...blocks), template) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Creation/DeploySuccess',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The outcome screen a create flow ends on, in the terminal column of the wizard page: a heading with its lead and, for a Git source, the scope as a Tag; the deployment card with a preview tile, the workload name with a Live Tag and its creation time, Visit site, the domain with Add custom domain, and the repository with its branch; the Resources list that tags each row Created or Bound; three Next steps cards that open the docs or carry on in the console; Get started with the Azion CLI or GitHub Actions for an application made from the CLI; and the Manage button. Create Application, Create Workload (titled Workload deployed, with no scope) and Deploy Template at `/deploy` (titled Congratulations!) all render it. Built from `CardBox`, `Tag`, `Button`, `Tooltip`, `Item`, `SegmentedButton` and `CodeBlock`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  [GIT_BLOCK],
  GIT_TEMPLATE,
  'An application deployed from a Git repository: the scope Tag, the live deployment card on its generated Azion domain with the repository and branch, the four resources the flow created, and the default next steps that open the documentation.'
)

export const CliCreated = story(
  [CLI_BLOCK, CLI_GET_STARTED],
  CLI_TEMPLATE,
  'An application made from the CLI that nothing serves yet: no deployment card, the application as its only resource, next steps that deploy it here (Recommended) or on a new workload, and Get started with the Azion CLI and GitHub Actions paths.'
)
