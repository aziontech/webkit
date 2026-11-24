import type { LogViewerLine } from '../../../code/log-viewer/injection-key'

export type DeploymentLogTuple = [time: string, message: string, type?: DeploymentLogLineType]

export type DeploymentLogLineType = 'text' | 'success' | 'warning'

export interface DeploymentStep {
  key: string
  title: string
  description: string
  duration?: number
  durationLabel?: string
  logs: DeploymentLogTuple[]
  failLogs?: DeploymentLogTuple[]
}

export type DeploymentLogView = 'phased' | 'complete'

export const DEFAULT_DEPLOYMENT_STEPS: DeploymentStep[] = [
  {
    key: 'token',
    title: 'Azion token',
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
    title: 'Clone template',
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

export const STEP_GAP_MS = 450

export const LOG_VIEWS: { label: string; value: DeploymentLogView }[] = [
  { label: 'Phased', value: 'phased' },
  { label: 'Complete', value: 'complete' }
]

export type DeploymentPhase = 'running' | 'success' | 'error'

export type DeploymentStepStatus = 'success' | 'running' | 'error' | 'skipped' | 'pending'

export const STEP_TAGS: Partial<
  Record<DeploymentStepStatus, { label: string; severity: 'danger' | 'neutral' }>
> = {
  error: { label: 'Failed', severity: 'danger' },
  skipped: { label: 'Skipped', severity: 'neutral' }
}

export const tuplesFor = (step: DeploymentStep, failAt: string): DeploymentLogTuple[] => {
  if (step.key !== failAt || !step.failLogs?.length) return step.logs
  return step.failLogs.map(([time, message]) => [
    time,
    message,
    message.includes('[ERROR]') ? 'warning' : 'text'
  ])
}

export const stepStatusOf = (
  phase: DeploymentPhase,
  active: number,
  i: number
): DeploymentStepStatus => {
  if (phase === 'error') {
    if (i < active) return 'success'
    return i === active ? 'error' : 'skipped'
  }
  if (phase === 'success' || i < active) return 'success'
  if (i === active && phase === 'running') return 'running'
  return 'pending'
}

export const formatDuration = (s: number): string =>
  s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`

export const toLine = ([time, message, type]: DeploymentLogTuple, i: number): LogViewerLine => {
  const kind =
    type ??
    (message.includes('vulnerabilit')
      ? 'warning'
      : /successfully|finalized/.test(message)
        ? 'success'
        : 'text')
  return kind === 'warning'
    ? { id: String(i), time, type: 'text', level: 'warn', message }
    : { id: String(i), time, type: kind, message }
}

export const stepDurationLabel = (step: DeploymentStep, seconds: number): string => {
  if (step.durationLabel) return step.durationLabel
  return seconds > 0 ? formatDuration(seconds) : ''
}

export const outcomeOf = (phase: DeploymentPhase, time: string): string => {
  if (phase === 'success') return time ? `Deployed in ${time}` : 'Deployed'
  if (phase === 'error') return time ? `Failed after ${time}` : 'Failed'
  return time
}

export const indexOfKey = (steps: DeploymentStep[], key: string): number =>
  key ? steps.findIndex((step) => step.key === key) : -1
