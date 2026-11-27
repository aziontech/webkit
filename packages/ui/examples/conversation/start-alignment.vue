<script setup>
  import ChatMessageRoot from '@aziontech/ui/chat-message-root'
  import Conversation from '@aziontech/ui/conversation'
  import StreamingResponse from '@aziontech/ui/streaming-response'
  import SuggestionGroup from '@aziontech/ui/suggestion-group'

  const followUps = [
    { id: 'wildcard', label: 'How do I purge a whole folder?' },
    { id: 'ttl', label: 'What TTL should my images use?' }
  ]
</script>

<template>
  <div
    class="flex h-[28rem] w-full max-w-(--container-xs) flex-col rounded-(--shape-card) border border-(--border-default)"
  >
    <Conversation layout="start">
      <ChatMessageRoot
        from="user"
        timestamp="10:41"
      >
        How do I purge the cache of one URL?
      </ChatMessageRoot>
      <ChatMessageRoot timestamp="10:41">
        <StreamingResponse
          content="Open **Real-Time Purge**, choose *URL* as the purge type and paste the address."
        />
      </ChatMessageRoot>
      <ChatMessageRoot
        from="user"
        timestamp="10:43"
      >
        Can I do it from the CLI?
      </ChatMessageRoot>
      <ChatMessageRoot timestamp="10:43">
        <StreamingResponse
          :content="'Yes:\n\n```bash\nazion purge urls --urls https://www.example.com/styles.css\n```'"
        />
      </ChatMessageRoot>
      <SuggestionGroup
        :items="followUps"
        aria-label="Follow-up questions"
      />
    </Conversation>
  </div>
</template>
