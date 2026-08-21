// THE WORKLOAD PROVISIONING PIPELINE — the steps the create wizard's final run streams
// through ../../components/deployment/DeploymentFlow.vue.
//
// Same shape as the template-deploy model (../../../shared/ui/deployment/deployment-steps.js):
// one entry per stage that can FAIL ON ITS OWN, each owning its slice of the log. That rule
// is what makes the rows worth reading — a certificate rejected by the CA and a firewall
// that cannot bind are different problems with different fixes, so they are different rows.
// A row that bundled them could only report that "something in there" broke.
//
// WHY A WORKLOAD NEEDS ITS OWN MODEL. The template pipeline mints a Git token, clones a
// repository, installs and builds. A workload create does none of that: there is no code
// in it. It registers the workload, provisions the domain the name produced, issues the
// certificate, optionally binds a firewall, and cuts the release that makes the whole
// thing serve. Reusing the deploy's steps would have narrated work that never happened.
//
// `failLogs` is the step's WHOLE output when it is the one that fails — never an error
// appended to the success log, which would leave a "successfully" line sitting above the
// error that contradicts it.

/** The domain a workload name produces. One derivation, used by the wizard and the logs. */
export const domainForWorkload = (name) => {
  const slug = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug ? `${slug}.map.azionedge.net` : ''
}

/**
 * The pipeline for one workload create.
 *
 * It is BUILT, not a constant, because two of its rows depend on what the reader answered:
 * the firewall step only exists when they asked for protection, and the domain step names
 * the domain their workload name produced. A fixed model would have had to narrate a
 * firewall bind on a workload with no firewall — a log line claiming work that never ran,
 * which is the one thing a log must never do.
 *
 * @param {object} input
 * @param {string} input.name        The workload's name.
 * @param {boolean} [input.protected] Whether a firewall is in front of the workload.
 * @param {string} [input.firewall]  Which firewall, when protected.
 * @param {boolean} [input.firewallBound] True when an EXISTING firewall is bound; false
 *   when the create makes a new one. Creating and binding are different work, so the row
 *   narrates the one that runs.
 * @param {string} [input.application] The application the release serves.
 * @returns {Array<object>} The step model for DeploymentFlow / DeploymentLogs.
 */
export function workloadProvisioningSteps({
  name = 'workload',
  protected: isProtected = false,
  firewall = '',
  firewallBound = true,
  application = ''
} = {}) {
  const domain = domainForWorkload(name) || 'workload.map.azionedge.net'

  const steps = [
    {
      key: 'workload',
      title: 'Create workload',
      description: 'Workload registered',
      duration: 2,
      logs: [
        ['13:47:33', '[TASK] - #. Provisioning started successfully!'],
        ['13:47:33', `[TASK] - #. Creating workload "${name}"!`],
        ['13:47:34', 'POST /v4/workspace/workloads 201 Created'],
        ['13:47:35', '[TASK] - #. Workload created successfully!']
      ],
      failLogs: [
        ['13:47:33', '[TASK] - #. Provisioning started successfully!'],
        ['13:47:33', `[TASK] - #. Creating workload "${name}"!`],
        ['13:47:34', '[ERROR] - # Could not create the workload'],
        ['13:47:34', `409 Conflict: a workload named "${name}" already exists`],
        ['13:47:35', '[ERROR] - # Provisioning aborted.']
      ]
    },
    {
      key: 'domain',
      title: 'Provision domain',
      description: domain,
      duration: 4,
      logs: [
        ['13:47:36', '[TASK] - #. Reserving the Azion domain!'],
        ['13:47:37', `${domain} reserved`],
        ['13:47:39', '[TASK] - #. Publishing DNS records!'],
        ['13:47:40', '[TASK] - #. Domain provisioned successfully!']
      ],
      failLogs: [
        ['13:47:36', '[TASK] - #. Reserving the Azion domain!'],
        ['13:47:37', '[ERROR] - # Could not reserve the domain'],
        ['13:47:38', `409 Conflict: ${domain} is already in use`],
        ['13:47:39', '[ERROR] - # Provisioning aborted.']
      ]
    },
    {
      key: 'tls',
      title: 'Issue certificate',
      description: 'TLS 1.2, Azion SAN',
      duration: 5,
      logs: [
        ['13:47:41', '[TASK] - #. Requesting the certificate!'],
        ['13:47:43', 'Azion SAN · TLS 1.2 minimum'],
        ['13:47:45', '[TASK] - #. Certificate issued and bound!']
      ],
      failLogs: [
        ['13:47:41', '[TASK] - #. Requesting the certificate!'],
        ['13:47:43', '[ERROR] - # The certificate authority rejected the request'],
        ['13:47:44', `CAA lookup failed for ${domain}`],
        ['13:47:45', '[ERROR] - # Provisioning aborted.']
      ]
    }
  ]

  // Only when the reader asked for protection. A log that narrates a firewall bind on an
  // unprotected workload is a log that lies.
  if (isProtected) {
    // The row says which of the two happened. A create that MADE the firewall and one that
    // bound an existing one are different work with different failures — a new firewall
    // cannot collide with another environment, and an existing one cannot fail to be
    // created — so neither the title nor the logs pretend to cover both.
    steps.push(
      firewallBound
        ? {
            key: 'firewall',
            title: 'Bind firewall',
            description: firewall || 'Firewall bound',
            duration: 3,
            logs: [
              ['13:47:46', `[TASK] - #. Binding "${firewall}" to the workload!`],
              ['13:47:47', 'Rule set compiled · 0 warnings'],
              ['13:47:48', '[TASK] - #. Firewall bound successfully!']
            ],
            failLogs: [
              ['13:47:46', `[TASK] - #. Binding "${firewall}" to the workload!`],
              ['13:47:47', '[ERROR] - # Could not bind the firewall'],
              ['13:47:48', `422 Unprocessable: "${firewall}" is bound to another environment`],
              ['13:47:49', '[ERROR] - # Provisioning aborted.']
            ]
          }
        : {
            key: 'firewall',
            title: 'Create firewall',
            description: firewall || 'Firewall created',
            duration: 3,
            logs: [
              ['13:47:46', `[TASK] - #. Creating firewall "${firewall}"!`],
              ['13:47:47', 'Modules enabled · rule set compiled'],
              ['13:47:48', '[TASK] - #. Firewall created and bound successfully!']
            ],
            failLogs: [
              ['13:47:46', `[TASK] - #. Creating firewall "${firewall}"!`],
              ['13:47:47', '[ERROR] - # Could not create the firewall'],
              ['13:47:48', `409 Conflict: a firewall named "${firewall}" already exists`],
              ['13:47:49', '[ERROR] - # Provisioning aborted.']
            ]
          }
    )
  }

  steps.push(
    {
      key: 'release',
      title: 'Cut release',
      description: application ? `Serving ${application}` : 'Release created',
      duration: 4,
      logs: [
        ['13:47:50', '[TASK] - #. Composing the release!'],
        ['13:47:51', application ? `application: ${application}` : 'application: none bound yet'],
        ['13:47:52', isProtected ? `firewall: ${firewall}` : 'firewall: not bound'],
        ['13:47:53', '[TASK] - #. Release created successfully!']
      ],
      failLogs: [
        ['13:47:50', '[TASK] - #. Composing the release!'],
        ['13:47:52', '[ERROR] - # Could not create the release'],
        ['13:47:52', '422 Unprocessable: the environment has nothing to serve'],
        ['13:47:53', '[ERROR] - # Provisioning aborted.']
      ]
    },
    {
      key: 'propagate',
      title: 'Propagate to the edge',
      description: 'Live on every edge location',
      duration: 6,
      logs: [
        ['13:47:54', '[TASK] - #. Propagating the release!'],
        ['13:47:57', 'Edge locations updated'],
        ['13:47:59', `[TASK] - #. https://${domain} is live!`],
        ['13:48:00', '[TASK] - #. Provisioning completed successfully!']
      ],
      failLogs: [
        ['13:47:54', '[TASK] - #. Propagating the release!'],
        ['13:47:58', '[ERROR] - # Propagation did not complete'],
        ['13:47:59', 'Timed out waiting for 3 edge locations'],
        ['13:48:00', '[ERROR] - # Provisioning aborted.']
      ]
    }
  )

  return steps
}
