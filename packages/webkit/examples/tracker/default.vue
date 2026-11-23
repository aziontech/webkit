<script setup>
  import Tracker from '@aziontech/webkit/tracker'
  import { useLocale } from '@aziontech/webkit/use-locale'

  const DAYS = 90
  const DEGRADED_DAY = 52
  const OUTAGE_DAY = 73

  const { formatDate } = useLocale()

  const days = Array.from({ length: DAYS }, (_, index) => {
    const date = new Date(Date.UTC(2026, 10, 10 - (DAYS - 1 - index)))
    const id = date.toISOString().slice(0, 10)
    const day = formatDate(date, {
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
      aria-label="Application uptime, last 90 days"
      :items="days"
    />
  </div>
</template>
