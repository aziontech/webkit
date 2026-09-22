<script setup>
  // THE ANSWER TO A DROP ON A RESOURCE THAT ALREADY EXISTS.
  //
  // A drop on an empty surface creates something, so it can go straight to a form. A drop
  // on an application REPLACES what is serving Production, and nothing about a drag says
  // the reader meant that one — so the gesture stops here and is confirmed by a control
  // that names what it does.
  //
  // It also does the job ../creation/ProjectInitializing.vue does in the create flow: the
  // most common thing to drop is the wrong folder, and every file is listed by path so
  // that mistake is visible BEFORE the deploy rather than after it. That is why the two do
  // not stack — the acknowledgement beat would show this listing, close, and show it again.
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
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { formatBytes, formatManifest } from '../../lib/format/bytes'

  const props = defineProps({
    /** The application the drop deploys — the subject, named before anything is decided. */
    applicationName: { type: String, default: '' },
    /** The environment it lands in. */
    environment: { type: String, default: 'Production' },
    /** Files read off the drop: `{ path, name, size }`. */
    files: { type: Array, default: () => [] },
    /** Whether the walk stopped before the project did. */
    truncated: { type: Boolean, default: false }
  })

  const emit = defineEmits([
    /** The reader committed: deploy these files. */
    'deploy'
  ])

  const open = defineModel('open', { type: Boolean, default: false })

  const summary = computed(() => formatManifest(props.files, props.truncated))

  // Escape, the overlay, the X and Cancel all answer "no" — the only route to a deploy is
  // the button that names it (../list/ConfirmDialog.vue holds the same line).
  const deploy = () => {
    open.value = false
    emit('deploy')
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
    data-testid="drop-deploy-dialog"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>New {{ environment.toLowerCase() }} deployment</DialogTitle>
          <DialogClose />
        </PanelHeader>

        <PanelContent class="flex flex-col gap-(--spacing-md)">
          <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-body-sm text-(--text-default)">{{ applicationName }}</span>
              <Tag
                :label="environment"
                severity="secondary"
                size="small"
                class="shrink-0"
              />
            </div>
            <DialogDescription class="m-0 text-body-sm text-(--text-muted)">
              These files ship as this application's new {{ environment.toLowerCase() }} version,
              replacing the one serving now.
            </DialogDescription>
          </div>

          <!-- WHAT WAS ACTUALLY DROPPED, by path. The listing scrolls rather than growing
               the dialog: a project is any number of files, and a panel sized by its
               contents would push its own footer off the screen. -->
          <div
            class="flex min-w-0 flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm)"
          >
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <i
                class="pi pi-folder shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-body-sm text-(--text-default)">Dropped files</span>
                <span class="text-body-xs text-(--text-muted)">{{ summary }}</span>
              </div>
            </div>

            <div
              class="flex max-h-64 min-w-0 flex-col gap-(--spacing-xxs) overflow-auto overscroll-contain"
            >
              <div
                v-for="file in files"
                :key="file.path"
                class="flex min-w-0 items-center gap-(--spacing-sm) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
              >
                <i
                  class="pi pi-file shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span
                  class="min-w-0 truncate font-(family-name:--font-code) text-body-xs text-(--text-default)"
                  :title="file.path"
                >
                  {{ file.path }}
                </span>
                <span class="ml-auto shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                  {{ formatBytes(file.size) }}
                </span>
              </div>
            </div>
          </div>
        </PanelContent>

        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            label="Cancel"
            kind="text"
            size="medium"
            @click="open = false"
          />
          <Button
            class="w-full md:w-auto"
            :label="`Deploy to ${environment}`"
            kind="primary"
            size="medium"
            data-testid="drop-deploy-dialog__deploy"
            @click="deploy"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
