import { AZION_DEPLOY_STEPS, consoleDeploysFor } from '@shared/lib/azion-deploys'

export const deployInFlight = (workloadId) =>
  consoleDeploysFor(workloadId).find((deploy) => deploy.status === 'Building')

export const liveConsoleDeploy = (workloadId, environment = '') =>
  consoleDeploysFor(workloadId).find(
    (deploy) =>
      deploy.status === 'Ready' &&
      deploy.current &&
      (!environment || deploy.environment === environment)
  )

export const deployStepTitle = (deploy) =>
  AZION_DEPLOY_STEPS.find((step) => step.key === deploy?.activeStep)?.title ?? ''
