<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  import CreateDeployProgressDialog, {
    type DeployProgressDialogItem
  } from '../create-deploy-progress-dialog.vue'
  import { sampleDropItems, sampleDroppedFiles } from '../sample'

  const STEP_MS = 1400

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

  const items = ref<DeployProgressDialogItem[]>(sampleDropItems.map((item) => ({ ...item })))
  const open = ref(false)
  const dropOpen = ref(false)

  let stepTimer: ReturnType<typeof setTimeout> | undefined

  const noun = (count: number) => (count === 1 ? 'Deployment Setting' : 'Deployment Settings')

  const step = () => {
    const active = items.value.findIndex((item) => item.status === 'deploying')
    const next = items.value.findIndex((item) => item.status === 'queued')
    items.value = items.value.map((item, index) => {
      if (index === active) return { ...item, status: 'done', message: '' }
      if (index === next) return { ...item, status: 'deploying' }
      return item
    })
    if (next >= 0) stepTimer = setTimeout(step, STEP_MS)
  }

  const run = () => {
    clearTimeout(stepTimer)
    step()
  }

  const requeue = (keys: Set<string>) => {
    items.value = items.value.map((item) =>
      keys.has(item.id) ? { ...item, status: 'queued', message: '' } : item
    )
    run()
  }

  const onRetry = (_event: MouseEvent, failed: DeployProgressDialogItem[]) =>
    requeue(new Set(failed.map((item) => item.id)))

  const onRedeploy = () => requeue(new Set(items.value.map((item) => item.id)))

  const deployDropped = () => {
    dropOpen.value = false
    open.value = true
    run()
  }

  onMounted(() => {
    dropOpen.value = true
  })

  onBeforeUnmount(() => clearTimeout(stepTimer))

  const FILE_LIST_CLASS =
    'm-0 flex max-h-64 min-w-0 list-none flex-col gap-(--spacing-2xs) overflow-auto overscroll-contain p-0 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <CreateDeployProgressDialog
    v-model:open="open"
    :items="items"
    @retry="onRetry"
    @redeploy="onRedeploy"
  >
    <template #actions>
      <Button
        label="Deploy a folder"
        variant="outline"
        size="medium"
        icon="az az-upload"
        @click="dropOpen = true"
      />
    </template>
  </CreateDeployProgressDialog>

  <Dialog
    v-model:open="dropOpen"
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
              now. Production deploys with {{ items.length }} {{ noun(items.length) }}.
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
              @click="dropOpen = false"
            />
          </div>
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              label="Deploy to Production"
              variant="primary"
              size="medium"
              icon="az az-cloud-upload"
              @click="deployDropped"
            />
          </div>
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
