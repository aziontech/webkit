<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DialogTrigger from '@aziontech/webkit/dialog-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Dialog
    v-model:open="open"
    dismissible
    size="medium"
  >
    <DialogTrigger>
      <Button
        label="Open dialog"
        kind="primary"
      />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Domain settings</DialogTitle>
          <DialogClose />
        </PanelHeader>
        <PanelContent>
          <DialogDescription>Body taller than the dialog, so it has to scroll.</DialogDescription>
          <p>
            Setting 1 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 2 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 3 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 4 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 5 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 6 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 7 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 8 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 9 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 10 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 11 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 12 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 13 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 14 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 15 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 16 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 17 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 18 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
        </PanelContent>
        <PanelFooter>
          <div
            class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
          >
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Cancel"
                kind="outlined"
                @click="open = false"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Save"
                kind="primary"
              />
            </div>
          </div>
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
