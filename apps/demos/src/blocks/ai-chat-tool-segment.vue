<script setup lang="ts">
  import AgentQuestion from '@aziontech/ui/agent-question'
  import CodeBlock from '@aziontech/ui/code-block'
  import ImageGallery from '@aziontech/ui/image-gallery'
  import ToolApproval from '@aziontech/ui/tool-approval'
  import ToolCall from '@aziontech/ui/tool-call'
  import {
    type AiChatQuestion,
    type AiChatTool,
    type AiChatToolCallPart,
    type AiChatToolResultPart,
    answerable,
    approvalOf,
    json,
    needsApproval,
    parsesAsJson,
    toolContentOf,
    toolStatusOf
  } from '@aziontech/ui/utils/ai-chat'

  defineProps<{
    call: AiChatToolCallPart
    result?: AiChatToolResultPart
    tool: AiChatTool
    ask: AiChatQuestion
    edit: string
    busy: boolean
  }>()

  const emit = defineEmits<{
    answer: [event: Event, value: string]
    edit: [text: string]
    approve: [event: MouseEvent, text: string]
    deny: [event: MouseEvent]
  }>()

  const answer = defineModel<string>('answer')
</script>

<template>
  <AgentQuestion
    v-if="answerable(tool, call, result)"
    v-model="answer"
    :title="ask.title"
    :type="ask.options.length ? 'choice' : 'text'"
    :options="ask.options"
    :status="ask.status"
    @submit="(event, value) => emit('answer', event, value)"
  />
  <template v-else>
    <ToolApproval
      v-if="needsApproval(call)"
      :title="tool.question || tool.title || `Run ${call.name}?`"
      :description="tool.description"
      :approve-label="tool.approveLabel"
      :variant="tool.variant"
      :confirmation-phrase="tool.confirmationPhrase"
      :status="approvalOf(call)"
      :loading="busy"
      :editable="tool.editable"
      :invalid="tool.editable && !parsesAsJson(edit)"
      :model-value="edit"
      @update:model-value="(text) => emit('edit', text)"
      @approve="(event, text) => emit('approve', event, text)"
      @deny="emit('deny', $event)"
    >
      <CodeBlock
        v-if="!tool.editable && json(call.input ?? call.arguments)"
        :code="json(call.input ?? call.arguments)"
        language="json"
        :show-line-numbers="false"
      />
    </ToolApproval>
    <ToolCall
      v-if="!needsApproval(call) || approvalOf(call) === 'approved'"
      :name="call.name"
      :title="tool.title"
      :status="toolStatusOf(call, result)"
    >
      <template
        v-if="json(call.input ?? call.arguments)"
        #input
      >
        <CodeBlock
          :code="json(call.input ?? call.arguments)"
          language="json"
          :show-line-numbers="false"
        />
      </template>
      <template
        v-if="!result?.error && call.output === undefined && toolContentOf(result?.content)"
        #output
      >
        <p
          v-if="toolContentOf(result?.content)?.text"
          class="whitespace-pre-line text-body-sm text-(--text-default)"
        >
          {{ toolContentOf(result?.content)?.text }}
        </p>
        <ImageGallery
          v-if="toolContentOf(result?.content)?.images.length"
          :items="toolContentOf(result?.content)?.images ?? []"
        />
      </template>
      <template
        v-else-if="json(result?.error || call.output || result?.content)"
        #output
      >
        <CodeBlock
          :code="json(result?.error || call.output || result?.content)"
          language="json"
          :show-line-numbers="false"
        />
      </template>
    </ToolCall>
  </template>
</template>
