<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import Tag from '@aziontech/ui/tag'
  import { useLocale } from '@aziontech/ui/use-locale'

  import { sampleDroppedFiles } from '../sample'

  export interface DropConfirmDialogProps {
    /** How many Deployment Settings production deploys with. */
    count: number
  }

  defineProps<DropConfirmDialogProps>()

  const emit = defineEmits<{
    /** Deploy was pressed. */
    deploy: []
  }>()

  /** Whether the dialog is open. */
  const open = defineModel<boolean>('open', { default: false })

  const { formatNumber } = useLocale()

  const sizeFormat = (value: number) =>
    formatNumber(value, {
      style: 'unit',
      unit: 'kilobyte',
      unitDisplay: 'short',
      maximumFractionDigits: 1
    })

  const formatSize = (bytes: number) => sizeFormat(bytes / 1000)

  const FILE_LIMIT = 100
  const shownFiles = sampleDroppedFiles.slice(0, FILE_LIMIT)
  const hiddenFileCount = sampleDroppedFiles.length - shownFiles.length

  const manifest = `${sampleDroppedFiles.length} files · ${formatSize(
    sampleDroppedFiles.reduce((total, file) => total + file.size, 0)
  )}`

  const noun = (count: number) => (count === 1 ? 'Deployment Setting' : 'Deployment Settings')

  const FILE_LIST_CLASS =
    'm-0 flex max-h-64 min-w-0 list-none flex-col gap-(--spacing-2xs) overflow-auto overscroll-contain p-0 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>New production deployment</DialogTitle>
      </PanelHeader>

      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-body-sm text-(--text-default)">web-app</span>
              <Tag
                label="Production"
                severity="neutral"
                size="small"
                class="shrink-0"
              />
            </div>
            <DialogDescription>
              These files ship as the new production version of web-app, replacing the one serving
              now. Production deploys with {{ count }} {{ noun(count) }}.
            </DialogDescription>
          </div>

          <div
            class="flex min-w-0 flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm)"
          >
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <i
                class="az az-folder shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-body-sm text-(--text-default)">Dropped files</span>
                <span class="text-body-xs text-(--text-muted)">{{ manifest }}</span>
              </div>
            </div>
            <ul
              aria-label="Dropped files"
              tabindex="0"
              :class="FILE_LIST_CLASS"
            >
              <li
                v-for="file in shownFiles"
                :key="file.path"
                class="flex min-w-0 items-center gap-(--spacing-sm) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
              >
                <i
                  class="az az-file shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span
                  dir="ltr"
                  class="min-w-0 truncate text-body-code-sm text-(--text-default)"
                  :title="file.path"
                >
                  {{ file.path }}
                </span>
                <span class="ms-auto shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                  {{ formatSize(file.size) }}
                </span>
              </li>
              <li
                v-if="hiddenFileCount > 0"
                class="px-(--spacing-sm) py-(--spacing-xs) text-body-xs text-(--text-muted)"
              >
                and {{ hiddenFileCount }} more
              </li>
            </ul>
          </div>
        </div>
      </PanelBody>

      <PanelFooter>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              label="Cancel"
              variant="ghost"
              size="medium"
              @click="open = false"
            />
          </div>
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              label="Deploy to Production"
              variant="primary"
              size="medium"
              icon="az az-cloud-upload"
              @click="emit('deploy')"
            />
          </div>
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
