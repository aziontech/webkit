<script setup>
  // The aliases behind a workload's primary domain: a "+N" tag that opens the full
  // list, every line a link out to the domain.
  //
  // Its own component because the list owns STATE — the filter query, and the reset
  // of that query on close — and a cell template rendered inside a `v-for` has
  // nowhere to keep per-row state. Extracting it also means the Workloads cell reads
  // as what it is (primary link · overflow · copy) instead of forty lines of panel.
  //
  // The list is deliberately NOT `flex flex-col`: a flex column under a max-height
  // shrinks its items to fit, which collapsed 43 rows from 27px to 8px each, clipped
  // every domain to a sliver of glyphs, and left `scrollHeight === clientHeight` so
  // `overflow-auto` had nothing to scroll. Block layout lets the rows keep their
  // height and the list actually overflow.
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref, watch } from 'vue'

  const props = defineProps({
    /** Every domain on the workload, primary first. */
    domains: { type: Array, default: () => [] },
    /** The overflow count shown on the tag — everything after the primary. */
    count: { type: Number, default: 0 }
  })

  // Under this many, the eye beats the keyboard: a field would cost a row of height
  // and save nobody a scroll. Above it, the list is longer than one panel.
  const SEARCH_THRESHOLD = 10

  const open = ref(false)
  const query = ref('')

  const searchable = computed(() => props.domains.length > SEARCH_THRESHOLD)

  const matches = computed(() => {
    const needle = query.value.trim().toLowerCase()
    if (!needle) return props.domains
    return props.domains.filter((domain) => domain.toLowerCase().includes(needle))
  })

  // A stale query behind a closed panel would make the next open look like a shorter
  // list than the tag promises.
  watch(open, (isOpen) => {
    if (!isOpen) query.value = ''
  })
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
      <!-- Header and field stay OUT of the scroller, so neither scrolls away
           after the first few of up to ~99 aliases. -->
      <div
        class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
      >
        <p class="text-label-sm text-(--text-muted)">
          {{
            query ? `${matches.length} of ${domains.length} domains` : `${domains.length} domains`
          }}
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

      <!-- `overscroll-contain`: without it, reaching either end chains the wheel to
           the page, and the panel re-anchors to its trigger on page scroll — so the
           popover slides out from under the pointer mid-scroll. -->
      <div
        class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
      >
        <!-- Every alias opens, like the primary domain in the cell behind it —
             same anchor, same arrow, same truncation. -->
        <a
          v-for="domain in matches"
          :key="domain"
          :href="`https://${domain}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline"
          @click.stop
        >
          <span class="truncate">{{ domain }}</span>
          <i
            class="pi pi-arrow-up-right ml-auto shrink-0 text-(--text-muted)"
            aria-hidden="true"
          />
        </a>

        <p
          v-if="!matches.length"
          class="px-(--spacing-xs) py-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
        >
          No domain matches “{{ query }}”.
        </p>
      </div>
    </Popover.Content>
  </Popover>
</template>
