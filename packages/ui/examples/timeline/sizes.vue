<script setup>
  import Timeline from '@aziontech/ui/timeline'

  const sizes = ['small', 'medium']
</script>

<template>
  <div class="grid w-full gap-(--spacing-lg) md:grid-cols-2">
    <Timeline
      v-for="size in sizes"
      :key="size"
      :size="size"
      :aria-label="`Ticket activity, ${size}`"
    >
      <Timeline.Item
        title="Ticket solved"
        severity="success"
        actor="Sam Lee"
        time="2026-11-21T16:00:00Z"
      />
      <Timeline.Item
        title="Assigned to Sam Lee"
        actor="Jane Doe"
        time="2026-11-21T13:10:00Z"
      />
      <Timeline.Item
        title="Ticket opened"
        description="Duplicate charge on the November invoice."
        actor="Alex Morgan"
        time="2026-11-21T13:00:00Z"
      />
    </Timeline>
  </div>
</template>
