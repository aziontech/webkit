import { DEFAULT_DEPLOYMENT_STEPS } from '@shared/ui/deployment/deployment-steps'

const shared = (key) => DEFAULT_DEPLOYMENT_STEPS.find((step) => step.key === key)

export const configuredTemplateSteps = ({ title = 'template', settings = [] } = {}) => {
  const applied = settings.length ? settings : ['default configuration']

  return [
    shared('token'),
    {
      key: 'configure',
      title: 'Configuration',
      description: `${title} settings applied`,
      duration: 3,
      logs: [
        ['13:47:37', `[TASK] - # Applying ${title} configuration`],
        ...applied.map((label, index) => [
          `13:47:3${Math.min(8 + index, 9)}`,
          `[TASK] - # ${label} set`
        ]),
        ['13:47:40', '[TASK] - # Configuration applied successfully!']
      ],
      failLogs: [
        ['13:47:37', `[TASK] - # Applying ${title} configuration`],
        ['13:47:39', '[ERROR] - # The configuration was rejected'],
        ['13:47:39', `422 Unprocessable Entity: ${applied[0]} is not a value Azion accepts`],
        ['13:47:40', '[ERROR] - # Deployment aborted.']
      ]
    },
    shared('application'),
    shared('rules'),
    {
      key: 'deploy',
      title: 'Publish',
      description: 'Configuration published to the edge',
      duration: 4,
      logs: [
        ['13:48:12', '[TASK] - # Publishing to the Azion edge network'],
        ['13:48:13', '[TASK] - # Propagating to 100% of the network'],
        ['13:48:15', '[TASK] - #. Deploy finalized successfully!']
      ],
      failLogs: [
        ['13:48:12', '[TASK] - # Publishing to the Azion edge network'],
        ['13:48:14', '[ERROR] - # Propagation did not complete'],
        ['13:48:15', '[ERROR] - # Deploy finalized with errors. Nothing was published.']
      ]
    }
  ]
}
