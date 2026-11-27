<script setup>
  import Avatar from '@aziontech/ui/avatar'
  import HoverCard from '@aziontech/ui/hover-card'
  import Link from '@aziontech/ui/link'
</script>

<template>
  <p class="text-body-sm text-(--text-default)">
    Deployed by
    <HoverCard>
      <HoverCard.Trigger>
        <Link
          href="https://example.com/people/jane-doe"
          label="Jane Doe"
          size="small"
        />
      </HoverCard.Trigger>
      <HoverCard.Content>
        <div class="flex items-center gap-(--spacing-sm)">
          <Avatar label="Jane Doe" />
          <div class="flex flex-col">
            <span class="text-label-md text-(--text-default)">Jane Doe</span>
            <span class="text-body-sm text-(--text-muted)">jane.doe@example.com</span>
          </div>
        </div>
        <p class="text-body-sm text-(--text-default)">
          Owner of production and staging. Joined Acme in March 2024.
        </p>
      </HoverCard.Content>
    </HoverCard>
    two hours ago.
  </p>
</template>
