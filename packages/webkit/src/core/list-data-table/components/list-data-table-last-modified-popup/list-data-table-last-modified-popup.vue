<script setup>
  import { computed } from 'vue'

  defineOptions({ name: 'DataTableLastModifiedPopup' })

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    lastEditor: {
      type: String,
      required: true
    },
    lastModified: {
      type: String,
      required: true
    },
    position: {
      type: Object,
      default: () => ({ posX: 0, posY: 0 })
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    accountTimezone: {
      type: String,
      default: ''
    }
  })

  const displayAccountTimezone = computed(() => {
    return props.accountTimezone || props.timezone
  })

  const popupStyle = computed(() => ({
    left: `${props.position.posX - 320}px`,
    top: `${props.position.posY}px`
  }))

  const formatDate = (dateString, timeZone) => {
    if (!dateString) return ''

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone
      }).format(date)
    } catch {
      return dateString
    }
  }

  const getTimezoneOffset = (timeZone) => {
    if (!timeZone || timeZone === 'UTC') return 'UTC'

    try {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'shortOffset'
      })
      const parts = formatter.formatToParts(now)
      const offsetPart = parts.find((part) => part.type === 'timeZoneName')
      return offsetPart ? offsetPart.value : timeZone
    } catch {
      return timeZone
    }
  }
</script>

<template>
  <div
    v-if="visible"
    class="absolute z-50 bg-[var(--menu-bg)] border border-[var(--surface-border)] rounded-md px-3 py-2 max-w-xs"
    :style="popupStyle"
    data-testid="data-table-last-modified-popup"
  >
    <div class="flex flex-col text-xs space-y-1">
      <span v-if="lastEditor && lastEditor !== '-'">Last edited by {{ lastEditor }}</span>
      <div class="flex items-center gap-1">
        <span class="px-2 py-1 rounded-sm bg-[var(--surface-border)]">UTC</span>
        <span>{{ formatDate(lastModified, 'UTC') }}</span>
      </div>
      <div
        v-if="displayAccountTimezone && displayAccountTimezone !== 'UTC'"
        class="flex items-center gap-1"
      >
        <span class="px-2 py-1 rounded-sm bg-[var(--surface-border)]">{{
          getTimezoneOffset(displayAccountTimezone)
        }}</span>
        <span>{{ formatDate(lastModified, displayAccountTimezone) }}</span>
      </div>
    </div>
  </div>
</template>
