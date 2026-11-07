import { computed, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { deploymentLogs } from './_deployment-logs-markup'
import {
  consoleComponents,
  consolePage,
  consoleScript,
  consoleSetup,
  pageHeading,
  simulation
} from './_form-patterns'
import { declare } from './_forms-markup'

const BREADCRUMB = [{ label: 'Deployments', href: '/deployments' }, { label: 'Async deployment' }]

const REPO = { name: 'checkout-web', scope: 'gab-az' }

const DEPLOY_ERROR_DETAIL =
  'The template built, its assets were uploaded and the Application was created — but a rule with the same behavior is already bound to this domain, so the Rules Engine refused the configuration. Nothing was published, so a redeploy starts from the same commit.'

const RUN = {
  name: 'checkout-web',
  scope: 'gab-az',
  attempt: 1,
  record: { workload: { domain: 'x7k2m9p4qa.azion.run' } },
  error: { detail: DEPLOY_ERROR_DETAIL }
}

const OUTCOME_OPTIONS = [
  { label: 'Succeeds', value: 'success' },
  { label: 'Fails', value: 'error' }
]

const NAMES = ['Button', 'CardBox', 'EmptyState', 'Message', 'SegmentedButton', 'Tag']

const statusTagOf = (status) => {
  if (status === 'running') return { label: 'Deploying', severity: 'info' }
  if (status === 'error') return { label: 'Failed', severity: 'danger' }
  if (status === 'success') return { label: 'Deployed', severity: 'success' }
  return { label: 'Idle', severity: 'secondary' }
}

const SIMULATION = simulation({
  label: 'Simulation — how this deploy ends',
  tag: `<Tag
  :label="\`\${REPO.scope}/\${REPO.name}\`"
  severity="secondary"
  size="medium"
/>`,
  copy: `The ending is held in the URL (<code class="text-label-code-sm">?outcome=</code>), so a
run is linkable and survives a reload. Pick one, press Deploy, and leave the page — the
toast follows you and settles wherever you are.`,
  actions: `<SegmentedButton
  v-model="outcome"
  :options="outcomes"
  aria-label="Simulated deployment outcome"
/>
<Button
  label="Deploy"
  kind="primary"
  size="medium"
  icon="pi pi-play"
  :loading="running"
  :disabled="running"
/>
<Button
  label="Reset scenario"
  kind="text"
  size="medium"
  :disabled="running"
/>`
})

const IDLE = `<EmptyState
  bordered
  class="layout-section-start"
  icon="pi pi-cloud-upload"
  title="No deployment running"
  description="Start one above. It takes about 25 seconds, long enough to walk away from, which is the whole point."
>
  <template #actions>
    <Button
      label="Deploy"
      kind="primary"
      size="medium"
    />
  </template>
</EmptyState>`

const FAILED_MESSAGE = `<Message
  key="status-failed"
  severity="danger"
  :label="run.error?.detail"
  class="layout-section-start animate-popup-scale-in motion-reduce:animate-none"
  style="--popup-origin: top"
>
  <template #action>
    <div class="flex items-center gap-(--spacing-xs)">
      <Button
        label="Redeploy"
        kind="secondary"
        size="medium"
        icon="pi pi-refresh"
      />
      <Button
        label="View deployments"
        kind="text"
        size="medium"
      />
    </div>
  </template>
</Message>`

const LIVE_MESSAGE = `<Message
  key="status-live"
  severity="success"
  :label="\`\${run.name} is live at \${run.record?.workload.domain}. It took \${run.attempt} attempt\${run.attempt > 1 ? 's' : ''}.\`"
  class="layout-section-start animate-popup-scale-in motion-reduce:animate-none"
  style="--popup-origin: top"
>
  <template #action>
    <Button
      label="Open workload"
      kind="secondary"
      size="medium"
    />
  </template>
</Message>`

const BUILDING = `<StatusIndicator
  loading
  severity="info"
  label="Building"
/>`

const VIEW_SWITCH = `<SegmentedButton
  v-model="logView"
  :options="logViews"
  class="shrink-0"
  aria-label="Log view"
/>`

const flowCard = (control, content) => `<CardBox
  :padded="false"
  class="layout-section-start w-full"
>
  <template #header>
    <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
${indent(control, 2)}
  </template>

  <template #content>
${indent(content, 2)}
  </template>
</CardBox>`

const FLOWS = {
  running: deploymentLogs({
    state: 'running',
    at: 'install',
    revealed: 2,
    live: true,
    label: 'Logs',
    controls: false
  }),
  error: deploymentLogs({
    state: 'failed',
    at: 'rules',
    live: true,
    label: 'Logs',
    controls: false
  })
}

const bodyOf = (status) => {
  if (status === 'idle') return IDLE
  if (status === 'running') return flowCard(BUILDING, FLOWS.running.template)
  if (status === 'error')
    return `${FAILED_MESSAGE}\n\n${flowCard(VIEW_SWITCH, FLOWS.error.template)}`
  return LIVE_MESSAGE
}

const templateFor = (status) =>
  consolePage({
    main: `<main class="layout-column-focused flex min-h-full flex-col">
${indent(
  pageHeading({
    size: 'large',
    title: 'Async deployment',
    description:
      'A deploy runs for half a minute and asks nothing of you while it does. Start one, then open any module in the sidebar. The run keeps going and reports back through the toast, wherever you are.',
    actions: `<Tag
  :label="statusTag.label"
  :severity="statusTag.severity"
  size="medium"
/>`
  })
)}

${indent(SIMULATION)}

${indent(bodyOf(status))}
</main>`
  })

const setupFor = (status, outcomeValue) => () => {
  const outcome = ref(outcomeValue)
  const state = ref(status)
  const running = computed(() => state.value === 'running')
  const flow = FLOWS[status]
  return consoleSetup({
    active: 'deployments',
    breadcrumb: BREADCRUMB,
    state: {
      REPO,
      outcome,
      running,
      outcomes: computed(() =>
        OUTCOME_OPTIONS.map((option) => ({ ...option, disabled: running.value }))
      ),
      statusTag: computed(() => statusTagOf(state.value)),
      ...(status === 'idle' ? {} : { run: RUN }),
      ...(flow ? flow.setup() : {})
    }
  })
}

const scriptFor = (status, outcomeValue) => {
  const flow = FLOWS[status]
  return consoleScript({
    active: 'deployments',
    breadcrumb: BREADCRUMB,
    names: NAMES,
    vue: ['computed', 'ref'],
    body: [
      ...(flow ? flow.imports : []),
      declare('REPO', REPO),
      '',
      `const outcome = ref('${outcomeValue}')`,
      `const status = ref('${status}')`,
      "const running = computed(() => status.value === 'running')",
      '',
      'const outcomes = computed(() =>',
      '  [',
      "    { label: 'Succeeds', value: 'success' },",
      "    { label: 'Fails', value: 'error' }",
      '  ].map((option) => ({ ...option, disabled: running.value }))',
      ')',
      '',
      ...(status === 'idle' ? [] : [declare('run', RUN), '']),
      'const statusTag = computed(() => {',
      "  if (status.value === 'running') return { label: 'Deploying', severity: 'info' }",
      "  if (status.value === 'error') return { label: 'Failed', severity: 'danger' }",
      "  if (status.value === 'success') return { label: 'Deployed', severity: 'success' }",
      "  return { label: 'Idle', severity: 'secondary' }",
      '})',
      ...(flow ? ['', ...flow.scriptLines] : [])
    ]
  })
}

const componentsFor = (status) => ({
  ...consoleComponents(NAMES),
  ...(FLOWS[status]?.components ?? {})
})

const STATES = {
  idle: { status: 'idle', outcome: 'success' },
  running: { status: 'running', outcome: 'error' },
  error: { status: 'error', outcome: 'error' },
  success: { status: 'success', outcome: 'success' }
}

const IDLE_TEMPLATE = templateFor('idle')
const RUNNING_TEMPLATE = templateFor('running')
const FAILED_TEMPLATE = templateFor('error')
const SUCCEEDED_TEMPLATE = templateFor('success')

const meta = {
  title: 'Templates/Platform/Forms/AsyncDeployment',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The async counterpart of Error validation, from the forms lab (Async action and error, `/forms/async-deployment`): a deploy that runs for about half a minute, so the user walks away before it ends. The page heading carries the run status as a `Tag`; a dashed simulation panel picks the ending with a `SegmentedButton` and starts the run; below it the page shows an `EmptyState` while idle, the deployment logs card while it runs, a danger `Message` with Redeploy and View deployments over the stopped logs when it fails, and a success `Message` with Open workload once it is live. In the console the run lives outside the page, so progress and the outcome also ride a toast wherever the user is; the toast is not plotted here. Built from the platform shell, `Tag`, `SegmentedButton`, `Button`, `EmptyState`, `Message`, and the deployment logs card from Templates/Platform/Creation/DeploymentFlow (`CardBox`, `StatusIndicator`, `Accordion`, `LogView`, `Spinner`, `ProgressBar`).'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Idle = {
  render: () => ({
    components: componentsFor('idle'),
    setup: setupFor(STATES.idle.status, STATES.idle.outcome),
    template: IDLE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Before any run: the heading reads Idle and the EmptyState below the simulation offers Deploy.'
      },
      source: { code: toSfc(scriptFor(STATES.idle.status, STATES.idle.outcome), IDLE_TEMPLATE) }
    }
  }
}

export const Running = {
  render: () => ({
    components: componentsFor('running'),
    setup: setupFor(STATES.running.status, STATES.running.outcome),
    template: RUNNING_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Mid-run: the heading reads Deploying, the simulation controls are disabled while Deploy shows its loading state, and the logs card streams under the Building status.'
      },
      source: {
        code: toSfc(scriptFor(STATES.running.status, STATES.running.outcome), RUNNING_TEMPLATE)
      }
    }
  }
}

export const Failed = {
  render: () => ({
    components: componentsFor('error'),
    setup: setupFor(STATES.error.status, STATES.error.outcome),
    template: FAILED_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Rules Engine refused the configuration: the heading reads Failed, the danger Message carries the reason with Redeploy and View deployments, and the logs card stays open on the failed step with the Phased or Complete switch.'
      },
      source: { code: toSfc(scriptFor(STATES.error.status, STATES.error.outcome), FAILED_TEMPLATE) }
    }
  }
}

export const Succeeded = {
  render: () => ({
    components: componentsFor('success'),
    setup: setupFor(STATES.success.status, STATES.success.outcome),
    template: SUCCEEDED_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The run is live: the heading reads Deployed and the success Message names the new azion.run address with Open workload; the logs card is gone.'
      },
      source: {
        code: toSfc(scriptFor(STATES.success.status, STATES.success.outcome), SUCCEEDED_TEMPLATE)
      }
    }
  }
}
