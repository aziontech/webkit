<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message-root'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-lg)">
    <ChatMessage
      from="user"
      author="Ana Lima"
      timestamp="10:41"
    >
      How do I purge the cache of one URL?
    </ChatMessage>
    <ChatMessage timestamp="10:41">
      <StreamingResponse
        content="Open **Real-Time Purge**, choose *URL* as the purge type and paste the address. The purge reaches every edge location in a few seconds."
      />
    </ChatMessage>
  </div>
</template>
