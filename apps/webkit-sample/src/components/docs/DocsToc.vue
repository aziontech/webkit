<script setup>
  // "On this page" — the docs right-hand rail. Anchor links to the current page's
  // headings, with the section the reader is actually looking at marked current.
  //
  // The highlight is computed from scroll position rather than an
  // IntersectionObserver, because an observer cannot mark the LAST section: once the
  // page is scrolled to the bottom, the final heading sits below any sensible trip
  // line, so the rail would stay stuck on the previous entry for the whole last
  // screenful. Reading positions directly lets the bottom of the scroll always resolve
  // to the last heading.
  import { onMounted, onScopeDispose, ref } from 'vue'

  const props = defineProps({
    // Headings in document order: { id, label }.
    items: {
      type: Array,
      default: () => []
    }
  })

  // Distance below the scroller's top edge at which a heading becomes "current" —
  // roughly where the eye sits after clicking an anchor.
  const TRIP_LINE = 96

  const current = ref(props.items[0]?.id ?? '')
  const rail = ref(null)
  let scroller
  let headings = []

  const sync = () => {
    if (!scroller || headings.length === 0) return

    // At the bottom there is no scrolling left to reveal the last section, so it is
    // the answer regardless of where its heading sits.
    if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
      current.value = headings[headings.length - 1].id
      return
    }

    const top = scroller.getBoundingClientRect().top + TRIP_LINE
    // Last heading at or above the trip line; the first entry holds until one passes.
    const passed = headings.filter((el) => el.getBoundingClientRect().top <= top)
    current.value = (passed[passed.length - 1] ?? headings[0]).id
  }

  onMounted(() => {
    scroller = rail.value?.closest('.docs-shell')?.querySelector('main') ?? null
    headings = props.items
      .map((item) => globalThis.document.getElementById(item.id))
      .filter(Boolean)

    if (!scroller || headings.length === 0) return

    scroller.addEventListener('scroll', sync, { passive: true })
    sync()
  })

  onScopeDispose(() => scroller?.removeEventListener('scroll', sync))
</script>

<template>
  <nav
    ref="rail"
    aria-label="On this page"
    class="sticky top-0"
  >
    <p
      class="mb-[var(--spacing-xs)] text-overline-sm uppercase tracking-widest text-[var(--text-muted)]"
    >
      On this page
    </p>
    <ul class="flex flex-col gap-px">
      <li
        v-for="item in items"
        :key="item.id"
      >
        <a
          :href="`#${item.id}`"
          :aria-current="current === item.id ? 'true' : undefined"
          :data-current="current === item.id || null"
          class="block border-l border-[var(--border-default)] py-[var(--spacing-xxs)] pl-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)] no-underline transition-colors duration-150 ease-out hover:border-[var(--border-strong)] hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[current]:border-[var(--border-selected)] data-[current]:text-[var(--text-default)] motion-reduce:transition-none"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
