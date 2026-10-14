import Accordion from '@aziontech/webkit/accordion'
import LogView from '@aziontech/webkit/log-view'
import LogViewContent from '@aziontech/webkit/log-view-content'
import ProgressBar from '@aziontech/webkit/progress-bar'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Spinner from '@aziontech/webkit/spinner'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

import { indent } from '../../_shared/markup'
import { declare, literal } from './_forms-markup'

export const DEPLOYMENT_STEPS = [
  {
    key: 'token',
    title: 'Azion Token',
    description: 'Deploy token created and added to the CLI',
    duration: 3,
    logs: [
      ['13:47:33', '[TASK] - #. Deploy started successfully!'],
      ['13:47:33', '[TASK] - #. Creating Azion token!'],
      ['13:47:35', '[TASK] - #. Add to Azion CLI!'],
      ['13:47:36', '[TASK] - #. Token added successfully!']
    ],
    failLogs: [
      ['13:47:33', '[TASK] - #. Deploy started successfully!'],
      ['13:47:34', '[TASK] - #. Creating Azion token!'],
      ['13:47:35', '[ERROR] - # Could not create an Azion token'],
      ['13:47:35', '401 Unauthorized: the personal token has expired'],
      ['13:47:36', '[ERROR] - # Deployment aborted.']
    ]
  },
  {
    key: 'clone',
    title: 'Clone Template',
    description: 'Template cloned into the GitHub scope',
    duration: 4,
    logs: [
      ['13:47:37', '[TASK] - # Current directory: vue/vue3-vite-static/'],
      ['13:47:38', '[TASK] - #. Cloning template!'],
      ['13:47:39', 'Receiving objects: 100% (312/312), 1.14 MiB'],
      ['13:47:40', '[TASK] - #. Template cloned successfully!']
    ],
    failLogs: [
      ['13:47:37', '[TASK] - # Current directory: vue/vue3-vite-static/'],
      ['13:47:38', '[TASK] - #. Cloning template!'],
      ['13:47:39', '[ERROR] - # Could not clone the template repository'],
      ['13:47:39', '403 Forbidden: the GitHub App is not installed on this scope'],
      ['13:47:40', '[ERROR] - # Deployment aborted.']
    ]
  },
  {
    key: 'install',
    title: 'Install dependencies',
    description: '478 packages installed',
    duration: 9,
    logs: [
      ['13:47:41', '[TASK] - # npm install'],
      ['13:47:45', 'npm warn deprecated inflight@1.0.6: this module is not supported'],
      ['13:47:48', 'added 478 packages, and audited 479 packages in 9s'],
      ['13:47:48', '24 vulnerabilities (5 low, 7 moderate, 10 high, 2 critical)'],
      ['13:47:49', '[TASK] - # Dependencies installed successfully!']
    ],
    failLogs: [
      ['13:47:41', '[TASK] - # npm install'],
      ['13:47:47', '[ERROR] - # npm install exited with code 1'],
      ['13:47:48', 'ERESOLVE could not resolve peer dependency vue@^3.5.0'],
      ['13:47:49', '[ERROR] - # Deployment aborted.']
    ]
  },
  {
    key: 'build',
    title: 'Build',
    description: 'Project built into dist/',
    duration: 8,
    logs: [
      ['13:47:50', '[TASK] - # Build template'],
      ['13:47:52', 'vite v6.0.7 building for production...'],
      ['13:47:56', '214 modules transformed · dist/assets 1.2 MB'],
      ['13:47:57', '[TASK] - # Build completed successfully!']
    ],
    failLogs: [
      ['13:47:50', '[TASK] - # Build template'],
      ['13:47:52', 'vite v6.0.7 building for production...'],
      ['13:47:56', '[ERROR] - # Build failed with exit code 1'],
      ['13:47:56', "src/main.js: Cannot find module '@azion/config'"],
      ['13:47:57', '[ERROR] - # Deployment aborted.']
    ]
  },
  {
    key: 'upload',
    title: 'Upload',
    description: 'Static assets uploaded to Object Storage',
    duration: 5,
    logs: [
      ['13:47:58', '[TASK] - # Uploading static assets to Object Storage'],
      ['13:47:59', 'create mode 100644 src/main.js'],
      ['13:47:59', 'create mode 100644 src/router/index.js'],
      ['13:48:01', '[TASK] - # 24 files uploaded (1.2 MB)'],
      ['13:48:02', '[TASK] - # Upload completed successfully!']
    ],
    failLogs: [
      ['13:47:58', '[TASK] - # Uploading static assets to Object Storage'],
      ['13:48:00', '[ERROR] - # Object Storage returned 503 Service Unavailable'],
      ['13:48:02', '[ERROR] - # Upload interrupted at 14/24 files.']
    ]
  },
  {
    key: 'application',
    title: 'Application',
    description: 'Application and cache settings created',
    duration: 5,
    logs: [
      ['13:48:03', '[TASK] - # Creating Application'],
      ['13:48:05', '[TASK] - # Cache Setting __DEFAULT__ created'],
      ['13:48:07', '[TASK] - # Application created successfully!']
    ],
    failLogs: [
      ['13:48:03', '[TASK] - # Creating Application'],
      ['13:48:05', '[ERROR] - # Application could not be created'],
      ['13:48:06', '403 Forbidden: the account has reached its application limit'],
      ['13:48:07', '[ERROR] - # Deployment aborted.']
    ]
  },
  {
    key: 'rules',
    title: 'Rules Engine',
    description: 'Request rules and cache policies applied',
    duration: 4,
    logs: [
      ['13:48:08', '[TASK] - # Configuring Rules Engine and cache policies'],
      ['13:48:09', "[TASK] - # Rule 'Deliver Static Assets' created"],
      ['13:48:11', '[TASK] - # Rules Engine configured successfully!']
    ],
    failLogs: [
      ['13:48:08', '[TASK] - # Configuring Rules Engine and cache policies'],
      ['13:48:09', '[ERROR] - # Rules Engine rejected the configuration'],
      ['13:48:10', "409 Conflict: rule 'default-cache' already bound to this domain"],
      ['13:48:11', '[ERROR] - # Deploy finalized with errors. Nothing was published.']
    ]
  },
  {
    key: 'deploy',
    title: 'Publish',
    description: 'Repository wired and the deploy published',
    duration: 4,
    logs: [
      ['13:48:12', "branch 'main' set up to track 'origin/main'."],
      ['13:48:13', '[TASK] - #. Set Azion Personal Token in the repository.'],
      ['13:48:15', '[TASK] - #. Deploy finalized successfully!']
    ],
    failLogs: [
      ['13:48:12', "branch 'main' set up to track 'origin/main'."],
      ['13:48:13', '[ERROR] - # Could not set the Azion Personal Token in the repository'],
      ['13:48:14', '403 Forbidden: the GitHub App cannot write repository secrets'],
      ['13:48:15', '[ERROR] - # Deploy finalized with errors. Nothing was published.']
    ]
  }
]

export const LOG_VIEWS = [
  { label: 'Phased', value: 'phased' },
  { label: 'Complete', value: 'complete' }
]

export const DEPLOYMENT_LOGS_COMPONENTS = {
  Accordion,
  'Accordion.Item': Accordion.Item,
  'Accordion.Trigger': Accordion.Trigger,
  'Accordion.Content': Accordion.Content,
  LogView,
  LogViewContent,
  ProgressBar,
  SegmentedButton,
  Spinner,
  Tag
}

const IMPORT_LINES = {
  Accordion: "import Accordion from '@aziontech/webkit/accordion'",
  LogView: "import LogView from '@aziontech/webkit/log-view'",
  LogViewContent: "import LogViewContent from '@aziontech/webkit/log-view-content'",
  ProgressBar: "import ProgressBar from '@aziontech/webkit/progress-bar'",
  SegmentedButton: "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  Spinner: "import Spinner from '@aziontech/webkit/spinner'",
  Tag: "import Tag from '@aziontech/webkit/tag'"
}

const STEP_TAGS = {
  failed: { label: 'Failed', severity: 'danger' },
  skipped: { label: 'Skipped', severity: 'secondary' }
}

const formatDuration = (seconds) =>
  seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`

const lineType = (message) => {
  if (message.includes('vulnerabilit')) return 'warning'
  return /successfully|finalized/.test(message) ? 'success' : 'text'
}

const tuplesFor = (step, failAt) => {
  if (step.key !== failAt || !step.failLogs?.length) return step.logs
  return step.failLogs.map(([time, message]) => [
    time,
    message,
    message.includes('[ERROR]') ? 'warning' : 'text'
  ])
}

const toLine = ([time, message, type], index) => ({
  id: String(index),
  time,
  type: type ?? lineType(message),
  message
})

const statusOf = (state, index, atIndex) => {
  if (state === 'finished') return 'done'
  if (index < atIndex) return 'done'
  if (index > atIndex) return state === 'failed' ? 'skipped' : 'pending'
  return state === 'failed' ? 'failed' : 'running'
}

const durationOf = (step, status, live) => {
  if (step.durationLabel) return step.durationLabel
  if (live && !['done', 'failed'].includes(status)) return ''
  return step.duration > 0 ? formatDuration(step.duration) : ''
}

const declareSteps = (rows) => declare('steps', rows).replace(/\[\n\s*\n\s*\]/g, '[]')

const LINES_SCRIPT =
  'const lines = steps.flatMap((step, index) => step.lines.map((line) => ({ ...line, id: `${index}-${line.id}` })))'

const flatten = (steps) =>
  steps.flatMap((step, index) => step.lines.map((line) => ({ ...line, id: `${index}-${line.id}` })))

const glyph = (running) => `<span class="flex size-5 shrink-0 items-center justify-center">
  <span
    v-if="step.status === 'done'"
    class="flex size-4 items-center justify-center rounded-full bg-(--success)"
  >
    <i class="pi pi-check text-[9px] leading-none text-(--success-contrast)" aria-hidden="true" />
  </span>
  <i
    v-else-if="step.status === 'failed'"
    class="pi pi-times-circle text-(--danger-contrast)"
    aria-hidden="true"
  />
  <i
    v-else-if="step.status === 'skipped'"
    class="pi pi-minus-circle text-(--text-muted) opacity-60"
    aria-hidden="true"
  />${
    running
      ? `
  <Spinner
    v-else-if="step.status === 'running'"
    class="size-4 text-(--text-default)"
  />`
      : ''
  }
  <span
    v-else
    class="size-3.5 rounded-full border border-dashed border-(--border-default)"
  />
</span>`

const stepEmpty = (failedTitle) =>
  failedTitle
    ? `<template #empty>
  <template v-if="step.status === 'skipped'">
    Never ran — the deployment stopped at
    ${failedTitle}.
  </template>
  <template v-else>No log lines yet.</template>
</template>`
    : '<template #empty>No log lines yet.</template>'

const phased = ({ running, settled, copyable, failedTitle, hasTags, guarded }) => {
  const showCopy = copyable && settled ? 'show-copy' : ':show-copy="false"'
  return `<Accordion${guarded ? '\n  v-if="logView === \'phased\'"' : ''}
  v-model:value="openStep"
  type="single"
  collapsible
>
  <Accordion.Item
    v-for="step in steps"
    :key="step.key"
    :value="step.key"
  >
    <Accordion.Trigger>
      <span class="flex min-h-10 flex-1 items-center gap-(--spacing-sm)">
${indent(glyph(running), 4)}
        <span
          :data-state="step.status"
          class="flex min-w-0 flex-1 items-baseline gap-(--spacing-xs) text-left data-[state=failed]:flex-wrap"
        >
          <span
            :data-state="step.status"
            class="shrink-0 text-label-sm text-(--text-default) data-[state=pending]:text-(--text-muted) data-[state=skipped]:text-(--text-muted)"
          >
            {{ step.title }}
          </span>${
            hasTags
              ? `
          <Tag
            v-if="step.tag"
            :label="step.tag.label"
            :severity="step.tag.severity"
            size="small"
          />`
              : ''
          }
          <span
            :data-state="step.status"
            class="min-w-0 truncate text-body-xs text-(--text-muted) data-[state=failed]:whitespace-normal data-[state=failed]:text-pretty data-[state=failed]:text-(--danger-contrast)"
          >
            {{ step.description }}
          </span>
        </span>
        <span class="ml-auto flex shrink-0 items-center">
          <span
            v-if="step.duration"
            class="text-label-code-sm text-(--text-muted)"
          >
            {{ step.duration }}
          </span>
        </span>
      </span>
    </Accordion.Trigger>
    <Accordion.Content>
      <LogView
        :lines="step.lines"
        :border="false"
        ${showCopy}
        :loading="step.status === 'pending'"
        loading-label="Waiting to start…"
      >
        <LogViewContent>
${indent(stepEmpty(failedTitle), 5)}
        </LogViewContent>
      </LogView>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`
}

const COMPLETE = `<LogView
  v-else
  :lines="lines"
  :border="false"
  show-copy
  loading-label="Waiting to start…"
>
  <LogViewContent>
    <template #empty>No log lines yet.</template>
  </LogViewContent>
</LogView>`

const logsRow = ({ label, state, progressLabel, activeTitle, failedTitle, controls, outcome }) => {
  const heading = label
    ? `\n  <p class="shrink-0 text-heading-xxs text-(--text-default)">${label}</p>\n`
    : '\n'
  const read = {
    running: `<span class="shrink-0 text-label-sm text-(--text-default)">${progressLabel}</span>${
      activeTitle
        ? `\n<span class="truncate text-label-sm text-(--text-muted)">${activeTitle}</span>`
        : ''
    }`,
    finished: '<Tag label="Completed" severity="success" />',
    failed: `<Tag label="${failedTitle ? `Failed on ${failedTitle}` : 'Failed'}" severity="danger" />`
  }[state]
  const tools =
    controls && state !== 'running'
      ? `\n<span class="text-label-sm text-(--text-muted)">${outcome}</span>
<SegmentedButton
  v-model="logView"
  :options="logViews"
  size="medium"
  aria-label="Log view"
/>`
      : ''
  return `<div
  class="flex min-h-12 items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
>${heading}  <div class="ml-auto flex min-w-0 items-center gap-(--spacing-sm)">
${indent(`${read}${tools}`, 2)}
  </div>
</div>`
}

const progressBar = (value) => `<ProgressBar
  :value="${value}"
  :max="100"
  size="small"
  shape="flat"
  class="w-full"
  aria-label="Deployment progress"
/>`

export const deploymentLogs = ({
  steps = DEPLOYMENT_STEPS,
  state = 'finished',
  at = '',
  revealed,
  live = false,
  view = 'phased',
  open,
  header = true,
  label = 'Deployment Logs',
  controls = true,
  copyable = true,
  progressBar: withProgressBar = true,
  totalLabel = ''
} = {}) => {
  const failAt = state === 'failed' ? at : ''
  const played = steps.map((step) => ({ ...step, logs: tuplesFor(step, failAt) }))
  const lastIndex = played.length - 1
  const named = played.findIndex((step) => step.key === at)
  const atIndex = state === 'finished' ? lastIndex : named === -1 ? 0 : named
  const settled = state !== 'running'

  const rows = played.map((step, index) => {
    const status = statusOf(state, index, atIndex)
    const shown =
      status === 'running' && revealed !== undefined
        ? revealed
        : ['done', 'running', 'failed'].includes(status)
          ? step.logs.length
          : 0
    const row = {
      key: step.key,
      title: step.title,
      description: step.description,
      status,
      duration: durationOf(step, status, live)
    }
    if (STEP_TAGS[status]) row.tag = STEP_TAGS[status]
    return { ...row, lines: step.logs.slice(0, shown).map(toLine) }
  })

  const failedTitle = state === 'failed' ? played[atIndex].title : ''
  const doneCount = rows.filter((row) => row.status === 'done').length
  const totalLines = played.reduce((sum, step) => sum + step.logs.length, 0)
  const shownLines = rows.reduce((sum, row) => sum + row.lines.length, 0)
  const progress = Math.round((shownLines / totalLines) * 100)
  const totalSeconds = played
    .slice(0, atIndex + 1)
    .reduce((sum, step) => sum + (step.duration ?? 0), 0)
  const time = totalLabel || (totalSeconds > 0 ? formatDuration(totalSeconds) : '')
  const outcome =
    state === 'finished'
      ? time
        ? `Deployed in ${time}`
        : 'Deployed'
      : time
        ? `Failed after ${time}`
        : 'Failed'

  const defaultOpen = state === 'finished' && live ? null : played[atIndex].key
  const openStep = open === undefined ? defaultOpen : open
  const showsBar = withProgressBar && !settled
  const hasTags = rows.some((row) => row.tag)
  const running = rows.some((row) => row.status === 'running')
  const headerTag = header && settled
  const headerSwitch = header && controls && settled

  const body = [
    header &&
      logsRow({
        label,
        state,
        progressLabel: `${doneCount}/${rows.length} steps`,
        activeTitle: state === 'running' ? played[atIndex].title : '',
        failedTitle,
        controls,
        outcome
      }),
    phased({ running, settled, copyable, failedTitle, hasTags, guarded: settled }),
    settled && COMPLETE,
    showsBar && progressBar(progress)
  ].filter(Boolean)

  const template = `<div class="flex w-full flex-col">
${indent(body.join('\n'))}
</div>`

  const used = [
    'Accordion',
    'LogView',
    'LogViewContent',
    showsBar && 'ProgressBar',
    headerSwitch && 'SegmentedButton',
    running && 'Spinner',
    (hasTags || headerTag) && 'Tag'
  ].filter(Boolean)

  const scriptLines = [
    declareSteps(rows),
    ...(settled ? [LINES_SCRIPT, declare('logViews', LOG_VIEWS)] : []),
    '',
    ...(settled ? [`const logView = ref(${literal(view)})`] : []),
    `const openStep = ref(${literal(openStep)})`
  ]

  const setup = () => ({
    steps: rows,
    ...(settled ? { lines: flatten(rows), logViews: LOG_VIEWS, logView: ref(view) } : {}),
    openStep: ref(openStep)
  })

  return {
    template,
    imports: used.map((name) => IMPORT_LINES[name]),
    vue: ['ref'],
    scriptLines,
    components: DEPLOYMENT_LOGS_COMPONENTS,
    setup
  }
}
