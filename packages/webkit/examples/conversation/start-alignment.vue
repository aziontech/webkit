<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message'
  import Conversation from '@aziontech/webkit/conversation'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'

  const followUps = [
    { id: 'wildcard', label: 'How do I purge a whole folder?' },
    { id: 'ttl', label: 'What TTL should my images use?' }
  ]
</script>

<template>
  <div
    class="flex h-[28rem] w-full max-w-(--container-xs) flex-col rounded-(--shape-card) border border-(--border-default)"
  >
    <Conversation alignment="start">
      <ChatMessage
        from="user"
        timestamp="10:41"
      >
        How do I purge the cache of one URL?
      </ChatMessage>
      <ChatMessage timestamp="10:41">
        <StreamingResponse
          content="Open **Real-Time Purge**, choose *URL* as the purge type and paste the address."
        />
      </ChatMessage>
      <ChatMessage
        from="user"
        timestamp="10:43"
      >
        Can I do it from the CLI?
      </ChatMessage>
      <ChatMessage timestamp="10:43">
        <StreamingResponse
          :content="'Yes:\n\n```bash\nazion purge urls --urls https://www.example.com/styles.css\n```'"
        />
      </ChatMessage>
      <SuggestionGroup
        :items="followUps"
        aria-label="Follow-up questions"
      />
    </Conversation>
  </div>
</template>
