<script setup>
  import ArtifactPreview from '@aziontech/ui/artifact-preview'
  import ChatMessageRoot from '@aziontech/ui/chat-message-root'
  import StreamingResponse from '@aziontech/ui/streaming-response'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-lg)">
    <ChatMessageRoot from="system"
      >Conversation restarted with the context of storefront.</ChatMessageRoot
    >
    <ChatMessageRoot timestamp="11:02">
      <StreamingResponse content="I generated the cache rules you asked for." />
    </ChatMessageRoot>
    <ChatMessageRoot grouped>
      <ArtifactPreview
        title="cache-rules.json"
        meta="1 KB · JSON"
        icon="az az-code"
        copy-value='{ "edge_cache_ttl": 86400 }'
      />
    </ChatMessageRoot>
  </div>
</template>
