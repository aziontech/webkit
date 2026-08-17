<script setup>
  // THE CREATE PAGE. One shell for every first-level create in the console — the
  // resources the sidebar routes to directly — and the only shell for them. Where a
  // create lives is not a per-module choice; see `docs/surfaces.js` for the rule and
  // why it is one.
  //
  // WHY A PAGE. Creating a first-level resource is the whole task: the reader came to
  // the console to do it, nothing is behind it that they need to keep seeing, and the
  // result is a thing they will link to, reload and share. So it gets its own URL and
  // its own screen — back-button-safe, deep-linkable, survivable across a refresh —
  // instead of an overlay that a stray Escape can destroy.
  //
  // WHAT THIS SHELL OWNS, so no create page decides it again:
  //   FOCUSED CHROME. A CreationHeader (back + brand + breadcrumb + account) and no
  //     sidebar: for the length of the task the form is the only thing on screen.
  //   THE MEASURE AND THE RHYTHM. `layout-column-form` is the form measure — the same
  //     one an application's settings tabs use, so a create page and the settings page
  //     it becomes are the same width — and the block padding is `--layout-section-gap`,
  //     the SAME step Section puts between bands. One step, top to bottom: header →
  //     heading → first band → every band after it.
  //   THE LOCK. One `submitting` flag disables the body `<fieldset>` and spins Save.
  //     The fieldset is the native safety net; each control still takes `:disabled`
  //     from the same flag, because a webkit control renders its disabled VISUAL from
  //     its own prop and a fieldset alone would leave it looking live mid-submit.
  //   THE ACTION BAR (see the footer's own note for why it is built the way it is).
  //   THE LEAVE GUARD. A half-filled create form is the easiest work in this console to
  //     lose — every exit from this page (Back, a breadcrumb, Cancel, the sidebar the
  //     reader still has muscle memory for) is one click, and none of them is undoable.
  //     So the shell mounts ui/UnsavedChangesGuard.vue and the owner passes `dirty`; the
  //     guard is NOT `savable` here, because this page's commit CREATES a resource and
  //     provisioning real infrastructure to resolve a navigation is not a thing a
  //     sidebar click should be able to do.
  //
  // The BANDS come from the owner through the default slot, because what a DNS zone
  // asks for has nothing to do with what a connector asks for. They are `Section`s,
  // in the order the decisions are actually made: what the endpoint REQUIRES first,
  // then what the reader came to choose, then — collapsed and last — the optional
  // fields that already carry the endpoint's own defaults.
  import Button from '@aziontech/webkit/button'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../form/UnsavedChangesGuard.vue'
  import CreationHeader from './CreationHeader.vue'
  import PageHeading from './PageHeading.vue'

  defineProps({
    // Breadcrumb trail for the flow, e.g.
    // [{ label: 'Applications', href: '/applications' }, { label: 'Create Application' }]
    breadcrumb: { type: Array, default: () => [] },
    // Accessible label for the header's back button.
    backLabel: { type: String, default: 'Back' },
    // The page title — the create's own name ("Create Application").
    title: { type: String, default: '' },
    // One line saying what the resource IS and what saving does. This is the page's
    // only prose: every other explanation belongs to a band, as its Hint.
    description: { type: String, default: '' },
    // Id on the <h1>, so the form can point `aria-labelledby` at it.
    titleId: { type: String, default: undefined },
    // The owner's in-flight flag: locks the fieldset and spins Save.
    submitting: { type: Boolean, default: false },
    // True while the form holds input the reader has not committed — the leave guard's
    // whole trigger. The owner clears it (its `useBaseline` commit) right before the
    // navigation that FOLLOWS a successful create, or the guard would stop the page from
    // leaving on its own success.
    dirty: { type: Boolean, default: false },
    // The commit's own verb. "Save" everywhere unless the module has a better one.
    saveLabel: { type: String, default: 'Save' }
  })

  const emit = defineEmits(['submit', 'cancel'])

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow, so identity survives every hop.
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // A crumb with an href always means "go there" — that was hand-written on every
  // create page and identical on all of them, so it lives here once. A crumb WITHOUT
  // one is the current page, and clicking it is the same intent as Back: leave.
  //
  // The click itself is already claimed from the browser by CreationHeader, which only
  // forwards plain activations (./CreationHeader.vue, ../../lib/anchor-nav.js) — so
  // this handler can route unconditionally.
  const onCrumb = (event, href) => {
    if (!href || href === '#') {
      emit('cancel')
      return
    }
    const [path, queryString] = href.split('?')
    const extra = Object.fromEntries(new URLSearchParams(queryString || ''))
    router.push({ path, query: { email: userEmail.value, ...extra } })
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <UnsavedChangesGuard :dirty="dirty" />

    <CreationHeader
      :breadcrumb="breadcrumb"
      :back-label="backLabel"
      @back="emit('cancel')"
      @navigate="onCrumb"
    />

    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        :aria-labelledby="titleId"
        :aria-label="titleId ? undefined : title"
        novalidate
        @submit.prevent="emit('submit')"
      >
        <!-- `layout-boundary-inline` gives the container its side padding only; the
             block padding is set here so the page opens on the same step it puts
             between bands rather than on the tighter boundary default. -->
        <div
          class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-[var(--layout-section-gap)] pt-[var(--layout-section-gap)]"
        >
          <PageHeading
            :title="title"
            :description="description"
            :title-id="titleId"
          />

          <!-- One flag locks every control while the request is in flight. The bands
               space themselves (Section owns the step), so nothing here sets a gap. -->
          <fieldset
            class="mx-0 mt-[var(--layout-section-gap)] flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">{{ title }}</legend>
            <slot />
          </fieldset>
        </div>

        <!-- THE ACTION BAR FLOATS. It is pinned to the bottom of a scrolling form, so
             content passes under it — and the bar is a CARD laid over the page
             (`--bg-surface-raised`, a border, a shadow) rather than a full-width band.
             The same reason ui/SettingsSaveBar.vue floats: a full-width bar has to be
             told the page's measure to put its buttons on the content's right edge, and
             the console has three measures. A bar sized by its own content and centred
             has no measure to get wrong, at any viewport.
             It also retires the gradient this bar used to carry. A hard edge across the
             full width sliced the last row mid-glyph at the same y at every scroll
             position, so the band had to fade into the canvas; a card has edges on all
             four sides by design, and the form simply continues around it. -->
        <footer
          class="pointer-events-none sticky bottom-0 z-10 flex justify-center px-[var(--spacing-md)] pt-[var(--spacing-xl)] pb-[var(--spacing-lg)]"
        >
          <div
            class="pointer-events-auto flex max-w-full items-center gap-[var(--spacing-md)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] py-[var(--spacing-xs)] pr-[var(--spacing-xs)] pl-[var(--spacing-xs)] shadow-lg"
          >
            <!-- `#start` is for a bulk path that belongs to the whole form — a zone
                 file to import, a .env to read. It sits opposite the commit, separated
                 by the card's own gap. Nothing else goes in here: a second
                 commit-shaped button beside Save is a second answer to a question the
                 page asks once. -->
            <div
              v-if="$slots.start"
              class="flex min-w-0 items-center gap-[var(--spacing-sm)]"
            >
              <slot name="start" />
            </div>
            <div class="flex shrink-0 items-center gap-[var(--spacing-sm)]">
              <Button
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                :disabled="submitting"
                @click="emit('cancel')"
              />
              <!-- The webkit Button renders a native type="button" and does not forward
                   a type, so submit is driven from its click; the sr-only submit below
                   keeps Enter working. -->
              <Button
                :label="saveLabel"
                kind="primary"
                size="medium"
                :loading="submitting"
                @click="emit('submit')"
              />
            </div>
          </div>
        </footer>
        <button
          type="submit"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
        >
          {{ saveLabel }}
        </button>
      </form>
    </main>
  </div>
</template>
