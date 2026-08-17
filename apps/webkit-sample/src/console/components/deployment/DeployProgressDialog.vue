<script setup>
  // Deploying into SEVERAL Deployment settings at once, watched live.
  //
  // Each target activates INDEPENDENTLY — one failing does not roll the others back — so
  // a single spinner would be a lie. This dialog is one row per target with its own
  // status, and it says the thing that matters when something fails: the ones that
  // succeeded stay live.
  //
  // It is NOT dismissible while the run is in flight: closing it would suggest the
  // deploys were cancelled, and they are not. Once everything has settled, Close is
  // real, and Retry is offered only for the rows that failed.
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref, watch } from 'vue'

  const props = defineProps({
    // `[{ id, name, status: 'deploying'|'done'|'failed'|'skipped', message, environments }]`
    items: { type: Array, default: () => [] }
  })

  const emit = defineEmits(['retry'])

  const open = defineModel('open', { type: Boolean, default: false })

  // The filter resets on every open: a filter kept from the last run hides rows of this
  // one, which is the worst possible moment to hide a row.
  const filter = ref('all')
  watch(open, (isOpen) => {
    if (isOpen) filter.value = 'all'
  })

  const counts = computed(() => {
    const total = props.items.length
    const done = props.items.filter((item) => item.status === 'done').length
    const failed = props.items.filter((item) => item.status === 'failed').length
    const skipped = props.items.filter((item) => item.status === 'skipped').length
    return { total, done, failed, skipped, settled: done + failed + skipped }
  })

  const running = computed(() => counts.value.settled < counts.value.total)

  const activeName = computed(
    () => props.items.find((item) => item.status === 'deploying')?.name ?? ''
  )

  const filterOptions = computed(() => [
    { value: 'all', label: 'All' },
    { value: 'deploying', label: `Deploying ${counts.value.total - counts.value.settled}` },
    { value: 'failed', label: `Failed ${counts.value.failed}` },
    { value: 'done', label: `Done ${counts.value.done}` }
  ])

  const visibleItems = computed(() =>
    filter.value === 'all'
      ? props.items
      : props.items.filter((item) => item.status === filter.value)
  )

  // The title states the OUTCOME, so a run with a failure never announces itself as a
  // clean deploy. "Deployed 2 Deployment settings" with one row failed is the kind of
  // heading a reader trusts and then gets burned by. A SKIPPED target is not a deploy
  // either — a setting no workload publishes with has nothing to deploy to — so it is
  // counted out of the headline rather than folded into it.
  const title = computed(() => {
    const { total, done, failed, settled, skipped } = counts.value
    const noun = total === 1 ? 'Deployment setting' : 'Deployment settings'
    if (running.value) return `Deploying ${settled} of ${total}…`
    if (skipped === total) return `Nothing to deploy in ${total} ${noun}`
    if (failed || skipped) return `Deployed ${done} of ${total} ${noun}`
    return `Deployed ${total} ${noun}`
  })

  // Skipped is only named when there is one: a tally that always lists every outcome
  // teaches the reader to stop reading it.
  const tally = computed(() => {
    const { done, failed, skipped } = counts.value
    const parts = [`${done} succeeded`, `${failed} failed`]
    if (skipped) parts.push(`${skipped} skipped`)
    return parts.join(', ')
  })

  const STATUS_TAG = {
    deploying: { label: 'Deploying', severity: 'info' },
    done: { label: 'Done', severity: 'success', icon: 'pi pi-check-circle' },
    failed: { label: 'Failed', severity: 'danger', icon: 'pi pi-times-circle' },
    skipped: { label: 'Skipped', severity: 'warning', icon: 'pi pi-minus-circle' }
  }

  const close = () => {
    open.value = false
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
    :dismissible="!running"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
            <DialogTitle>{{ title }}</DialogTitle>
            <p class="text-body-sm text-[var(--text-muted)]">
              {{ tally }}. Each Deployment setting activates on its own, and the ones that succeeded
              stay live.
            </p>
          </div>
        </PanelHeader>

        <PanelContent class="flex flex-col gap-[var(--spacing-md)]">
          <div class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
            <ProgressBar
              :value="counts.total ? Math.round((counts.settled / counts.total) * 100) : 0"
            />
            <p
              v-if="activeName"
              class="text-body-sm text-[var(--text-muted)]"
            >
              Activating {{ activeName }}
            </p>
          </div>

          <SegmentedButton
            v-model="filter"
            :options="filterOptions"
            aria-label="Filter deploys by status"
          />

          <ul class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
            <li
              v-for="item in visibleItems"
              :key="item.id"
              class="flex min-w-0 items-start justify-between gap-[var(--spacing-sm)] rounded-[var(--shape-elements)] border border-[length:var(--border-width-default)] border-[var(--border-muted)] p-[var(--spacing-sm)]"
            >
              <span class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                  <i
                    class="ai ai-deploy-pillar shrink-0 text-[var(--text-muted)]"
                    aria-hidden="true"
                  />
                  <span class="truncate text-label-sm text-[var(--text-default)]">
                    {{ item.name }}
                  </span>
                </span>
                <span class="truncate text-body-xs text-[var(--text-muted)]">
                  {{ item.environments }}
                </span>
                <span
                  v-if="item.message"
                  class="text-body-xs text-[var(--text-muted)]"
                >
                  {{ item.message }}
                </span>
              </span>

              <span class="flex shrink-0 items-center gap-[var(--spacing-xs)]">
                <Spinner
                  v-if="item.status === 'deploying'"
                  class="size-4 text-[var(--text-muted)]"
                />
                <Tag
                  :label="STATUS_TAG[item.status].label"
                  :severity="STATUS_TAG[item.status].severity"
                  :icon="STATUS_TAG[item.status].icon"
                  size="medium"
                />
              </span>
            </li>
          </ul>
        </PanelContent>

        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            v-if="counts.failed && !running"
            class="w-full md:w-auto"
            label="Retry failed"
            kind="outlined"
            size="medium"
            icon="pi pi-refresh"
            @click="emit('retry')"
          />
          <Button
            class="w-full md:w-auto"
            label="Close"
            kind="primary"
            size="medium"
            :disabled="running"
            @click="close"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
