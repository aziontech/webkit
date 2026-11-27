<script setup>
  import HelpPanel from '@aziontech/ui/help-panel'
  import Link from '@aziontech/ui/link'
</script>

<template>
  <div class="max-w-(--container-xs)">
    <HelpPanel aria-label="Help: Cache settings">
      <HelpPanel.Header
        title="Cache settings"
        description="How long content stays at the edge before it is fetched again."
      />
      <HelpPanel.Group label="What does the cache TTL control?">
        <p>
          The TTL sets how many seconds an object is served from the edge before the origin is asked
          for a fresh copy.
        </p>
      </HelpPanel.Group>
      <HelpPanel.Group label="When should I bypass the cache?">
        <p>Bypass it for responses that change per user, such as carts and account pages.</p>
      </HelpPanel.Group>
      <HelpPanel.Footer>
        <Link
          label="Cache settings documentation"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
        <Link
          label="Purging cached content"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
      </HelpPanel.Footer>
    </HelpPanel>
  </div>
</template>
