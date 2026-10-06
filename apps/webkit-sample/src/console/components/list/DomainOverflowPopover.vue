<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  interface Props {
    domains?: unknown[]
    count?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    domains: () => [],
    count: 0
  })

  const SEARCH_THRESHOLD = 10

  const PAGE_SIZE = 10

  const LOAD_LATENCY_MS = 420

  const WIRE_WIDTHS = ['92%', '74%', '86%', '68%', '90%', '78%', '84%', '70%', '88%', '76%']

  const open = ref(false)
  const query = ref('')
  const shown = ref(PAGE_SIZE)
  const loading = ref(false)

  let loadTimeoutId = null

  const searchable = computed(() => props.domains.length > SEARCH_THRESHOLD)

  const matches = computed(() => {
    const needle = query.value.trim().toLowerCase()
    if (!needle) return props.domains
    return props.domains.filter((domain) => domain.toLowerCase().includes(needle))
  })

  const visible = computed(() => matches.value.slice(0, shown.value))

  const remaining = computed(() => matches.value.length - visible.value.length)

  const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

  const summary = computed(() => {
    const total = props.domains.length
    if (remaining.value) {
      return query.value
        ? `${visible.value.length} of ${matches.value.length} matching domains`
        : `${visible.value.length} of ${total} domains`
    }
    return query.value ? `${matches.value.length} of ${total} domains` : `${total} domains`
  })

  const cancelLoad = () => {
    if (loadTimeoutId) clearTimeout(loadTimeoutId)
    loadTimeoutId = null
    loading.value = false
  }

  const loadMore = () => {
    if (loading.value || !remaining.value) return
    loading.value = true
    loadTimeoutId = setTimeout(() => {
      shown.value += PAGE_SIZE
      cancelLoad()
    }, LOAD_LATENCY_MS)
  }

  watch(open, (isOpen) => {
    if (isOpen) return
    query.value = ''
    shown.value = PAGE_SIZE
    cancelLoad()
  })

  watch(query, () => {
    shown.value = PAGE_SIZE
    cancelLoad()
  })

  onScopeDispose(cancelLoad)
</script>

<template>
  <Popover
    v-model:open="open"
    placement="bottom-start"
    width="small"
  >
    <Popover.Trigger @click.stop>
      <Tag
        :label="`+${count}`"
        severity="secondary"
        size="small"
        class="shrink-0 cursor-pointer"
      />
    </Popover.Trigger>

    <Popover.Content @click.stop>
      <div
        class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
      >
        <p class="text-label-sm text-(--text-muted)">
          {{ summary }}
        </p>
        <InputText
          v-if="searchable"
          v-model="query"
          size="medium"
          placeholder="Search domains"
          aria-label="Search domains"
        >
          <template #iconLeft>
            <i
              class="pi pi-search"
              aria-hidden="true"
            />
          </template>
        </InputText>
      </div>

      <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
        <a
          v-for="domain in visible"
          :key="domain"
          :href="`https://${domain}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline"
          @click.stop
        >
          <span class="truncate">{{ domain }}</span>
          <i
            class="pi pi-external-link ml-auto shrink-0 text-body-xs leading-none"
            aria-hidden="true"
          />
        </a>

        <div v-if="loading">
          <div
            v-for="index in nextBatch"
            :key="index"
            class="flex h-7 items-center px-(--spacing-xs)"
          >
            <Skeleton
              height="var(--size-3)"
              :width="WIRE_WIDTHS[(index - 1) % WIRE_WIDTHS.length]"
            />
          </div>
        </div>

        <p
          v-if="!matches.length"
          class="px-(--spacing-xs) py-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
        >
          No domain matches “{{ query }}”.
        </p>
      </div>

      <div
        v-if="remaining"
        class="border-t border-(--border-default) p-(--spacing-xxs)"
      >
        <Button
          :label="`Load ${nextBatch} more`"
          kind="text"
          size="small"
          :loading="loading"
          class="w-full"
          @click.stop="loadMore"
        />
      </div>

      <span
        class="sr-only"
        role="status"
      >
        {{ loading ? `Loading ${nextBatch} more domains` : summary }}
      </span>
    </Popover.Content>
  </Popover>
</template>
