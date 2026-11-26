<script setup>
  import HoverCard from '@aziontech/webkit/hover-card'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <p class="text-body-sm text-(--text-default)">
    Deployed by
    <HoverCard disabled>
      <HoverCard.Trigger>
        <Link
          href="https://example.com/people/jane-doe"
          label="Jane Doe"
          size="small"
        />
      </HoverCard.Trigger>
      <HoverCard.Content>
        <p class="text-body-sm text-(--text-default)">Owner of production.</p>
      </HoverCard.Content>
    </HoverCard>
    two hours ago.
  </p>
</template>
