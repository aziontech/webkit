<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { relativeTime } from '../../lib/format/relative-time'

  interface VersionChoice {
    id: string
    name: string
    author?: string
    authorAvatar?: string
    createdAt?: Date | string
    active?: boolean
    fresh?: boolean
  }

  interface Props {
    versions?: VersionChoice[]
    label?: string
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    versions: () => [],
    label: 'Change Version',
    disabled: false
  })

  const model = defineModel<string>({ default: '' })

  const VERSION_PAGE_SIZE = 5
  const LOAD_LATENCY_MS = 420
  const WIRE_WIDTHS = ['52%', '40%', '60%', '46%', '56%']

  const open = ref(false)
  const query = ref('')
  const shown = ref(VERSION_PAGE_SIZE)
  const loading = ref(false)

  let loadTimer = 0

  const paged = computed(() => props.versions.length > VERSION_PAGE_SIZE)

  const matches = computed(() => {
    const needle = query.value.trim().toLowerCase()
    if (!needle) return props.versions
    return props.versions.filter((entry) =>
      [entry.name, entry.id, entry.author].some((field) =>
        String(field ?? '')
          .toLowerCase()
          .includes(needle)
      )
    )
  })

  const visible = computed(() => matches.value.slice(0, shown.value))

  const remaining = computed(() => matches.value.length - visible.value.length)

  const nextBatch = computed(() => Math.min(VERSION_PAGE_SIZE, remaining.value))

  const summary = computed(() => {
    if (loading.value) return `Loading ${nextBatch.value} more versions`
    const total = props.versions.length
    if (query.value.trim()) {
      return `${visible.value.length} of ${matches.value.length} matching versions`
    }
    return remaining.value
      ? `${visible.value.length} of ${total} Ready versions`
      : `${total} Ready versions`
  })

  const cancelLoad = () => {
    clearTimeout(loadTimer)
    loading.value = false
  }

  const loadMore = () => {
    if (loading.value || !remaining.value) return
    loading.value = true
    loadTimer = setTimeout(() => {
      shown.value += VERSION_PAGE_SIZE
      cancelLoad()
    }, LOAD_LATENCY_MS)
  }

  watch(query, () => {
    shown.value = VERSION_PAGE_SIZE
    cancelLoad()
  })

  watch(open, (isOpen) => {
    if (isOpen) return
    query.value = ''
    shown.value = VERSION_PAGE_SIZE
    cancelLoad()
  })

  onScopeDispose(cancelLoad)

  const pick = (id) => {
    model.value = id
    open.value = false
  }
</script>

<template>
  <Popover
    v-model:open="open"
    placement="bottom-end"
    width="small"
  >
    <Popover.Trigger>
      <Button
        :label="label"
        kind="outlined"
        size="small"
        icon="pi pi-chevron-down"
        icon-position="trailing"
        :disabled="disabled || !versions.length"
      />
    </Popover.Trigger>
    <Popover.Content>
      <div
        class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
      >
        <p class="text-label-sm text-(--text-muted)">{{ summary }}</p>
        <InputText
          v-if="paged"
          v-model="query"
          size="medium"
          placeholder="Search versions"
          aria-label="Search versions"
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
        <button
          v-for="entry in visible"
          :key="entry.id"
          type="button"
          :aria-current="entry.id === model || undefined"
          class="flex w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
          @click="pick(entry.id)"
        >
          <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-body-sm text-(--text-default)">
                {{ entry.name }}
              </span>
              <Tag
                key="tag-1"
                v-if="entry.fresh"
                label="New"
                severity="info"
                size="small"
                class="shrink-0"
              />
              <Tag
                key="tag-2"
                v-else-if="entry.active"
                label="Active"
                severity="success"
                size="small"
                class="shrink-0"
              />
            </span>
            <span
              v-if="entry.author || entry.createdAt"
              class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
            >
              <Avatar
                v-if="entry.author"
                :src="entry.authorAvatar || undefined"
                :alt="entry.author"
                :label="entry.author"
                size="small"
                kind="square"
                class="shrink-0"
              />
              <span class="truncate">
                {{ entry.author }}<template v-if="entry.author && entry.createdAt"> · </template
                >{{ relativeTime(entry.createdAt) }}
              </span>
            </span>
          </span>
          <i
            v-if="entry.id === model"
            class="pi pi-check shrink-0 text-body-xs text-(--text-default)"
            aria-hidden="true"
          />
        </button>

        <div
          v-if="loading"
          aria-hidden="true"
        >
          <div
            v-for="index in nextBatch"
            :key="index"
            class="flex flex-col gap-(--spacing-xxs) px-(--spacing-xs) py-(--spacing-xs)"
          >
            <Skeleton
              height="var(--size-3)"
              :width="WIRE_WIDTHS[(index - 1) % WIRE_WIDTHS.length]"
            />
            <Skeleton
              height="var(--size-3)"
              width="80%"
            />
          </div>
        </div>

        <p
          v-if="!matches.length"
          class="px-(--spacing-xs) py-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
        >
          No Ready version matches “{{ query }}”.
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
          @click="loadMore"
        />
      </div>

      <span
        class="sr-only"
        role="status"
      >
        {{ summary }}
      </span>
    </Popover.Content>
  </Popover>
</template>
