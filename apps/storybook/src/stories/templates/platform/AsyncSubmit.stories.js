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

const REPO = { name: 'web-app', scope: 'acme' }

const DEPLOY_ERROR_DETAIL =
  'The template built, its assets were uploaded and the service was created — but a rule with the same behavior is already bound to this domain, so the routing rules were refused. Nothing was published, so a redeploy starts from the same commit.'

const RUN = {
  name: 'web-app',
  scope: 'acme',
  attempt: 1,
  record: { service: { domain: 'web-app.example.com' } },
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

const IDLE = `<div class="layout-section-start"><EmptyState
  bordered
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
</EmptyState></div>`

const FAILED_MESSAGE = `<div key="status-failed" class="layout-section-start animate-popup-scale-in motion-reduce:animate-none" style="--popup-origin: top">
  <Message
    severity="danger"
    :label="run.error?.detail"
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
  </Message>
</div>`

const LIVE_MESSAGE = `<div key="status-live" class="layout-section-start animate-popup-scale-in motion-reduce:animate-none" style="--popup-origin: top">
  <Message
    severity="success"
    :label="\`\${run.name} is live at \${run.record?.service.domain}. It took \${run.attempt} attempt\${run.attempt > 1 ? 's' : ''}.\`"
  >
    <template #action>
      <Button
        label="Open service"
        kind="secondary"
        size="medium"
      />
    </template>
  </Message>
</div>`

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

const flowCard = (control, content) => `<div class="layout-section-start"><CardBox
  :padded="false"
>
  <template #header>
    <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
${indent(control, 2)}
  </template>

  <template #content>
${indent(content, 2)}
  </template>
</CardBox></div>`

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
  title: 'Templates/Platform/Forms/AsyncSubmit',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The async counterpart of the ServerValidation template: a deploy that runs for about half a minute, so the user walks away before it ends. The page heading carries the run status as a `Tag`; a dashed simulation panel picks the ending with a `SegmentedButton` and starts the run; below it the page shows an `EmptyState` while idle, the deployment logs card while it runs, a danger `Message` with Redeploy and View deployments over the stopped logs when it fails, and a success `Message` with Open service once it is live. In a full app the run lives outside the page, so progress and the outcome also ride a toast wherever the user is; the toast is not plotted here. Built from the platform shell, `Tag`, `SegmentedButton`, `Button`, `EmptyState`, `Message`, and the deployment logs card from Templates/Platform/Creation/DeploymentFlow (`CardBox`, `StatusIndicator`, `Accordion`, `LogView`, `Spinner`, `ProgressBar`).'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'async submit',
        'long running action',
        'background job status',
        'deploy in progress',
        'async deploy result',
        'operation status',
        'envio assíncrono',
        'ação demorada',
        'status da operação'
      ],
      skills: ['webkit-errors', 'webkit-ui-states', 'webkit-form']
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
          'The routing rules were refused: the heading reads Failed, the danger Message carries the reason with Redeploy and View deployments, and the logs card stays open on the failed step with the Phased or Complete switch.'
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
          'The run is live: the heading reads Deployed and the success Message names the new address with Open service; the logs card is gone.'
      },
      source: {
        code: toSfc(scriptFor(STATES.success.status, STATES.success.outcome), SUCCEEDED_TEMPLATE)
      }
    }
  }
}
