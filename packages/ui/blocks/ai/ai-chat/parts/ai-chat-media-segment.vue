<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AudioPlayer from '@aziontech/webkit/audio-player'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FilePreview from '@aziontech/webkit/file-preview'
  import ImageGallery from '@aziontech/webkit/image-gallery'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SubagentCard from '@aziontech/webkit/subagent-card'
  import {
    type AiChatSegment,
    documentNameOf,
    json,
    stopSubagent,
    structuredOf,
    subagentStatusOf,
    subagentTextOf
  } from '@aziontech/webkit/utils/ai-chat'
  import VideoPlayer from '@aziontech/webkit/video-player'

  defineProps<{ segment: AiChatSegment }>()
</script>

<template>
  <ImageGallery
    v-if="segment.type === 'gallery'"
    :items="segment.images"
  />
  <AudioPlayer
    v-else-if="segment.type === 'audio'"
    :src="segment.src"
  />
  <VideoPlayer
    v-else-if="segment.type === 'video'"
    :src="segment.src"
    :mime-type="segment.mimeType"
  />
  <FilePreview
    v-else-if="segment.type === 'document'"
    :file-name="documentNameOf(segment.part)"
    :mime-type="segment.part.source.mimeType"
    :src="segment.part.source.type === 'url' ? segment.part.source.value : ''"
    :base64="segment.part.source.type === 'data' ? segment.part.source.value : ''"
  />
  <SubagentCard
    v-else-if="segment.type === 'subagent'"
    :name="segment.part.subagent.name"
    :title="segment.part.subagent.description"
    :description="segment.part.subagent.error?.message"
    :status="subagentStatusOf(segment.part)"
    :stoppable="typeof segment.part.subagent.stop === 'function'"
    @stop="stopSubagent(segment.part)"
  >
    <StreamingResponse
      v-if="subagentTextOf(segment.part)"
      :content="subagentTextOf(segment.part)"
    />
    <template
      v-if="json(segment.part.subagent.input)"
      #input
    >
      <CodeBlock
        :code="json(segment.part.subagent.input)"
        language="json"
        :show-line-numbers="false"
      />
    </template>
  </SubagentCard>
  <template v-else-if="segment.type === 'structured'">
    <Alert
      v-if="segment.part.status === 'error'"
      severity="danger"
      size="small"
      title="The structured answer failed"
    >
      {{ segment.part.errorMessage || 'The answer did not match the expected format.' }}
    </Alert>
    <CodeBlock
      v-else-if="structuredOf(segment.part)"
      :code="structuredOf(segment.part)"
      language="json"
      :show-line-numbers="false"
      :aria-busy="segment.part.status === 'streaming' || undefined"
    />
  </template>
</template>
