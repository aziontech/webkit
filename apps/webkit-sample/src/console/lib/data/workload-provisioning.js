import { AZION_DOMAIN_SUFFIX } from './provisioning'

export { AZION_DOMAIN_SUFFIX }

export const domainForWorkload = (name) => {
  const slug = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug ? `${slug}${AZION_DOMAIN_SUFFIX}` : ''
}

export function workloadProvisioningSteps({
  workload = 'workload',
  domain = '',
  application = '',
  applicationExisting = true,
  protected: isProtected = false,
  firewall = '',
  firewallBound = true,
  environment = 'Production',
  deployment = '',
  deploymentExisting = false
} = {}) {
  const address = domain || domainForWorkload(workload) || `workload${AZION_DOMAIN_SUFFIX}`
  const app = application || 'the application'

  const steps = [
    applicationExisting
      ? {
          key: 'application',
          title: 'Check application',
          description: `${app} · latest ready version`,
          duration: 2,
          logs: [
            ['13:47:33', '[TASK] - #. Provisioning started successfully!'],
            ['13:47:33', `[TASK] - #. Resolving application "${app}"!`],
            ['13:47:34', 'GET /v4/workspace/applications 200 OK'],
            ['13:47:35', '[TASK] - #. Ready version found!']
          ],
          failLogs: [
            ['13:47:33', '[TASK] - #. Provisioning started successfully!'],
            ['13:47:33', `[TASK] - #. Resolving application "${app}"!`],
            ['13:47:34', '[ERROR] - # No ready version'],
            ['13:47:34', `422 Unprocessable: "${app}" has no version in the ready state`],
            ['13:47:35', '[ERROR] - # Provisioning aborted.']
          ]
        }
      : {
          key: 'application',
          title: 'Create Application',
          description: `${app} · built`,
          duration: 5,
          logs: [
            ['13:47:33', '[TASK] - #. Provisioning started successfully!'],
            ['13:47:33', `[TASK] - #. Creating application "${app}"!`],
            ['13:47:34', 'POST /v4/workspace/applications 201 Created'],
            ['13:47:36', '[TASK] - #. Building the draft version!'],
            ['13:47:38', '[TASK] - #. Version built and ready!']
          ],
          failLogs: [
            ['13:47:33', '[TASK] - #. Provisioning started successfully!'],
            ['13:47:33', `[TASK] - #. Creating application "${app}"!`],
            ['13:47:34', '[ERROR] - # Could not create the application'],
            ['13:47:34', `409 Conflict: an application named "${app}" already exists`],
            ['13:47:35', '[ERROR] - # Provisioning aborted.']
          ]
        }
  ]

  if (isProtected) {
    steps.push(
      firewallBound
        ? {
            key: 'firewall',
            title: 'Check firewall',
            description: firewall || 'Firewall resolved',
            duration: 3,
            logs: [
              ['13:47:39', `[TASK] - #. Resolving firewall "${firewall}"!`],
              ['13:47:40', 'Rule set compiled · 0 warnings'],
              ['13:47:41', '[TASK] - #. Ready version found!']
            ],
            failLogs: [
              ['13:47:39', `[TASK] - #. Resolving firewall "${firewall}"!`],
              ['13:47:40', '[ERROR] - # No ready version'],
              ['13:47:41', `422 Unprocessable: "${firewall}" has no version in the ready state`],
              ['13:47:42', '[ERROR] - # Provisioning aborted.']
            ]
          }
        : {
            key: 'firewall',
            title: 'Create Firewall',
            description: firewall || 'Firewall created',
            duration: 3,
            logs: [
              ['13:47:39', `[TASK] - #. Creating firewall "${firewall}"!`],
              ['13:47:40', 'Modules enabled · rule set compiled'],
              ['13:47:41', '[TASK] - #. Firewall created and built!']
            ],
            failLogs: [
              ['13:47:39', `[TASK] - #. Creating firewall "${firewall}"!`],
              ['13:47:40', '[ERROR] - # Could not create the firewall'],
              ['13:47:41', `409 Conflict: a firewall named "${firewall}" already exists`],
              ['13:47:42', '[ERROR] - # Provisioning aborted.']
            ]
          }
    )
  }

  steps.push(
    {
      key: 'environment',
      title: 'Resolve environment',
      description: environment,
      duration: 2,
      logs: [
        ['13:47:42', `[TASK] - #. Resolving environment "${environment}"!`],
        ['13:47:43', 'GET /v4/workspace/environments 200 OK'],
        ['13:47:44', '[TASK] - #. Environment resolved!']
      ],
      failLogs: [
        ['13:47:42', `[TASK] - #. Resolving environment "${environment}"!`],
        ['13:47:43', '[ERROR] - # Could not resolve the environment'],
        ['13:47:44', `404 Not Found: no environment named "${environment}"`],
        ['13:47:45', '[ERROR] - # Provisioning aborted.']
      ]
    },
    deploymentExisting
      ? {
          key: 'deployment',
          title: 'Check deployment',
          description: deployment || 'Deployment resolved',
          duration: 2,
          logs: [
            ['13:47:45', `[TASK] - #. Resolving deployment "${deployment}"!`],
            ['13:47:46', 'GET /v4/workspace/deployments 200 OK'],
            ['13:47:47', '[TASK] - #. Deployment resolved!']
          ],
          failLogs: [
            ['13:47:45', `[TASK] - #. Resolving deployment "${deployment}"!`],
            ['13:47:46', '[ERROR] - # Could not resolve the deployment'],
            ['13:47:47', `404 Not Found: no deployment named "${deployment}"`],
            ['13:47:48', '[ERROR] - # Provisioning aborted.']
          ]
        }
      : {
          key: 'deployment',
          title: 'Create Deployment',
          description: deployment || 'Deployment created',
          duration: 3,
          logs: [
            ['13:47:45', `[TASK] - #. Creating deployment "${deployment}"!`],
            ['13:47:46', 'POST /v4/workspace/deployments 201 Created'],
            ['13:47:47', '[TASK] - #. Deployment created with default settings!']
          ],
          failLogs: [
            ['13:47:45', `[TASK] - #. Creating deployment "${deployment}"!`],
            ['13:47:46', '[ERROR] - # Could not create the deployment'],
            ['13:47:47', `409 Conflict: a deployment named "${deployment}" already exists`],
            ['13:47:48', '[ERROR] - # Provisioning aborted.']
          ]
        },
    {
      key: 'release',
      title: 'Deploy release',
      description: `Serving ${app}`,
      duration: 4,
      logs: [
        ['13:47:48', '[TASK] - #. Composing the release!'],
        ['13:47:49', `application: ${app}`],
        ['13:47:50', isProtected ? `firewall: ${firewall}` : 'firewall: not bound'],
        ['13:47:51', '[TASK] - #. Release deployed successfully!']
      ],
      failLogs: [
        ['13:47:48', '[TASK] - #. Composing the release!'],
        ['13:47:50', '[ERROR] - # Could not deploy the release'],
        ['13:47:51', '422 Unprocessable: the environment has nothing to serve'],
        ['13:47:52', '[ERROR] - # Provisioning aborted.']
      ]
    },
    {
      key: 'workload',
      title: 'Create Workload',
      description: address,
      duration: 4,
      logs: [
        ['13:47:52', `[TASK] - #. Creating workload "${workload}"!`],
        ['13:47:53', 'POST /v4/workspace/workloads 201 Created'],
        ['13:47:54', `${address} reserved · certificate issued`],
        ['13:47:55', `[TASK] - #. ${environment} bound to the deployment!`]
      ],
      failLogs: [
        ['13:47:52', `[TASK] - #. Creating workload "${workload}"!`],
        ['13:47:53', '[ERROR] - # Could not create the workload'],
        ['13:47:54', `409 Conflict: ${address} is already in use`],
        ['13:47:55', '[ERROR] - # Provisioning aborted.']
      ]
    },
    {
      key: 'propagate',
      title: 'Propagate to the edge',
      description: 'Live on every edge location',
      duration: 6,
      logs: [
        ['13:47:56', '[TASK] - #. Propagating the release!'],
        ['13:47:58', 'Edge locations updated'],
        ['13:47:59', `[TASK] - #. https://${address} is live!`],
        ['13:48:00', '[TASK] - #. Provisioning completed successfully!']
      ],
      failLogs: [
        ['13:47:56', '[TASK] - #. Propagating the release!'],
        ['13:47:58', '[ERROR] - # Propagation did not complete'],
        ['13:47:59', 'Timed out waiting for 3 edge locations'],
        ['13:48:00', '[ERROR] - # Provisioning aborted.']
      ]
    }
  )

  return steps
}
