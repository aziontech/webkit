<script setup>
  import Tracker from '@aziontech/webkit/tracker'

  const DAYS = 90
  const DEGRADED_DAY = 52
  const OUTAGE_DAY = 73

  const days = Array.from({ length: DAYS }, (_, index) => {
    const date = new Date(Date.UTC(2026, 10, 10 - (DAYS - 1 - index)))
    const id = date.toISOString().slice(0, 10)
    const day = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    })
    if (index === DAYS - 1) return { id, label: `${day} · No data` }
    if (index === OUTAGE_DAY) return { id, severity: 'danger', label: `${day} · Partial outage` }
    if (index === DEGRADED_DAY)
      return { id, severity: 'warning', label: `${day} · Degraded performance` }
    return { id, severity: 'success', label: `${day} · Operational` }
  })
</script>

<template>
  <div class="w-full max-w-(--container-xl) pt-(--spacing-xl)">
    <Tracker
      aria-label="Edge Application uptime, last 90 days"
      :items="days"
    />
  </div>
</template>
