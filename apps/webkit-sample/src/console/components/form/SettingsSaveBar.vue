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
  // ── WHY IT FLOATS, AND IS NOT A FULL-WIDTH BAND ──
  //
  // It used to be a full-width band: the page's own column class (`layout-column-form`)
  // plus the page's own inset, so the buttons landed on the same right edge as the
  // content above them. That only works while every surface that raises the bar has the
  // SAME measure — and they do not. An application's settings tab is the form measure, a
  // detail page is the data measure, the account's settings is a third; the bar had to be
  // told which, could not be, and so was hard right of one page's content and floating
  // inside another's. One bar, three widths, none of them reliably correct.
  //
  // A floating bar has no measure to get wrong. It is sized by ITS OWN CONTENT, centred in
  // whatever it is dropped into, and lifted off the bottom edge — so it belongs to the
  // VIEWPORT rather than to the column, which is what it always actually was.
  //
  // That also retires the gradient. The old band had to fade, because a hard edge across
  // the full width sliced the last row mid-glyph at the same y at every scroll position.
  // A floating card has edges on all four sides by design: it reads as a thing laid OVER
  // the page (`--bg-surface-raised` + a border + a shadow, the console's one raised
  // plane), so the rows passing beside and under it are simply the page continuing.
  //
  // ── ONE PLACEMENT, `sticky bottom-0` ON A ZERO-HEIGHT STRIP, AND WHY IT NEEDS NO PROP ──
  //
  // The console mounts this bar in three structurally different places, and `sticky`
  // is correct in all of them without being told which:
  //
  //   inside the page's own scroll region (an application's Main Settings, a zone's) —
  //     the scroll region is the scrollport, so the bar pins to the bottom of the visible
  //     area and the content scrolls under it.
  //   as a sibling of a scroll region in a flex column (the account's settings, a
  //     function's) — it has no scrolling ancestor of its own, so sticky resolves to
  //     in-flow at the bottom of the column.
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
  // The strip is `h-0` and the card is absolutely positioned off its bottom edge, because
  // in the second case — sticky with no scrolling ancestor — a strip with HEIGHT is laid
  // out, not overlaid: it takes a band of the flex column and the content above it shrinks
  // by exactly the bar's height (measured on a function's Arguments tab: the editor
  // reflowed and the bar sat in its own reserved strip below the page). That contradicts
  // the whole point of a floating card, and it made the bar look like two different
  // components depending on which page raised it. At zero height it contributes no layout
  // in ANY of the three cases, so it always FLOATS over the content, and `sticky` still
  // does the one job left: keep that bottom edge on screen.
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
    saving: { type: Boolean, default: false },
    /**
     * What this bar commits, in the reader's words ("Rule order changed").
     *
     * Worth setting on any page where more than one surface can raise a bar in this
     * same position — a tabbed detail page. Two identical bars that save two different
     * things is how a Discard ends up applied to the wrong edit. It defaults to the
     * generic sentence rather than to nothing: a bar that appears with two buttons and
     * no words leaves the reader to infer both what changed and what pressing either
     * one will do.
     */
    label: { type: String, default: 'You have unsaved changes.' },
    /**
     * What SAVING does, one clause, present tense ("Applies the new order to every
     * request this application handles").
     *
     * The label says what CHANGED; this says what happens NEXT, which is the question a
     * commit bar is actually asked. Optional — a page with nothing specific to promise
     * leaves it off rather than padding the bar with a restatement of its own buttons.
     */
    hint: { type: String, default: '' },
    /**
     * Whether this bar also guards ROUTE leaves. Off when the page mounts its own guard
     * for a different boundary (a tab switch) — two guards on one navigation stack two
     * dialogs.
     */
    routeGuard: { type: Boolean, default: true }
  })

  const emit = defineEmits(['save', 'discard'])
</script>

<template>
  <!-- The bar SCALES in, the way a toast does — it does not rise from the bottom edge.
       A slide up from off-screen says the bar came from somewhere below the page; it did
       not. It is a raised plane that appears over content already on screen the moment an
       edit makes it real, which is the same arrival the console's toasts have, so it takes
       the same shape: a small scale from `origin-bottom` (it is anchored to the bottom
       edge, so that is the point it grows out of) plus opacity.
       `transition-[scale,opacity]` names `scale` — NOT `transform` — because that is the
       property Tailwind v4's `scale-*` utilities actually set, and naming the wrong one
       animates nothing while still compiling. -->
  <Transition
    enter-active-class="origin-bottom transition-[scale,opacity] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none"
    enter-from-class="scale-95 opacity-0"
    leave-active-class="origin-bottom transition-[scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    leave-to-class="scale-95 opacity-0"
  >
    <!-- `pointer-events-none` on the strip, `auto` on the card: the strip spans the full
         width so the card can be centred in it, and without this it would swallow clicks
         on the rows either side of a bar that is only as wide as its own buttons. -->
    <footer
      v-if="dirty || saving"
      class="pointer-events-none sticky bottom-0 z-10 h-0"
    >
      <!-- Anchored to the strip's bottom edge and growing UPWARD out of it (`absolute
           bottom-0` on an auto-height box), which is what lets the strip itself be `h-0`
           and still put the card above the fold rather than half off it. -->
      <div
        class="absolute inset-x-0 bottom-0 flex justify-center px-(--spacing-md) pb-(--spacing-lg)"
      >
        <div
          class="pointer-events-auto flex max-w-[min(100%,var(--container-3xl))] items-center gap-(--spacing-xl) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) py-(--spacing-sm) pr-(--spacing-sm) pl-(--spacing-lg) shadow-lg"
        >
          <!-- THE FEEDBACK, on the left of the two buttons. It names WHAT is pending and
             what saving will do, so two bars in the same position on two tabs are two
             different sentences rather than one anonymous pair of buttons — and so the
             reader is never asked to commit something the bar has not named.

             The glyph is `aria-hidden`: it is a marker that this strip is telling them
             something, and the sentence beside it already carries the meaning. Nothing
             truncates — a commit bar that hides half of what it is about to do is worse
             than a bar one line taller — so the text wraps and the buttons hold their
             width (`shrink-0` on the group below). -->
          <div class="flex min-w-0 items-start gap-(--spacing-xs)">
            <i
              class="pi pi-info-circle mt-[0.125rem] shrink-0 text-[0.875rem] text-(--text-muted)"
              aria-hidden="true"
            />
            <p class="min-w-0 text-body-sm text-(--text-default)">
              {{ label }}
              <span
                v-if="hint"
                class="text-(--text-muted)"
                >{{ hint }}</span
              >
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-(--spacing-sm)">
            <Button
              type="button"
              label="Discard"
              kind="outlined"
              size="large"
              :disabled="saving"
              @click="emit('discard')"
            />
            <!-- webkit Button renders a native type="button" and does not forward a `type`
               prop, so the commit is driven from its click rather than from form submit. -->
            <Button
              label="Save"
              kind="primary"
              size="large"
              :loading="saving"
              @click="emit('save')"
            />
          </div>
        </div>
      </div>
    </footer>
  </Transition>

  <!-- Sits OUTSIDE the bar's `v-if`: a Discard clears `dirty`, which takes the bar away
       in the same tick the dialog still needs to finish its own leave animation. -->
  <UnsavedChangesGuard
    savable
    :route-guard="routeGuard"
    :dirty="dirty"
    :saving="saving"
    @save="emit('save')"
    @discard="emit('discard')"
  />
</template>
