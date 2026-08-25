<script setup>
  // The aliases behind a workload's primary domain: a "+N" tag that opens the full
  // list, every line a link out to the domain.
  //
  // Its own component because the list owns STATE — the filter query, the paging
  // window, and the reset of both on close — and a cell template rendered inside a
  // `v-for` has nowhere to keep per-row state. Extracting it also means the Workloads
  // cell reads as what it is (primary link · overflow · copy) instead of forty lines
  // of panel.
  //
  // The list is deliberately NOT `flex flex-col`: a flex column under a max-height
  // shrinks its items to fit, which collapsed 43 rows from 27px to 8px each, clipped
  // every domain to a sliver of glyphs, and left `scrollHeight === clientHeight` so
  // `overflow-auto` had nothing to scroll. Block layout lets the rows keep their
  // height and the list actually overflow.
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  const props = defineProps({
    /** Every domain on the workload, primary first. */
    domains: { type: Array, default: () => [] },
    /** The overflow count shown on the tag — everything after the primary. */
    count: { type: Number, default: 0 }
  })

  // Under this many, the eye beats the keyboard: a field would cost a row of height
  // and save nobody a scroll. Above it, the list is longer than one panel.
  const SEARCH_THRESHOLD = 10

  // One page of aliases. A workload can carry ~99 of them, and rendering all of them
  // on open pays the full cost for a panel most readers scan the top of and close.
  const PAGE_SIZE = 10

  // Long enough for the skeleton wire to read as the next page arriving rather than
  // as a flicker. In the real console this is the request; here it stands in for one.
  const LOAD_LATENCY_MS = 420

  // Deterministic widths, so the wire looks like a column of domain names instead of
  // ten identical bars — and looks the same on every open.
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

  // The last page is usually short — promising ten more when seven exist is a lie the
  // reader catches one click later.
  const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

  // The header has to say what is RENDERED, not just what exists: a panel that reads
  // "43 domains" over ten rows looks like a broken list, not a paged one.
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

  // A stale query behind a closed panel would make the next open look like a shorter
  // list than the tag promises — and a stale window would make the second open start
  // wherever the first one stopped.
  watch(open, (isOpen) => {
    if (isOpen) return
    query.value = ''
    shown.value = PAGE_SIZE
    cancelLoad()
  })

  // Narrowing produces a different list, so it gets a fresh first page: keeping the
  // old offset would show every match at once for a query that matches few.
  watch(query, () => {
    shown.value = PAGE_SIZE
    cancelLoad()
  })

  // The panel can be torn down mid-load (row deleted, page left) — a timer that
  // outlives it writes to a dead ref.
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
      <!-- Header and field stay OUT of the scroller, so neither scrolls away
           after the first few of up to ~99 aliases. -->
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

      <!-- `overscroll-contain`: without it, reaching either end chains the wheel to
           the page, and the panel re-anchors to its trigger on page scroll — so the
           popover slides out from under the pointer mid-scroll. -->
      <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
        <!-- Every alias opens, like the primary domain in the cell behind it —
             same anchor, same arrow, same truncation. -->
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
            class="pi pi-arrow-up-right ml-auto shrink-0 text-(--text-muted)"
            aria-hidden="true"
          />
        </a>

        <!-- The incoming page, wired: as many rows as are actually coming, in the
             geometry of the rows above them, so the list grows in place instead of
             jumping when they land. It sits at the end of the aliases while the footer
             button below reports the same wait — the list shows WHAT is coming, the
             button shows that it was asked for. -->
        <div v-if="loading">
          <!-- `h-7` is the height a real row settles at (a 14px/1.375 line between two
               `xxs` paddings), so the list does not jump when the links replace it. -->
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

      <!-- THE NEXT PAGE, asked for from the panel's FOOTER — not from a row at the end
           of the list. A control that scrolls with the aliases reads as one more entry in
           the list it is paging, and it scrolls out of reach the moment its page lands.
           Fixed under the scroller it stays the one thing the panel offers, and it holds
           its own busy state while the wire above stands in for the incoming rows — so
           the press is answered in two places at once instead of removing the button the
           reader just aimed at. -->
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

      <!-- Announced, not just drawn: the wire is aria-hidden, so a screen reader is
           otherwise told nothing between the click and the ten new links. -->
      <span
        class="sr-only"
        role="status"
      >
        {{ loading ? `Loading ${nextBatch} more domains` : summary }}
      </span>
    </Popover.Content>
  </Popover>
</template>
