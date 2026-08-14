<script setup>
  // THE SAVE BAR. One bar per settings page, for the whole page — the single commit
  // point every internal settings surface in the console uses.
  //
  // ── WHY ONE BAR AND NOT A SAVE PER BAND ──
  //
  // A settings page used to give each band its own footer Save, each with its own
  // submitting flag and its own dirty check. Every one of them was correct in isolation
  // and wrong together: the reader edits a field in one band and a switch in another, and
  // has to notice which of the two footers belongs to which edit, then press both. Worse,
  // half the page can be saved and half not — a settings screen with no single answer to
  // "is what I see what is stored".
  //
  // The bands of a settings page describe ONE record, so they commit as one. The page
  // keeps one `saving` flag, one baseline, one Save.
  //
  // ── WHY IT MOUNTS ON THE FIRST EDIT ──
  //
  // At rest there is nothing to commit and nothing to discard, so a bar sitting there
  // permanently is a control that does nothing, occupying the bottom of every settings
  // screen and covering the last row of content. It arrives on the first real edit
  // (`dirty`) and leaves when the save lands — which is also the page's clearest signal
  // that there ARE unsaved changes.
  //
  // Discard is not optional: a page-level commit owes a way back that is not undoing each
  // field by hand.
  //
  // ── ONE PLACEMENT, `sticky bottom-0`, AND WHY IT NEEDS NO PROP ──
  //
  // The console mounts this bar in three structurally different places, and `sticky`
  // is correct in all of them without being told which:
  //
  //   inside the page's own scroll region (an application's Main Settings, a zone's) —
  //     the scroll region is the scrollport, so the bar pins to the bottom of the visible
  //     area and the content scrolls under its gradient.
  //   as a sibling of a scroll region in a flex column (the account's settings) — it has
  //     no scrolling ancestor of its own, so sticky resolves to in-flow and the flex
  //     column holds it at the bottom, which is exactly where it belongs.
  //   as a sibling of a full-height `main` inside the shell's scroll container (a
  //     workload's Settings tab) — the bar's natural position is one bar-height BELOW the
  //     fold, and sticky is what pulls it back onto the screen.
  //
  // That third case is why this used to take a `kind` prop and why the prop was wrong: it
  // offered `shrink-0` for "the bar is a sibling, not inside the scroll region", which is
  // true of both the second and the third case — and in the third one `shrink-0` left the
  // bar sitting at y=900 in a 900px viewport, present in the DOM, mounted on the right
  // edit, and never once visible. Measured, not eyeballed. One class that is right
  // everywhere beats a prop whose two answers each cover half the cases.
  //
  // ── WHY THE LEAVE GUARD LIVES HERE ──
  //
  // The bar is already the page's answer to "is there something uncommitted": it knows
  // `dirty`, it knows `saving`, and it owns both ways out of that state. Every settings
  // surface in the console mounts it with the same four bindings, so mounting the guard
  // (ui/UnsavedChangesGuard.vue) from inside the bar gives all of them the friction with no
  // call-site change — and makes it impossible for a settings page to mount the bar and
  // forget the guard, which is the failure mode a per-page `onBeforeRouteLeave` ships on
  // its first copy-paste.
  //
  // It passes `savable`: this page edits a record that already exists, so committing it is
  // a legitimate one-click way to resolve a navigation. A create page's commit CREATES
  // something, which is why the guard does not offer it there.
  import Button from '@aziontech/webkit/button'

  import UnsavedChangesGuard from './UnsavedChangesGuard.vue'

  defineProps({
    /** True while the page has unsaved edits — what brings the bar in. */
    dirty: { type: Boolean, default: false },
    /** True while the commit is in flight: locks Discard, spins Save. */
    saving: { type: Boolean, default: false }
  })

  const emit = defineEmits(['save', 'discard'])
</script>

<template>
  <!-- The bar rises from the bottom edge. `transition-[translate,opacity]` names
       `translate` — NOT `transform` — because that is the property Tailwind v4's
       translate utilities actually set, and naming the wrong one animates nothing while
       still compiling. -->
  <Transition
    enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none"
    enter-from-class="translate-y-full opacity-0"
    leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    leave-to-class="translate-y-full opacity-0"
  >
    <footer
      v-if="dirty || saving"
      class="sticky bottom-0 z-10 bg-linear-to-t from-[var(--bg-canvas)] from-[3.5rem] to-transparent pt-[var(--spacing-xl)]"
    >
      <div
        class="layout-column-form layout-boundary-inline flex h-14 items-center justify-end gap-[var(--spacing-sm)]"
      >
        <Button
          type="button"
          label="Discard"
          kind="outlined"
          size="medium"
          :disabled="saving"
          @click="emit('discard')"
        />
        <!-- webkit Button renders a native type="button" and does not forward a `type`
             prop, so the commit is driven from its click rather than from form submit. -->
        <Button
          label="Save"
          kind="primary"
          size="medium"
          :loading="saving"
          @click="emit('save')"
        />
      </div>
    </footer>
  </Transition>

  <!-- Sits OUTSIDE the bar's `v-if`: a Discard clears `dirty`, which takes the bar away
       in the same tick the dialog still needs to finish its own leave animation. -->
  <UnsavedChangesGuard
    savable
    :dirty="dirty"
    :saving="saving"
    @save="emit('save')"
    @discard="emit('discard')"
  />
</template>
