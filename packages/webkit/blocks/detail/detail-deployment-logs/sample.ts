import type { DeploymentLogsStep } from './detail-deployment-logs.vue'

const tokenStep: DeploymentLogsStep = {
  id: 'token',
  title: 'Access token',
  description: 'Deploy token created and added to the CLI',
  status: 'success',
  duration: '3s',
  lines: [
    {
      id: '0',
      time: '13:47:33',
      type: 'success',
      message: '[TASK] - #. Deploy started successfully!'
    },
    {
      id: '1',
      time: '13:47:33',
      type: 'text',
      message: '[TASK] - #. Creating access token!'
    },
    {
      id: '2',
      time: '13:47:35',
      type: 'text',
      message: '[TASK] - #. Adding token to the CLI!'
    },
    {
      id: '3',
      time: '13:47:36',
      type: 'success',
      message: '[TASK] - #. Token added successfully!'
    }
  ]
}

const cloneStep: DeploymentLogsStep = {
  id: 'clone',
  title: 'Clone template',
  description: 'Template cloned into the GitHub scope',
  status: 'success',
  duration: '4s',
  lines: [
    {
      id: '0',
      time: '13:47:37',
      type: 'text',
      message: '[TASK] - # Current directory: vue/vue3-vite-static/'
    },
    { id: '1', time: '13:47:38', type: 'text', message: '[TASK] - #. Cloning template!' },
    {
      id: '2',
      time: '13:47:39',
      type: 'text',
      message: 'Receiving objects: 100% (312/312), 1.14 MiB'
    },
    {
      id: '3',
      time: '13:47:40',
      type: 'success',
      message: '[TASK] - #. Template cloned successfully!'
    }
  ]
}

const installStep: DeploymentLogsStep = {
  id: 'install',
  title: 'Install dependencies',
  description: '478 packages installed',
  status: 'success',
  duration: '9s',
  lines: [
    { id: '0', time: '13:47:41', type: 'text', message: '[TASK] - # npm install' },
    {
      id: '1',
      time: '13:47:45',
      type: 'text',
      message: 'npm warn deprecated inflight@1.0.6: this module is not supported'
    },
    {
      id: '2',
      time: '13:47:48',
      type: 'text',
      message: 'added 478 packages, and audited 479 packages in 9s'
    },
    {
      id: '3',
      time: '13:47:48',
      type: 'text',
      level: 'warn',
      message: '24 vulnerabilities (5 low, 7 moderate, 10 high, 2 critical)'
    },
    {
      id: '4',
      time: '13:47:49',
      type: 'success',
      message: '[TASK] - # Dependencies installed successfully!'
    }
  ]
}

const buildStep: DeploymentLogsStep = {
  id: 'build',
  title: 'Build',
  description: 'Project built into dist/',
  status: 'success',
  duration: '8s',
  lines: [
    { id: '0', time: '13:47:50', type: 'text', message: '[TASK] - # Build template' },
    {
      id: '1',
      time: '13:47:52',
      type: 'text',
      message: 'vite v6.0.7 building for production...'
    },
    {
      id: '2',
      time: '13:47:56',
      type: 'text',
      message: '214 modules transformed · dist/assets 1.2 MB'
    },
    {
      id: '3',
      time: '13:47:57',
      type: 'success',
      message: '[TASK] - # Build completed successfully!'
    }
  ]
}

const uploadStep: DeploymentLogsStep = {
  id: 'upload',
  title: 'Upload',
  description: 'Static assets uploaded to storage',
  status: 'success',
  duration: '5s',
  lines: [
    {
      id: '0',
      time: '13:47:58',
      type: 'text',
      message: '[TASK] - # Uploading static assets to storage'
    },
    { id: '1', time: '13:47:59', type: 'text', message: 'create mode 100644 src/main.js' },
    {
      id: '2',
      time: '13:47:59',
      type: 'text',
      message: 'create mode 100644 src/router/index.js'
    },
    {
      id: '3',
      time: '13:48:01',
      type: 'text',
      message: '[TASK] - # 24 files uploaded (1.2 MB)'
    },
    {
      id: '4',
      time: '13:48:02',
      type: 'success',
      message: '[TASK] - # Upload completed successfully!'
    }
  ]
}

const serviceStep: DeploymentLogsStep = {
  id: 'service',
  title: 'Service',
  description: 'Service and cache settings created',
  status: 'success',
  duration: '5s',
  lines: [
    { id: '0', time: '13:48:03', type: 'text', message: '[TASK] - # Creating service' },
    {
      id: '1',
      time: '13:48:05',
      type: 'text',
      message: '[TASK] - # Cache Setting __DEFAULT__ created'
    },
    {
      id: '2',
      time: '13:48:07',
      type: 'success',
      message: '[TASK] - # Service created successfully!'
    }
  ]
}

const rulesStep: DeploymentLogsStep = {
  id: 'rules',
  title: 'Routing Rules',
  description: 'Request rules and cache policies applied',
  status: 'success',
  duration: '4s',
  lines: [
    {
      id: '0',
      time: '13:48:08',
      type: 'text',
      message: '[TASK] - # Configuring routing rules and cache policies'
    },
    {
      id: '1',
      time: '13:48:09',
      type: 'text',
      message: "[TASK] - # Rule 'Deliver Static Assets' created"
    },
    {
      id: '2',
      time: '13:48:11',
      type: 'success',
      message: '[TASK] - # Routing rules configured successfully!'
    }
  ]
}

const publishStep: DeploymentLogsStep = {
  id: 'deploy',
  title: 'Publish',
  description: 'Repository wired and the deploy published',
  status: 'success',
  duration: '4s',
  lines: [
    {
      id: '0',
      time: '13:48:12',
      type: 'text',
      message: "branch 'main' set up to track 'origin/main'."
    },
    {
      id: '1',
      time: '13:48:13',
      type: 'text',
      message: '[TASK] - #. Set the access token as a repository secret.'
    },
    {
      id: '2',
      time: '13:48:15',
      type: 'success',
      message: '[TASK] - #. Deploy finalized successfully!'
    }
  ]
}

const failedRulesStep: DeploymentLogsStep = {
  ...rulesStep,
  description: 'The rules rejected this deployment (409 Conflict).',
  status: 'error',
  lines: [
    {
      id: '0',
      time: '13:48:08',
      type: 'text',
      message: '[TASK] - # Configuring routing rules and cache policies'
    },
    {
      id: '1',
      time: '13:48:09',
      type: 'text',
      level: 'error',
      message: '[ERROR] - # Routing rules rejected the configuration'
    },
    {
      id: '2',
      time: '13:48:10',
      type: 'text',
      level: 'error',
      message: "409 Conflict: rule 'default-cache' already bound to this domain"
    },
    {
      id: '3',
      time: '13:48:11',
      type: 'text',
      level: 'error',
      message: '[ERROR] - # Deploy finalized with errors. Nothing was published.'
    }
  ]
}

const notRun = (
  step: DeploymentLogsStep,
  status: 'pending' | 'skipped',
  description: string
): DeploymentLogsStep => ({
  ...step,
  description,
  status,
  duration: '',
  lines: []
})

export const sampleSteps: DeploymentLogsStep[] = [
  tokenStep,
  cloneStep,
  installStep,
  { ...buildStep, status: 'running' },
  notRun(uploadStep, 'pending', 'Runs after Build'),
  notRun(serviceStep, 'pending', 'Runs after Upload'),
  notRun(rulesStep, 'pending', 'Runs after Service'),
  notRun(publishStep, 'pending', 'Runs after Routing Rules')
]

export const sampleSucceededSteps: DeploymentLogsStep[] = [
  tokenStep,
  cloneStep,
  installStep,
  buildStep,
  uploadStep,
  serviceStep,
  rulesStep,
  publishStep
]

export const sampleFailedSteps: DeploymentLogsStep[] = [
  tokenStep,
  cloneStep,
  installStep,
  buildStep,
  uploadStep,
  serviceStep,
  failedRulesStep,
  notRun(publishStep, 'skipped', 'Never ran. The deployment stopped at Routing Rules')
]

export const sampleCreateFlowFailedSteps: DeploymentLogsStep[] = sampleFailedSteps.map((step) => ({
  ...step,
  title: step.id === 'rules' ? 'Routing rules' : step.title,
  description: step.description?.replace('Routing Rules', 'Routing rules'),
  lines: step.lines.map((line) => ({ ...line, message: line.message.replace(/!$/, '.') }))
}))

interface DeploymentRun {
  command: string
  prefix: string
}

const deploymentBuildStep = (command: string): DeploymentLogsStep => ({
  id: 'build',
  title: 'Build',
  description: 'Bundle written to .build/worker.js',
  status: 'success',
  duration: '28s',
  lines: [
    {
      id: '0',
      time: '14:02:11',
      type: 'text',
      message: `[build] Running deploy command · ${command}`
    },
    {
      id: '1',
      time: '14:02:11',
      type: 'text',
      message: '[build] Getting presets available'
    },
    {
      id: '2',
      time: '14:02:12',
      type: 'text',
      message: '[build] Building with preset"vue" (platform bundler)'
    },
    {
      id: '3',
      time: '14:02:38',
      type: 'text',
      message: '[build] vite build · 1.69 MB in dist/'
    },
    {
      id: '4',
      time: '14:02:39',
      type: 'text',
      message: '[build] Wrote .build/worker.js and .build/manifest.json'
    },
    {
      id: '5',
      time: '14:02:39',
      type: 'success',
      message: '[build] Build finished successfully'
    }
  ]
})

const deploymentUploadStep = (prefix: string): DeploymentLogsStep => ({
  id: 'upload',
  title: 'Upload',
  description: 'Static assets uploaded to storage',
  status: 'success',
  duration: '8.1s',
  lines: [
    {
      id: '0',
      time: '14:02:39',
      type: 'text',
      message: '[upload] Uploading .build/assets to storage web-app-assets'
    },
    {
      id: '1',
      time: '14:02:40',
      type: 'text',
      message: `[upload] Prefix ${prefix} (rotate-prefix)`
    },
    {
      id: '2',
      time: '14:02:46',
      type: 'success',
      message: '[upload] 24 files updated successfully'
    },
    {
      id: '3',
      time: '14:02:47',
      type: 'success',
      message: '[upload] Storage web-app-assets successfully updated'
    }
  ]
})

const deploymentManifestStep: DeploymentLogsStep = {
  id: 'manifest',
  title: 'Manifest',
  description: 'manifest.json read, every resource resolved',
  status: 'success',
  duration: '1.9s',
  lines: [
    {
      id: '0',
      time: '14:02:47',
      type: 'text',
      message: '[manifest] Reading manifest.json file'
    },
    {
      id: '1',
      time: '14:02:48',
      type: 'text',
      message: '[manifest] Resolved 4 resources to apply: function, resource, origin, service'
    },
    {
      id: '2',
      time: '14:02:48',
      type: 'text',
      message: '[manifest] 3 rules declared in the request phase'
    },
    {
      id: '3',
      time: '14:02:49',
      type: 'success',
      message: '[manifest] manifest.json read successfully'
    }
  ]
}

const deploymentFunctionStep: DeploymentLogsStep = {
  id: 'function',
  title: 'Function',
  description: 'Function bound to the bundle',
  status: 'success',
  duration: '3.6s',
  lines: [
    {
      id: '0',
      time: '14:02:49',
      type: 'text',
      message: '[manifest] Updated function __DEFAULT__ with ID 53089'
    },
    {
      id: '1',
      time: '14:02:51',
      type: 'text',
      message: '[manifest] Bound .build/worker.js to function 53089'
    },
    {
      id: '2',
      time: '14:02:53',
      type: 'success',
      message: '[manifest] Function binding __DEFAULT__ with id 47458 successfully updated'
    }
  ]
}

const deploymentResourceStep: DeploymentLogsStep = {
  id: 'resource',
  title: 'Resource',
  description: 'Resource and cache settings applied',
  status: 'success',
  duration: '2.8s',
  lines: [
    {
      id: '0',
      time: '14:02:53',
      type: 'text',
      message: '[manifest] Updated resource web-app with ID 1784552864'
    },
    {
      id: '1',
      time: '14:02:55',
      type: 'success',
      message: '[manifest] Cache setting __DEFAULT__ successfully updated'
    },
    {
      id: '2',
      time: '14:02:56',
      type: 'success',
      message: '[manifest] Resource web-app successfully updated'
    }
  ]
}

const deploymentOriginStep = (prefix: string): DeploymentLogsStep => ({
  id: 'origin',
  title: 'Origin',
  description: 'Origin pointed at the storage',
  status: 'success',
  duration: '1.9s',
  lines: [
    {
      id: '0',
      time: '14:02:56',
      type: 'text',
      message: '[manifest] Creating origin storage-default (storage)'
    },
    {
      id: '1',
      time: '14:02:57',
      type: 'text',
      message: `[manifest] Storage web-app-assets · prefix ${prefix}`
    },
    {
      id: '2',
      time: '14:02:58',
      type: 'success',
      message: '[manifest] Origin storage-default with id 263718 successfully updated'
    }
  ]
})

const deploymentRulesStep: DeploymentLogsStep = {
  id: 'rules',
  title: 'Rules',
  description: 'Request-phase rules applied',
  status: 'success',
  duration: '4.8s',
  lines: [
    {
      id: '0',
      time: '14:02:59',
      type: 'success',
      message:
        '[manifest] Rule"Set storage origin for all requests" with id 604943 successfully updated'
    },
    {
      id: '1',
      time: '14:03:00',
      type: 'success',
      message: '[manifest] Rule"Deliver static assets" with id 604944 successfully updated'
    },
    {
      id: '2',
      time: '14:03:01',
      type: 'success',
      message: '[manifest] Rule"Redirect to index.html" with id 604945 successfully updated'
    },
    {
      id: '3',
      time: '14:03:03',
      type: 'success',
      message: '[manifest] 3 rules applied in the request phase'
    }
  ]
}

const deploymentServiceStep: DeploymentLogsStep = {
  id: 'service',
  title: 'Service',
  description: 'Service deployment published to the domain',
  status: 'success',
  duration: '3.7s',
  lines: [
    {
      id: '0',
      time: '14:03:04',
      type: 'success',
      message: '[manifest] Service web-app with id 1784675753 successfully updated'
    },
    {
      id: '1',
      time: '14:03:05',
      type: 'success',
      message: '[manifest] Service deployment d_7Kq2mVbHZ with id 5591028 successfully created'
    },
    {
      id: '2',
      time: '14:03:06',
      type: 'text',
      message: '[manifest] Environment production'
    },
    {
      id: '3',
      time: '14:03:07',
      type: 'text',
      message: '[manifest] Updated domain web-app with ID 1784675753'
    }
  ]
}

const deploymentPurgeStep: DeploymentLogsStep = {
  id: 'purge',
  title: 'Cache purge',
  description: 'Cache purged for the domain',
  status: 'success',
  duration: '3.4s',
  lines: [
    {
      id: '0',
      time: '14:03:08',
      type: 'text',
      message: '[purge] purge_on_publish · Initializing cache warming...'
    },
    {
      id: '1',
      time: '14:03:09',
      type: 'text',
      message: '[purge] Purge request accepted for web-app-mh2saq.example.com'
    },
    {
      id: '2',
      time: '14:03:10',
      type: 'text',
      message: '[purge] Cache warmed for 3 locations'
    },
    {
      id: '3',
      time: '14:03:11',
      type: 'success',
      message: '[purge] Purge finished executing'
    }
  ]
}

const deploymentFinishStep: DeploymentLogsStep = {
  id: 'finish',
  title: 'Live',
  description: 'Deployment serving traffic at the domain',
  status: 'success',
  duration: '0.9s',
  lines: [
    {
      id: '0',
      time: '14:03:12',
      type: 'text',
      message:
        '[deploy] To visualize your resource access the domain: https://web-app-mh2saq.example.com'
    },
    {
      id: '1',
      time: '14:03:12',
      type: 'success',
      message: '[deploy] Deployed finished executing'
    }
  ]
}

const deploymentSteps = (run: DeploymentRun): DeploymentLogsStep[] => [
  deploymentBuildStep(run.command),
  deploymentUploadStep(run.prefix),
  deploymentManifestStep,
  deploymentFunctionStep,
  deploymentResourceStep,
  deploymentOriginStep(run.prefix),
  deploymentRulesStep,
  deploymentServiceStep,
  deploymentPurgeStep,
  deploymentFinishStep
]

const failedDeploymentDurations: Record<string, string> = {
  build: '26s',
  upload: '7.8s',
  manifest: '1.7s',
  function: '3.4s',
  resource: '2.6s',
  origin: '1.8s'
}

const failedDeploymentRules = (step: DeploymentLogsStep): DeploymentLogsStep => ({
  ...step,
  description: 'The rules rejected this deployment (409 Conflict).',
  status: 'error',
  duration: '4.1s',
  lines: [
    { ...step.lines[0], type: 'text' },
    {
      id: '1',
      time: '14:03:01',
      type: 'text',
      level: 'error',
      message: '[ERROR] [manifest] Error while creating rule"Deliver static assets"'
    },
    {
      id: '2',
      time: '14:03:02',
      type: 'text',
      level: 'error',
      message: '409 Conflict: a rule with this behavior is already bound to service web-app'
    },
    {
      id: '3',
      time: '14:03:03',
      type: 'text',
      level: 'error',
      message: '[ERROR] [manifest] Deploy aborted. Nothing was published.'
    }
  ]
})

export const sampleDeploymentSteps: DeploymentLogsStep[] = deploymentSteps({
  command: 'platform deploy --auto --local',
  prefix: '20260722112530'
})

export const sampleDeploymentFailedSteps: DeploymentLogsStep[] = deploymentSteps({
  command: 'Console (UI)',
  prefix: '20260730140211'
}).map((step) => {
  if (step.id === 'rules') return failedDeploymentRules(step)
  const duration = failedDeploymentDurations[step.id]
  return duration
    ? { ...step, duration }
    : notRun(step, 'skipped', 'Never ran. The deployment stopped at Rules')
})
