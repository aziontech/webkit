import type { AiActionApprovalAction, AiActionApprovalOutcome } from './ai-action-approval.vue'

export const sampleAction: AiActionApprovalAction = {
  request: 'Deploy the current build of storefront to production',
  time: '15:02',
  check: { name: 'get_build', title: 'Reading the latest build of storefront' },
  explanation: 'Build `b-4821` passed its checks 6 minutes ago. Deploying it needs your approval.',
  title: 'Allow `azion deploy --env production`?',
  description:
    'Deploys build `b-4821` of storefront to production. The current version stays available for rollback.',
  approveLabel: 'Deploy',
  command: 'azion deploy --workload storefront --build b-4821 --env production',
  run: { name: 'deploy_workload', title: 'Deploying storefront to production' }
}

export const sampleDeleteAction: AiActionApprovalAction = {
  request: 'Delete the domain old.example.com, nobody uses it anymore',
  time: '15:02',
  check: { name: 'get_domain_traffic', title: 'Reading the traffic of old.example.com' },
  explanation:
    'old.example.com had no requests in the last 30 days. Deleting it needs your approval, and you need to type its name.',
  title: 'Delete the domain `old.example.com`?',
  description:
    'The domain stops answering at once and its certificate is revoked. This cannot be undone.',
  approveLabel: 'Delete',
  command: 'azion delete domain --name old.example.com',
  variant: 'danger',
  confirmationPhrase: 'old.example.com',
  run: { name: 'delete_domain', title: 'Deleting old.example.com' }
}

export const sampleOutcomes: Record<
  'approved' | 'denied' | 'expired' | 'stopped' | 'failed',
  AiActionApprovalOutcome
> = {
  approved: {
    content:
      'storefront is live on production with build `b-4821`. The previous version `b-4790` stays available for rollback.',
    time: '15:04'
  },
  denied: {
    content: 'Got it, nothing was deployed. Build `b-4821` stays ready if you change your mind.',
    time: '15:04'
  },
  expired: { content: 'This request expired. Nothing was deployed.', time: '15:04' },
  stopped: {
    content:
      'You stopped the deployment before it finished. Production still serves the previous version `b-4790`.',
    time: '15:04'
  },
  failed: {
    content:
      'The deployment of build `b-4821` failed while uploading the build to the edge. Nothing changed: production still serves the previous version `b-4790`.',
    time: '15:04'
  }
}
