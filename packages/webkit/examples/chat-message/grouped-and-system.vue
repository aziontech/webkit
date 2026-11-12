<script setup>
  import ArtifactPreview from '@aziontech/webkit/artifact-preview'
  import ChatMessage from '@aziontech/webkit/chat-message-root'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-lg)">
    <ChatMessage from="system">Conversation restarted with the context of storefront.</ChatMessage>
    <ChatMessage timestamp="11:02">
      <StreamingResponse content="I generated the cache rules you asked for." />
    </ChatMessage>
    <ChatMessage grouped>
      <ArtifactPreview
        title="cache-rules.json"
        meta="1 KB · JSON"
        icon="pi pi-code"
        copy-value='{ "edge_cache_ttl": 86400 }'
      />
    </ChatMessage>
  </div>
</template>
