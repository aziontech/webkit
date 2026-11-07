import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import EmptyState from '@aziontech/webkit/empty-state'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldText from '@aziontech/webkit/field-text'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'
import InputGroupAddon from '@aziontech/webkit/input-group-addon'
import InputGroupRoot from '@aziontech/webkit/input-group-root'
import Label from '@aziontech/webkit/label'
import Link from '@aziontech/webkit/link'
import Switch from '@aziontech/webkit/switch'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { declare } from './_summary-markup'

const BREADCRUMB = [{ label: 'Start from a Template' }, { label: 'Nuxt E-commerce', current: true }]

const SCOPES = [
  { label: 'gab-az', value: 'gab-az' },
  { label: 'aziontech', value: 'aziontech' },
  { label: 'azion-templates', value: 'azion-templates' }
]

const SETTINGS = [
  {
    name: 'shopifyAccessToken',
    label: 'Shopify Access Token',
    placeholder: 'Access Token',
    description: 'You can find this token in Credentials on Shopify Project Configurations.',
    required: true
  },
  {
    name: 'shopifyRevalidationSecret',
    label: 'Shopify revalidation secret',
    placeholder: 'Revalidation secret',
    description: 'You can find this secret in Credentials on Shopify Project Configurations.',
    required: false
  },
  {
    name: 'shopifyStoreDomain',
    label: 'Shopify Store Domain',
    placeholder: 'https://your-shopify-store-subdomain.myshopify.com',
    description: 'Your Shopify Store Domain',
    required: false
  }
]

const HEADER = `<GlobalHeader aria-label="Azion Console">
  <GlobalHeader.Left>
    <IconButton icon="pi pi-chevron-left" aria-label="Back to Creation Center" kind="outlined" size="small" />
    <GlobalHeader.Brand>
      <a
        href="/home"
        aria-label="Azion home"
        class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
      >
        <Brand kind="default" size="small" />
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
      <Avatar label="myemail@azion.com" size="medium" kind="square" />
    </button>
  </GlobalHeader.Right>
</GlobalHeader>`

const PREVIEW = `<div
  class="flex w-full items-start gap-(--spacing-md) overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) max-w-none! motion-reduce:transition-none! motion-reduce:transform-none!"
>
  <span
    class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
  >
    <i class="ai-cor ai-nuxt text-body-lg leading-none text-(--text-default)" aria-hidden="true" />
  </span>

  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
    <div class="flex w-full min-w-0 flex-col overflow-hidden">
      <span class="flex items-center gap-(--spacing-xs)">
        <span class="truncate text-heading-xxs text-(--text-default)">Nuxt E-commerce</span>
      </span>
      <span class="text-body-xs text-(--text-muted)">
        Launch a Nuxt e-commerce or content app on the edge.
      </span>
    </div>

    <div class="flex w-full flex-col gap-(--spacing-xxs)">
      <span class="truncate text-body-xxs text-(--text-muted)">Cloning from Github</span>
      <div class="flex items-center gap-(--spacing-md)">
        <span class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-default)">
          <i class="ai ai-github text-[length:inherit] leading-none" aria-hidden="true" />
          aziontech
        </span>
        <span class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)">
          <i class="pi pi-folder text-[length:inherit] leading-none" aria-hidden="true" />
          templates/nuxt-ecommerce
        </span>
      </div>
    </div>
  </div>
</div>`

const BROWSE = '<Button label="Browse Templates" kind="outlined" size="medium" />'

const CONNECT = `<CardBox class="w-full">
  <template #content>
    <EmptyState
      size="medium"
      title="Connect a Git provider"
      description="Azion clones Nuxt E-commerce into a repository in your account, then deploys from it on every push."
      class="rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
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
            <i class="ai ai-github text-body-md leading-none text-(--text-default)" aria-hidden="true" />
          </span>
        </span>
      </template>
      <template #actions>
        <Button label="Continue with GitHub" icon="ai ai-github" kind="secondary" size="large" />
        <Button label="Continue without Git" kind="text" size="large" />
        <Link label="Manage connected providers" href="#" size="large" />
      </template>
    </EmptyState>
  </template>
</CardBox>

${BROWSE}`

const FORM = `<CardBox class="w-full">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg)">
      <div class="flex flex-col gap-(--spacing-xxs)">
        <h2 class="text-heading-xs text-(--text-default)">Deploy your project</h2>
        <p class="text-body-sm text-pretty text-(--text-muted)">
          Azion deploys from this repository and ships every push automatically.
        </p>
      </div>

      <div class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2">
        <FieldSelect
          input-id="scope"
          v-model="scope"
          label="Scope"
          size="large"
          :options="scopes"
          placeholder="Select a scope"
        />

        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            :label="isPublic ? 'Public Repository Name' : 'Private Repository Name'"
            required
            for="repoName"
          />
          <InputGroupRoot size="large">
            <input
              id="repoName"
              v-model="repoName"
              placeholder="my-repository"
              class="w-full h-full bg-transparent border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled)"
            />
            <InputGroupAddon>
              <Tooltip text="Toggle repository visibility (public or private)">
                <Switch
                  v-model="isPublic"
                  kind="privacy"
                  :aria-label="
                    isPublic
                      ? 'Repository is public — toggle to make it private'
                      : 'Repository is private — toggle to make it public'
                  "
                />
              </Tooltip>
            </InputGroupAddon>
          </InputGroupRoot>
        </div>
      </div>

      <h3 class="text-heading-xxs text-(--text-default)">Template Settings</h3>
      <div class="flex flex-col gap-(--spacing-lg)">
        <FieldText
          v-for="field in settings"
          :key="field.name"
          :input-id="field.name"
          v-model="values[field.name]"
          :label="field.label"
          size="large"
          :placeholder="field.placeholder"
          :helper-text="field.description"
        />
      </div>
    </div>
  </template>

  <template #footer>
    <Button class="w-full" label="Deploy" kind="primary" size="large" :disabled="!canDeploy" />
  </template>
</CardBox>

${BROWSE}`

const page = (phase, body) => `<div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
${indent(HEADER)}

  <main class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto">
    <div
      class="layout-column-focused relative flex min-h-full flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-xxl)"
    >
${indent(PREVIEW, 3)}

      <div
        data-phase="${phase}"
        class="flex w-full flex-col items-center gap-(--spacing-xl) data-[phase=success]:my-auto motion-reduce:transition-none! motion-reduce:transform-none!"
      >
${indent(body, 4)}
      </div>
    </div>
  </main>
</div>`

const CONNECT_TEMPLATE = page('connect', CONNECT)

const FORM_TEMPLATE = page('form', FORM)

const BASE_IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Brand from '@aziontech/webkit/brand'",
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import IconButton from '@aziontech/webkit/icon-button'"
]

const CONNECT_SCRIPT = [
  ...[
    ...BASE_IMPORTS,
    "import EmptyState from '@aziontech/webkit/empty-state'",
    "import Link from '@aziontech/webkit/link'"
  ].sort(),
  '',
  declare('breadcrumb', BREADCRUMB)
]

const FORM_SCRIPT = [
  ...[
    ...BASE_IMPORTS,
    "import FieldSelect from '@aziontech/webkit/field-select'",
    "import FieldText from '@aziontech/webkit/field-text'",
    "import InputGroupAddon from '@aziontech/webkit/input-group-addon'",
    "import InputGroupRoot from '@aziontech/webkit/input-group-root'",
    "import Label from '@aziontech/webkit/label'",
    "import Switch from '@aziontech/webkit/switch'",
    "import Tooltip from '@aziontech/webkit/tooltip'"
  ].sort(),
  "import { computed, reactive, ref } from 'vue'",
  '',
  declare('breadcrumb', BREADCRUMB),
  '',
  declare('scopes', SCOPES),
  '',
  declare('settings', SETTINGS),
  '',
  "const scope = ref('gab-az')",
  "const repoName = ref('nuxt-ecommerce')",
  'const isPublic = ref(true)',
  "const values = reactive(Object.fromEntries(settings.map((field) => [field.name, ''])))",
  '',
  'const canDeploy = computed(',
  '  () =>',
  '    Boolean(repoName.value.trim()) &&',
  "    settings.filter((field) => field.required).every((field) => (values[field.name] || '').trim())",
  ')'
]

const components = {
  Avatar,
  Brand,
  Breadcrumb,
  Button,
  CardBox,
  EmptyState,
  FieldSelect,
  FieldText,
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  IconButton,
  InputGroupAddon,
  InputGroupRoot,
  Label,
  Link,
  Switch,
  Tooltip
}

const formState = () => {
  const repoName = ref('nuxt-ecommerce')
  const values = reactive(Object.fromEntries(SETTINGS.map((field) => [field.name, ''])))
  return {
    breadcrumb: BREADCRUMB,
    scopes: SCOPES,
    settings: SETTINGS,
    scope: ref('gab-az'),
    repoName,
    isPublic: ref(true),
    values,
    canDeploy: computed(
      () =>
        Boolean(repoName.value.trim()) &&
        SETTINGS.filter((field) => field.required).every((field) =>
          (values[field.name] || '').trim()
        )
    )
  }
}

const meta = {
  title: 'Templates/Platform/Creation/DeployTemplate',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Deploy Template page at /deploy, a focused flow outside the console shell: the creation header with Back to Creation Center and the Start from a Template crumb, the template preview card naming the repository it clones from, then the step the flow is on with Browse Templates under it. Without a Git provider the step is the Connect a Git provider card; once one is connected it is the Deploy your project form, with the scope and the repository name with its privacy switch side by side over the template settings, and the Deploy button that stays disabled until every required setting is filled. Deploying hands the same column to the build logs (the DeploymentFlow template) and then to the success screen (the DeploySuccess template). Import from Git and Upload a Project reach the same page with the form trimmed to the repository or the uploaded files. Built from `GlobalHeader`, `Breadcrumb`, `CardBox`, `EmptyState`, `FieldSelect`, `Label`, `InputGroup`, `Switch`, `FieldText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const ConnectGit = {
  render: () => ({
    components,
    setup: () => ({ breadcrumb: BREADCRUMB }),
    template: CONNECT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'No Git provider connected yet: the dashed Connect a Git provider card with Continue with GitHub, Continue without Git for a template that does not need a repository, and the link to manage connected providers.'
      },
      source: { code: toSfc(CONNECT_SCRIPT, CONNECT_TEMPLATE) }
    }
  }
}

export const Form = {
  render: () => ({
    components,
    setup: formState,
    template: FORM_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'GitHub connected: the gab-az scope and the nuxt-ecommerce repository name, public by default, over the three Shopify settings of the Nuxt E-commerce template; Deploy waits for the access token.'
      },
      source: { code: toSfc(FORM_SCRIPT, FORM_TEMPLATE) }
    }
  }
}
