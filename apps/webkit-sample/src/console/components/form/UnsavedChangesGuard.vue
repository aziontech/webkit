<script setup lang="ts">
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

  interface Props {
    dirty?: boolean
    saving?: boolean
    savable?: boolean
    routeGuard?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    dirty: false,
    saving: false,
    savable: false,
    routeGuard: true
  })

  const emit = defineEmits<{
    save: []
    discard: []
  }>()

  const asking = ref(false)

  let releaseNavigation = null

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

  const ask = () => {
    if (!props.dirty) return Promise.resolve(true)

    leavingAfterSave.value = props.savable && props.saving
    asking.value = !leavingAfterSave.value

    return new Promise((resolve) => {
      releaseNavigation = resolve
    })
  }

  defineExpose({ ask })

  onBeforeRouteLeave(() => (props.routeGuard ? ask() : true))

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

  watch(asking, (open) => {
    if (!open && releaseNavigation && !leavingAfterSave.value) release(false)
  })

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
