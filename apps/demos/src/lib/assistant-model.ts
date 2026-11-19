import { chat, chatParamsFromRequestBody, type ModelMessage, toolDefinition } from '@tanstack/ai'
import { type FakeResponse, type FakeResponseStep, fakeText } from '@tanstack/ai/testing'
import { stream } from '@tanstack/ai-vue'

import { answerFor } from './assistant'

export const deployWorkload = toolDefinition({
  name: 'deploy_workload',
  description: 'Deploy a build of a workload to an environment',
  needsApproval: true,
  inputSchema: {
    type: 'object',
    properties: {
      workload: { type: 'string' },
      build: { type: 'string' },
      environment: { type: 'string' }
    },
    required: ['workload', 'build', 'environment']
  }
})

const deployWorkloadServer = deployWorkload.server(async () => ({
  status: 'live',
  build: 'b-4821'
}))

const textOf = (message: ModelMessage | undefined): string =>
  typeof message?.content === 'string'
    ? message.content
    : (message?.content ?? []).map((part) => (part.type === 'text' ? part.content : '')).join('')

const reply: FakeResponseStep = ({ request }): FakeResponse => {
  const last = request.messages[request.messages.length - 1]
  if (last?.role === 'tool') {
    return /denied|cancel/i.test(JSON.stringify(last.content))
      ? {
          text: 'Got it, nothing was deployed. Build `b-4821` stays ready if you change your mind.'
        }
      : {
          text: 'storefront is live on production with build `b-4821`. The previous version `b-4790` stays available for rollback.'
        }
  }
  const question = textOf(
    [...request.messages].reverse().find((message) => message.role === 'user')
  )
  if (/deploy/i.test(question)) {
    return {
      thinking: 'The reader wants to deploy. Build b-4821 of storefront passed its checks.',
      text: 'Build `b-4821` passed its checks 6 minutes ago. Deploying it needs your approval.',
      toolCalls: [
        {
          name: 'deploy_workload',
          input: { workload: 'storefront', build: 'b-4821', environment: 'production' }
        }
      ]
    }
  }
  const answer = answerFor(question)
  return { thinking: answer.reasoning, text: answer.content }
}

const model = fakeText({ tokensPerSecond: 120 })

export const assistantConnection = stream(async function* (_messages, _data, _signal, input) {
  model.setResponses([reply, reply, reply])
  const params = await chatParamsFromRequestBody(input)
  yield* chat({
    adapter: model,
    messages: params.messages,
    threadId: params.threadId,
    runId: params.runId,
    parentRunId: params.parentRunId,
    ...(params.resume ? { resume: params.resume } : {}),
    tools: [deployWorkloadServer]
  })
})

export const assistantTools = {
  deploy_workload: {
    title: 'Deploying storefront to production',
    question: 'Allow `deploy_workload` on production?',
    description:
      'Deploys build `b-4821` of storefront to production. The current version stays available for rollback.',
    approveLabel: 'Deploy'
  }
}
