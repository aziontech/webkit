<script setup>
  import Tracker from '@aziontech/webkit/tracker'
  import { useLocale } from '@aziontech/webkit/use-locale'

  const DAYS = 90
  const DEGRADED_DAY = 52
  const OUTAGE_DAY = 73

  const { formatDate } = useLocale()

  const dayOf = (index) => new Date(Date.UTC(2026, 10, 10 - (DAYS - 1 - index)))
  const shortDate = (date) => formatDate(date, { month: 'short', day: 'numeric', timeZone: 'UTC' })

  const days = Array.from({ length: DAYS }, (_, index) => {
    const date = dayOf(index)
    const id = date.toISOString().slice(0, 10)
    const day = shortDate(date)
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
    <div
      aria-hidden="true"
      class="mt-(--spacing-xs) flex justify-between text-label-sm text-(--text-muted)"
    >
      <span>{{ shortDate(dayOf(0)) }}</span>
      <span>{{ shortDate(dayOf(DAYS - 1)) }}</span>
    </div>
  </div>
</template>
