// THE WORKLOAD PROVISIONING PIPELINE — the steps the create wizard's final run streams
// through ../../components/deployment/DeploymentFlow.vue.
//
// Same shape as the template-deploy model (../../../shared/ui/deployment/deployment-steps.js):
// one entry per stage that can FAIL ON ITS OWN, each owning its slice of the log. That rule
// is what makes the rows worth reading — an application that will not build and a release
// with nothing to serve are different problems with different fixes, so they are different
// rows. A row that bundled them could only report that "something in there" broke.
//
// ── THE ORDER IS THE CHAIN'S OWN ──
//
// Resources first, then the binding: the application, then the firewall, then the
// environment they land in, the deployment the release is cut against, the release itself,
// and only then the WORKLOAD — which is the thing that ties an address to all of it. This
// used to run the other way round, registering the workload first and cutting the release
// last, which narrated a public address existing several seconds before anything could
// answer on it. It also meant a failure in the application — by far the likeliest one —
// was reported after a workload and a domain had already been provisioned for it.
//
// ── EVERY RESOURCE ROW HAS TWO STORIES ──
//
// A create that MADE a resource and one that reused an existing one are different work with
// different failures: a new application cannot collide with a version that is still
// building, and an existing one cannot fail to be created. So each of the three resource
// rows narrates the branch the reader actually took, rather than one row that covers both.
//
// `failLogs` is the step's WHOLE output when it is the one that fails — never an error
// appended to the success log, which would leave a "successfully" line sitting above the
// error that contradicts it.

import { AZION_DOMAIN_SUFFIX } from '@shared/lib/provisioning'

// The suffix every Azion-provided workload domain carries. It lives in the shared
// provisioning module because the CHAIN mints domains too (a template deploy is given one
// rather than asked for it), and a console-side literal would let the wizard's preview and
// the chain it provisions name different hostnames. Re-exported here because this is the
// module the console's workload surfaces already read.
export { AZION_DOMAIN_SUFFIX }

/** The domain a workload name produces. One derivation, used by the wizard and the logs. */
export const domainForWorkload = (name) => {
  const slug = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug ? `${slug}${AZION_DOMAIN_SUFFIX}` : ''
}

/**
 * The pipeline for one workload create.
 *
 * It is BUILT, not a constant, because every row depends on what the reader answered: the
 * firewall row only exists when they asked for protection, and each resource row narrates
 * whether it was created or reused. A fixed model would have had to narrate a firewall bind
 * on a workload with no firewall — a log line claiming work that never ran, which is the one
 * thing a log must never do.
 *
 * @param {object} input
 * @param {string} input.workload      The workload's name.
 * @param {string} input.domain        The address it answers on.
 * @param {string} [input.application] The application the release serves.
 * @param {boolean} [input.applicationExisting] True when an application is REUSED.
 * @param {boolean} [input.protected]  Whether a firewall stands in front of the workload.
 * @param {string} [input.firewall]    Which firewall, when protected.
 * @param {boolean} [input.firewallBound] True when an EXISTING firewall is bound.
 * @param {string} [input.environment] The environment the binding lands on.
 * @param {string} [input.deployment]  The deployment the release is cut against.
 * @param {boolean} [input.deploymentExisting] True when a deployment is REUSED.
 * @returns {Array<object>} The step model for DeploymentFlow / DeploymentLogs.
 */
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
    // 1. THE APPLICATION. Reused, it only has to be checked for a version that can serve;
    // created, it has to be built before anything downstream can bind it.
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
          title: 'Create application',
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

  // 2. THE FIREWALL — only when the reader asked for protection. A log that narrates a
  // firewall bind on an unprotected workload is a log that lies.
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
            title: 'Create firewall',
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
    // 3. THE ENVIRONMENT. Resolved rather than created: it almost always exists, and the
    // row is here because "almost always" is not always — an account without Production
    // gets one, and gets told.
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
    // 4. THE DEPLOYMENT the release is cut against.
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
          title: 'Create deployment',
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
    // 5. THE RELEASE — where the resources above are actually composed into something that
    // can serve.
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
    // 6. THE WORKLOAD — the address, and the certificate that serves it. Last, because it
    // is the row that binds everything above to a public hostname; provisioning it first
    // would announce an address that answers nothing.
    {
      key: 'workload',
      title: 'Create workload',
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
    // 7. THE EDGE. Everything above exists in the API; this is the row that makes it true
    // for traffic.
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
