<script setup>
  // AiAgentsScene — "your agents build here": the AI coding agents on the left, gathered onto
  // one spine, into Azion, and out as a running conversation.
  //
  // The drawing is the official `ai-applications` scene from the illustration library, not a
  // composition: webkit's Illustration renders artwork design signed off in Figma and has no
  // way to assemble one out of markup. The agent brand marks the earlier hand-composed version
  // carried are not part of that artwork — AgentMark still paints them wherever a page needs
  // the logos themselves, which is a list of vendors rather than a drawing.
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <Illustration
    name="ai-applications"
    aria-label="Coding agents building on Azion, and the running application they produce"
    class="shrink-0"
  />
</template>
