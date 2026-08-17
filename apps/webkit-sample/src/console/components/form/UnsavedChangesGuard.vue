<script setup>
  // THE UNSAVED-CHANGES FRICTION. One component, mounted by any page that holds work the
  // reader has not committed yet — it renders nothing until they try to leave with that
  // work still pending, and then it is the only interruption this app puts in their way.
  //
  // ── WHY IT IS A COMPONENT AND NOT A COMPOSABLE ──
  //
  // The guard needs three things that travel together: the route hook, the dialog, and the
  // `beforeunload` listener. Split into a composable, every page would import the hook AND
  // remember to render the dialog somewhere — and the page that forgot the second half
  // would silently have no friction at all, with nothing to notice. As one element, the
  // page mounts it or it doesn't; there is no half-wired state.
  //
  // ── THE TWO WAYS OUT, AND WHICH ONE WE OWN ──
  //
  //   in-app navigation (sidebar, breadcrumb, Cancel, browser Back) — held by
  //     `onBeforeRouteLeave`, which is allowed to return a Promise: the navigation is
  //     PARKED, URL untouched, until an answer resolves it.
  //   closing or reloading the tab — `beforeunload`, where the browser shows its own
  //     wording and no page may replace it. Registered only while dirty, so it never fires
  //     on a page the reader merely looked at.
  //
  // ── WHY `savable` IS A PROP AND NOT ALWAYS ON ──
  //
  // A settings page edits a record that already exists, so "Save changes" is a legitimate
  // one-click way out: it commits exactly what the reader was already looking at.
  //
  // A create page has nothing to update — its commit CREATES a resource. Offering that as
  // a way to resolve a navigation would provision real infrastructure as a side effect of
  // clicking a sidebar link, off a form the reader may not have finished. So a create page
  // asks the two-answer question, and the reader who wants to commit goes back and does it
  // deliberately.
  //
  // ── EVERY IMPLICIT DISMISSAL MEANS "KEEP EDITING" ──
  //
  // Escape, the overlay, the X and the Keep editing button all resolve to STAYING, edit
  // intact. A guard whose accidental outcome is data loss is worse than no guard: it
  // teaches the reader to fear the dialog instead of reading it.
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { onBeforeRouteLeave } from 'vue-router'

  const props = defineProps({
    /** True while the page holds edits it has not committed. The whole trigger. */
    dirty: { type: Boolean, default: false },
    /** The page's in-flight commit flag — only read when `savable`. */
    saving: { type: Boolean, default: false },
    /** Offer "Save changes" as a way out. See the note above for when it is wrong. */
    savable: { type: Boolean, default: false },
    /**
     * Whether this instance guards ROUTE leaves and tab close. Off for a guard mounted
     * to protect something that is not a navigation — a tab switch inside one page —
     * where the page already has another instance holding the route. Two instances both
     * hooking the route would stack two dialogs on one navigation.
     */
    routeGuard: { type: Boolean, default: true }
  })

  const emit = defineEmits(['save', 'discard'])

  const asking = ref(false)

  // The parked navigation. `true` lets the reader go, `false` puts them back — vue-router
  // leaves the route completely untouched until one of the two arrives.
  let releaseNavigation = null

  // Set while the reader answered "Save changes": the commit is in flight and the
  // navigation now waits on its OUTCOME rather than on another click.
  const leavingAfterSave = ref(false)

  const body = computed(() =>
    props.savable
      ? "This page has changes that haven't been saved yet. Save them before you leave, or discard them and continue."
      : "This page has changes you haven't saved. If you leave now, they're discarded."
  )

  const release = (allowed) => {
    const resolve = releaseNavigation
    releaseNavigation = null
    leavingAfterSave.value = false
    asking.value = false
    resolve?.(allowed)
  }

  /**
   * Puts the question, and resolves to whether the reader may proceed.
   *
   * The route hook below is one caller; a tabbed shell asking before it switches tabs
   * is the other (ApplicationDetail). Both get the same dialog, the same wording and
   * the same "every implicit dismissal means keep editing" rule — which is the whole
   * reason this is one function and not two dialogs.
   */
  const ask = () => {
    if (!props.dirty) return Promise.resolve(true)

    // A commit already in flight needs no dialog — it is the answer the dialog would have
    // asked for. Park the caller on the same watcher and let the save land.
    leavingAfterSave.value = props.savable && props.saving
    asking.value = !leavingAfterSave.value

    return new Promise((resolve) => {
      releaseNavigation = resolve
    })
  }

  defineExpose({ ask })

  onBeforeRouteLeave(() => (props.routeGuard ? ask() : true))

  // The save the dialog asked for, resolved by its OUTCOME rather than by a timer: a page
  // clears `dirty` in its commit, which runs only on success. So a still-dirty page means
  // the save failed — the navigation stays parked and the dialog comes back with the same
  // answers, next to the error toast the commit already raised. Releasing `false` there
  // instead would leave the reader on a page whose sidebar click did nothing.
  watch(
    () => [props.dirty, props.saving],
    ([dirty, saving]) => {
      if (!leavingAfterSave.value || saving) return
      leavingAfterSave.value = false
      if (dirty) {
        asking.value = true
        return
      }
      release(true)
    }
  )

  const saveAndLeave = () => {
    leavingAfterSave.value = true
    asking.value = false
    emit('save')
  }

  const discardAndLeave = () => {
    emit('discard')
    release(true)
  }

  // Closing the dialog by any implicit route — Escape, the overlay, the X, Keep editing —
  // resolves to staying. Guarded on `leavingAfterSave` so the close that FOLLOWS a chosen
  // save does not cancel the navigation that save was granted.
  watch(asking, (open) => {
    if (!open && releaseNavigation && !leavingAfterSave.value) release(false)
  })

  // The browser's own dialog for tab close / reload. `preventDefault()` is the modern
  // trigger; `returnValue` is kept for the engines that still read it. Neither can carry
  // our wording, which is why the in-app path above is worth owning.
  const warnOnUnload = (event) => {
    if (!props.routeGuard || !props.dirty) return
    event.preventDefault()
    event.returnValue = ''
  }

  onMounted(() => globalThis.addEventListener('beforeunload', warnOnUnload))
  onBeforeUnmount(() => globalThis.removeEventListener('beforeunload', warnOnUnload))
</script>

<template>
  <Dialog
    v-model:open="asking"
    size="small"
    data-testid="unsaved-changes-dialog"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Unsaved changes</DialogTitle>
          <DialogClose />
        </PanelHeader>

        <PanelContent>
          <DialogDescription class="m-0 text-body-sm text-(--text-muted)">
            {{ body }}
          </DialogDescription>
        </PanelContent>

        <!-- The footer carries exactly ONE filled button, and which button that is says
             what the dialog wants:
               WITH Save — Save takes the fill, because committing is the outcome the guard
                 exists to produce. Discard is `outlined`, not `danger`: it drops a pending
                 edit, which is a loss, but not the irreversible destruction of stored data
                 that earns the danger fill (see ui/DeleteDialog.vue for what does).
               WITHOUT Save — Discard is the only way out, so it takes the fill. It takes
                 `danger`, NOT `primary`: the brand fill is what this app puts on the
                 recommended action (it is on the create page's own Save, one layer below),
                 and wearing it here would RECOMMEND the loss this dialog was opened to
                 make deliberate. Danger says the same "this is the loud one" while naming
                 what it costs. -->
        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            label="Keep editing"
            kind="text"
            size="medium"
            @click="asking = false"
          />
          <Button
            class="w-full md:w-auto"
            label="Discard changes"
            :kind="savable ? 'outlined' : 'danger'"
            size="medium"
            :disabled="saving"
            data-testid="unsaved-changes-dialog__discard"
            @click="discardAndLeave"
          />
          <Button
            v-if="savable"
            class="w-full md:w-auto"
            label="Save changes"
            kind="primary"
            size="medium"
            :loading="saving"
            data-testid="unsaved-changes-dialog__save"
            @click="saveAndLeave"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
