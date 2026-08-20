// THE CONFIGURED-TEMPLATE PIPELINE — what an AZION template's run actually does.
//
// The template-deploy model (../../../shared/ui/deployment/deployment-steps.js) is the
// GITHUB story: mint a token, clone the starter into the reader's scope, install, build,
// upload the bundle, then wire the repository secret. That is exactly right for a
// framework starter and wrong in every row for an Azion template, which is CONFIGURED
// rather than cloned (./templates.js → `requiresRepository`): there is no repository to
// clone into, no package.json to install, no bundle to build, and no repository secret to
// set at the end. Streaming that pipeline for Azion Proxy would narrate six stages of work
// that never ran — the one thing a log must never do, and the same reason a workload
// create has its own model (./workload-provisioning.js) instead of borrowing the deploy's.
//
// So this is the short version, built from the three shared rows that are still TRUE
// (the token, the application, the rules) plus the two this kind of run owns: the
// settings being applied, and a publish that publishes a configuration rather than a
// repository. Reusing the shared rows keeps their logs and their failure output in one
// place; only what differs is written here.
//
// `rules` is kept and keeps its key, because it is the step DeploymentFlow fails on by
// default (`failStep`) and the recoverable failure it names has nothing to do with code.
import { DEFAULT_DEPLOYMENT_STEPS } from '@shared/ui/deployment/deployment-steps'

const shared = (key) => DEFAULT_DEPLOYMENT_STEPS.find((step) => step.key === key)

/**
 * The pipeline for one Azion-template run.
 *
 * BUILT, not a constant, because the configuration row names the settings the reader
 * actually filled in — a fixed model would have had to print a generic line, and the
 * whole point of this run is that those settings ARE the deploy.
 *
 * @param {object} input
 * @param {string} input.title       The template's name, e.g. "Azion Proxy".
 * @param {string[]} input.settings  The labels of the settings the reader answered.
 */
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
