import type { AsyncSubmitDeployment, AsyncSubmitStep } from './state-async-submit.vue'

export const sampleRunningSteps: AsyncSubmitStep[] = [
  {
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
  },
  {
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
  },
  {
    id: 'install',
    title: 'Install dependencies',
    description: '478 packages installed',
    status: 'running',
    duration: '',
    lines: [
      { id: '0', time: '13:47:41', type: 'text', message: '[TASK] - # npm install' },
      {
        id: '1',
        time: '13:47:45',
        type: 'text',
        message: 'npm warn deprecated inflight@1.0.6: this module is not supported'
      }
    ]
  },
  {
    id: 'build',
    title: 'Build',
    description: 'Project built into dist/',
    status: 'pending',
    duration: '',
    lines: []
  },
  {
    id: 'upload',
    title: 'Upload',
    description: 'Static assets uploaded to storage',
    status: 'pending',
    duration: '',
    lines: []
  },
  {
    id: 'service',
    title: 'Service',
    description: 'Service and cache settings created',
    status: 'pending',
    duration: '',
    lines: []
  },
  {
    id: 'rules',
    title: 'Routing rules',
    description: 'Request rules and cache policies applied',
    status: 'pending',
    duration: '',
    lines: []
  },
  {
    id: 'deploy',
    title: 'Publish',
    description: 'Repository wired and the deploy published',
    status: 'pending',
    duration: '',
    lines: []
  }
]

export const sampleFailedSteps: AsyncSubmitStep[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
        message: 'vite v6.0.7 building for production…'
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
  },
  {
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
  },
  {
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
  },
  {
    id: 'rules',
    title: 'Routing rules',
    description: 'Request rules and cache policies applied',
    status: 'error',
    duration: '4s',
    tag: { label: 'Failed', severity: 'danger' },
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
        level: 'warn',
        message: '[ERROR] - # Routing rules rejected the configuration'
      },
      {
        id: '2',
        time: '13:48:10',
        type: 'text',
        message: "409 Conflict: rule 'default-cache' already bound to this domain"
      },
      {
        id: '3',
        time: '13:48:11',
        type: 'text',
        level: 'warn',
        message: '[ERROR] - # Deploy finalized with errors. Nothing was published.'
      }
    ]
  },
  {
    id: 'deploy',
    title: 'Publish',
    description: 'Repository wired and the deploy published',
    status: 'skipped',
    duration: '',
    tag: { label: 'Skipped', severity: 'neutral' },
    lines: []
  }
]

export const sampleError =
  'The template built, its assets were uploaded and the service was created, but a rule with the same behavior is already bound to this domain, so the routing rules were refused. Nothing was published, so a redeploy starts from the same commit.'

export const sampleDeployment: AsyncSubmitDeployment = {
  domain: 'web-app.example.com',
  attempts: 1
}
