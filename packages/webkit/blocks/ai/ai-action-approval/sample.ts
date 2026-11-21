import type {
  AiChatMessage,
  AiChatPart,
  AiChatTool,
  AiChatToolCallPart
} from '@aziontech/webkit/utils/ai-chat'

const at = (time: string): Date => new Date(`2026-11-19T${time}:00`)

const request = (id: string, text: string): AiChatMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', content: text }],
  createdAt: at('15:02')
})

const response = (id: string, parts: AiChatPart[]): AiChatMessage => ({
  id,
  role: 'assistant',
  parts,
  createdAt: at('15:02')
})

const deployInput = { workload: 'storefront', build: 'b-4821', environment: 'production' }

const readBuild: AiChatToolCallPart = {
  type: 'tool-call',
  id: 'call-build',
  name: 'get_build',
  arguments: JSON.stringify({ workload: 'storefront' }),
  input: { workload: 'storefront' },
  state: 'complete',
  output: { build: 'b-4821', checks: 'passed', finishedAt: '14:56' }
}

const explanation: AiChatPart = {
  type: 'text',
  content: 'Build `b-4821` passed its checks 6 minutes ago. Deploying it needs your approval.'
}

const deploy = (state: AiChatToolCallPart['state'], approved?: boolean): AiChatToolCallPart => ({
  type: 'tool-call',
  id: 'call-deploy',
  name: 'deploy_workload',
  arguments: JSON.stringify(deployInput),
  input: deployInput,
  state,
  approval: { id: 'approval-deploy', needsApproval: true, approved }
})

const deployRequest = request('m1', 'Deploy the current build of storefront to production')

export const sampleTools: Record<string, AiChatTool> = {
  get_build: { title: 'Reading the latest build of storefront' },
  deploy_workload: {
    title: 'Deploying storefront to production',
    question: 'Allow `deploy_workload` on production?',
    description:
      'Deploys build `b-4821` of storefront to production. The current version stays available for rollback.',
    approveLabel: 'Deploy'
  },
  get_domain_traffic: { title: 'Reading the traffic of old.example.com' },
  delete_domain: {
    title: 'Deleting old.example.com',
    question: 'Delete the domain `old.example.com`?',
    description:
      'The domain stops answering at once and its certificate is revoked. This cannot be undone.',
    approveLabel: 'Delete',
    variant: 'danger',
    confirmationPhrase: 'old.example.com'
  }
}

export const sampleMessages: AiChatMessage[] = [
  deployRequest,
  response('m2', [readBuild, explanation, deploy('approval-requested')])
]

export const sampleRunningMessages: AiChatMessage[] = [
  deployRequest,
  response('m2', [readBuild, explanation, deploy('approval-responded', true)])
]

export const sampleApprovedMessages: AiChatMessage[] = [
  deployRequest,
  response('m2', [
    readBuild,
    explanation,
    { ...deploy('complete', true), output: { status: 'live', build: 'b-4821' } },
    {
      type: 'text',
      content:
        'storefront is live on production with build `b-4821`. The previous version `b-4790` stays available for rollback.'
    }
  ])
]

export const sampleDeniedMessages: AiChatMessage[] = [
  deployRequest,
  response('m2', [
    readBuild,
    explanation,
    deploy('approval-responded', false),
    {
      type: 'tool-result',
      toolCallId: 'call-deploy',
      content: '',
      state: 'error',
      outcome: 'denied'
    },
    {
      type: 'text',
      content: 'Got it, nothing was deployed. Build `b-4821` stays ready if you change your mind.'
    }
  ])
]

export const sampleFailedMessages: AiChatMessage[] = [
  deployRequest,
  response('m2', [
    readBuild,
    explanation,
    deploy('error', true),
    {
      type: 'tool-result',
      toolCallId: 'call-deploy',
      content: '',
      state: 'error',
      error: 'Upload to the edge failed: connection reset.'
    },
    {
      type: 'text',
      content:
        'The deployment of build `b-4821` failed while uploading the build to the edge. Nothing changed: production still serves the previous version `b-4790`.'
    }
  ])
]

export const sampleDeleteMessages: AiChatMessage[] = [
  request('m1', 'Delete the domain old.example.com, nobody uses it anymore'),
  response('m2', [
    {
      type: 'tool-call',
      id: 'call-traffic',
      name: 'get_domain_traffic',
      arguments: JSON.stringify({ domain: 'old.example.com', days: 30 }),
      input: { domain: 'old.example.com', days: 30 },
      state: 'complete',
      output: { requests: 0 }
    },
    {
      type: 'text',
      content:
        'old.example.com had no requests in the last 30 days. Deleting it needs your approval, and you need to type its name.'
    },
    {
      type: 'tool-call',
      id: 'call-delete',
      name: 'delete_domain',
      arguments: JSON.stringify({ domain: 'old.example.com' }),
      input: { domain: 'old.example.com' },
      state: 'approval-requested',
      approval: { id: 'approval-delete', needsApproval: true }
    }
  ])
]
