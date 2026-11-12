<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Switch from '@aziontech/webkit/switch'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  const SUBJECT = 'firewall'
  const PAGE_DESCRIPTION =
    'Rules run top to bottom on every request this firewall sees, until one of them refuses it. Turn a rule off to skip it without losing its place.'
  const PHASES = [{ value: 'request', label: 'Request' }]

  const rule = (id, name, description, phase, author, modified, options = {}) => ({
    id,
    name,
    description,
    phase,
    author,
    modified,
    active: options.active ?? true,
    locked: options.locked ?? false
  })

  const seed = () => ({
    request: [
      rule(
        'fw-office',
        'Allow office network',
        'Lets the office network through before any other rule looks at it.',
        'request',
        'Maya Chen',
        '2 months ago'
      ),
      rule(
        'fw-scanners',
        'Block scanners',
        'Refuses requests from the scanner network list.',
        'request',
        'Leo Park',
        '3 weeks ago'
      ),
      rule(
        'fw-login-rate',
        'Rate limit sign-in',
        'Allows 20 sign-in requests per minute from one address.',
        'request',
        'Ana Ruiz',
        '6 days ago'
      ),
      rule(
        'fw-geo',
        'Restrict countries',
        'Refuses requests from countries outside the allowed list.',
        'request',
        'Sam Okafor',
        '1 month ago',
        { active: false }
      ),
      rule(
        'fw-waf-api',
        'WAF on API',
        'Runs the API rule set on every request to the API path.',
        'request',
        'Maya Chen',
        'yesterday'
      )
    ]
  })

  const INITIAL_EDITS = []
  const INITIAL_SEARCH = ''
  const INITIAL_LOADING = false
  const REVIEW_ON_START = false
  const FAILED_ON_START = false
  const SAVE_FAILURES = 0

  const rules = reactive(seed())
  const phaseLabel = (phase) => PHASES.find((item) => item.value === phase)?.label ?? phase

  const snapshot = () => ({
    order: Object.fromEntries(PHASES.map(({ value }) => [value, rules[value].map((r) => r.id)])),
    active: Object.fromEntries(
      PHASES.flatMap(({ value }) => rules[value].map((r) => [r.id, r.active]))
    )
  })
  const saved = ref(snapshot())

  for (const edit of INITIAL_EDITS) {
    const list = rules[edit.phase]
    const from = list.findIndex((item) => item.id === edit.id)
    if (from < 0) continue
    if (edit.to !== undefined) list.splice(edit.to, 0, ...list.splice(from, 1))
    if (edit.active !== undefined)
      list[list.findIndex((item) => item.id === edit.id)].active = edit.active
  }

  const loading = ref(INITIAL_LOADING)
  const search = ref(INITIAL_SEARCH)
  const searching = computed(() => search.value.trim().length > 0)
  const matches = (item) => {
    const term = search.value.trim().toLowerCase()
    if (!term) return true
    return [item.name, item.description, item.author].some((field) =>
      field.toLowerCase().includes(term)
    )
  }

  const openPhases = ref(PHASES.map((item) => item.value))
  watch(search, () => {
    if (!searching.value) return
    const hits = PHASES.filter(({ value }) => rules[value].some(matches)).map(({ value }) => value)
    openPhases.value = [...new Set([...openPhases.value, ...hits])]
  })

  const groups = computed(() =>
    PHASES.map((phase) => {
      const list = rules[phase.value]
      return {
        ...phase,
        total: list.length,
        items: list.filter(matches)
      }
    })
  )

  const saving = ref(false)
  const pinned = (phase) => {
    const list = rules[phase]
    let count = 0
    while (count < list.length && list[count].locked) count += 1
    return count
  }
  const canReorder = (phase) =>
    !searching.value && !saving.value && rules[phase].length - pinned(phase) > 1
  const canMove = (phase, index, direction) => {
    if (!canReorder(phase) || index < pinned(phase)) return false
    const to = index + direction
    return to >= pinned(phase) && to < rules[phase].length
  }
  const lockReason = (phase, item) => {
    if (item.locked) return 'The default rule runs first and stays first.'
    if (searching.value) return 'Clear the search to change the order rules run in.'
    if (saving.value) return 'Wait for the save to finish.'
    if (!canReorder(phase)) return 'There is no other rule in this phase to move it past.'
    return ''
  }

  const announcement = ref('')
  const announce = (text) => {
    announcement.value = ''
    nextTick(() => {
      announcement.value = text
    })
  }

  const listEl = ref(null)
  const focusControl = (id, control) =>
    nextTick(() => {
      const row = listEl.value?.querySelector(`[data-rule-id="${id}"]`)
      const target = row?.querySelector(`[data-control="${control}"]`)
      const usable =
        target && !target.disabled
          ? target
          : (row?.querySelector('[data-control]:not(:disabled)') ??
            row?.closest('[data-reorder-row]')?.querySelector('[data-reorder-handle]'))
      usable?.focus({ preventScroll: false })
    })

  const moveTo = (phase, from, to, control) => {
    const list = rules[phase]
    const head = pinned(phase)
    const target = Math.min(Math.max(to, head), list.length - 1)
    if (from < head || target === from || !canReorder(phase)) return
    const [moved] = list.splice(from, 1)
    list.splice(target, 0, moved)
    announce(
      `${moved.name} moved to position ${target + 1} of ${list.length} in the ${phaseLabel(phase)} phase.`
    )
    if (control) focusControl(moved.id, control)
  }
  const step = (phase, index, direction, control) => {
    if (!canMove(phase, index, direction)) return
    moveTo(phase, index, index + direction, control)
  }

  const position = (phase, item) => rules[phase].indexOf(item)
  const reorderRows = (phase, next) => {
    if (searching.value) return
    rules[phase] = next
  }
  const reorderable = (phase) => (row) => !lockReason(phase, row)

  const columns = [
    { id: 'move', header: 'Move', width: 96, hideable: false },
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false },
    { accessorKey: 'description', header: 'Description', grow: 3 },
    { id: 'status', header: 'Status', width: 152 },
    { accessorKey: 'modified', header: 'Last modified', grow: 2 }
  ]

  const setActive = (item, value) => {
    item.active = value
  }

  const dirty = computed(() => JSON.stringify(snapshot()) !== JSON.stringify(saved.value))
  const changes = computed(() =>
    PHASES.map((phase) => ({
      ...phase,
      items: rules[phase.value].flatMap((item, index) => {
        const lines = []
        const before = saved.value.order[phase.value].indexOf(item.id)
        if (before !== index) {
          lines.push({
            key: `${item.id}-order`,
            name: item.name,
            text: `moves from position ${before + 1} to ${index + 1}`
          })
        }
        if (saved.value.active[item.id] !== item.active) {
          lines.push({
            key: `${item.id}-status`,
            name: item.name,
            text: item.active ? 'is turned on' : 'is turned off'
          })
        }
        return lines
      })
    })).filter((phase) => phase.items.length)
  )
  const changeCount = computed(() =>
    changes.value.reduce((sum, phase) => sum + phase.items.length, 0)
  )

  const discard = () => {
    for (const { value } of PHASES) {
      const byId = Object.fromEntries(rules[value].map((item) => [item.id, item]))
      rules[value] = saved.value.order[value].map((id) => byId[id]).filter(Boolean)
      for (const item of rules[value]) item.active = saved.value.active[item.id]
    }
    announce('Changes discarded. The rules are back in their saved order.')
  }

  const reviewOpen = ref(REVIEW_ON_START)
  const saveFailed = ref(FAILED_ON_START)
  let failuresLeft = SAVE_FAILURES
  const openReview = () => {
    saveFailed.value = false
    reviewOpen.value = true
  }
  const save = () => {
    if (saving.value) return
    saving.value = true
    saveFailed.value = false
    setTimeout(() => {
      saving.value = false
      if (failuresLeft > 0) {
        failuresLeft -= 1
        saveFailed.value = true
        return
      }
      saved.value = snapshot()
      reviewOpen.value = false
      setTimeout(() => listEl.value?.focus(), 0)
      toast.success('Rule order saved.', {
        description: `The ${SUBJECT} runs its rules in the new order.`
      })
    }, 900)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Rules"
        :description="PAGE_DESCRIPTION"
        size="small"
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/rules"
            target="_blank"
          />
          <Button
            label="Add Rule"
            icon="pi pi-plus"
            kind="outlined"
            size="medium"
          />
        </template>
      </PageHeader>

      <section
        ref="listEl"
        tabindex="-1"
        class="layout-section-start flex min-w-0 flex-1 flex-col gap-(--layout-group-gap) pb-(--layout-boundary-end) outline-none"
        aria-label="Rules by phase"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
          <div class="min-w-36 grow basis-(--container-2xs)">
            <Input
              v-model="search"
              size="medium"
              placeholder="Search rules"
              aria-label="Search rules"
              class="w-full"
              :disabled="loading"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
        </div>

        <Alert
          v-if="searching"
          severity="info"
          label="Reordering is off while a search narrows the list. Clear the search to change the order rules run in."
        />

        <Card :padded="false">
          <template #content>
            <Accordion
              v-model="openPhases"
              type="multiple"
              size="large"
              arrow-position="left"
            >
              <Accordion.Item
                v-for="group in groups"
                :key="group.value"
                :value="group.value"
              >
                <Accordion.Trigger :level="2">
                  <span class="flex min-w-0 items-center gap-(--spacing-sm)">
                    <span class="truncate">{{ group.label }} phase</span>
                    <span
                      class="shrink-0 text-body-xs tabular-nums text-(--text-muted)"
                      :data-testid="`rules-list__count-${group.value}`"
                    >
                      {{
                        loading
                          ? 'Loading'
                          : searching
                            ? `${group.items.length} of ${group.total}`
                            : `${group.total} ${group.total === 1 ? 'rule' : 'rules'}`
                      }}
                    </span>
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div>
                    <TableRoot
                      v-if="loading || group.total"
                      :data="loading ? [] : group.items"
                      :columns="columns"
                      row-key="id"
                      :bordered="false"
                      :loading="loading"
                      reorderable
                      :row-reorderable="reorderable(group.value)"
                      :aria-label="`${group.label} phase rules, in the order they run`"
                      @update:data="reorderRows(group.value, $event)"
                    >
                      <template #cell-move="{ row }">
                        <div
                          :data-rule-id="row.id"
                          class="flex items-center gap-(--spacing-xxs)"
                        >
                          <Tooltip :text="lockReason(group.value, row) || 'Move up'">
                            <IconButton
                              icon="pi pi-chevron-up"
                              kind="outlined"
                              size="small"
                              data-control="up"
                              :aria-label="
                                lockReason(group.value, row)
                                  ? `Move ${row.name} up. ${lockReason(group.value, row)}`
                                  : `Move ${row.name} up`
                              "
                              :disabled="!canMove(group.value, position(group.value, row), -1)"
                              @click="step(group.value, position(group.value, row), -1, 'up')"
                            />
                          </Tooltip>
                          <Tooltip :text="lockReason(group.value, row) || 'Move down'">
                            <IconButton
                              icon="pi pi-chevron-down"
                              kind="outlined"
                              size="small"
                              data-control="down"
                              :aria-label="
                                lockReason(group.value, row)
                                  ? `Move ${row.name} down. ${lockReason(group.value, row)}`
                                  : `Move ${row.name} down`
                              "
                              :disabled="!canMove(group.value, position(group.value, row), 1)"
                              @click="step(group.value, position(group.value, row), 1, 'down')"
                            />
                          </Tooltip>
                        </div>
                      </template>
                      <template #cell-name="{ row }">
                        <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                          <a
                            :href="`#rule-${row.id}`"
                            data-rule-name
                            class="min-w-0 truncate rounded-(--shape-button) text-(--text-default) underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                            >{{ row.name }}</a
                          >
                          <Tag
                            v-if="row.locked"
                            label="Default"
                            severity="secondary"
                            size="small"
                          />
                        </div>
                      </template>
                      <template #cell-description="{ row }">
                        <span class="min-w-0 truncate text-(--text-muted)">{{
                          row.description
                        }}</span>
                      </template>
                      <template #cell-status="{ row }">
                        <div class="flex min-h-10 min-w-0 items-center">
                          <Field orientation="horizontal">
                            <Switch
                              :model-value="row.active"
                              :disabled="row.locked || saving"
                              :aria-label="`Run ${row.name}`"
                              @update:model-value="setActive(row, $event)"
                            />
                            <Field.Label>
                              <span
                                class="text-body-sm"
                                aria-hidden="true"
                                >{{ row.active ? 'Active' : 'Inactive' }}</span
                              >
                            </Field.Label>
                          </Field>
                        </div>
                      </template>
                      <template #cell-modified="{ row }">
                        <span class="min-w-0 truncate text-body-sm text-(--text-muted)"
                          >{{ row.modified }} by {{ row.author }}</span
                        >
                      </template>
                      <template #empty>
                        <p
                          class="m-0 px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                        >
                          No {{ group.label.toLowerCase() }} rule matches “{{ search.trim() }}”.
                        </p>
                      </template>
                    </TableRoot>
                    <EmptyState
                      v-else
                      size="small"
                      :title="`No ${group.label.toLowerCase()} rules yet`"
                      :description="`Add a rule to act on every ${group.label.toLowerCase()} this ${SUBJECT} handles.`"
                    >
                      <template #actions>
                        <Button
                          label="Add Rule"
                          icon="pi pi-plus"
                          kind="outlined"
                          size="medium"
                        />
                      </template>
                    </EmptyState>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </template>
        </Card>

        <p
          role="status"
          aria-live="polite"
          class="sr-only"
          data-testid="rules-list__announcer"
        >
          {{ announcement }}
        </p>
      </section>

      <SaveBar v-if="dirty">
        {{ changeCount }} {{ changeCount === 1 ? 'change' : 'changes' }} to the rules, not saved
        yet.
        <template #actions>
          <Button
            type="button"
            label="Discard"
            kind="outlined"
            size="medium"
            :disabled="saving"
            @click="discard"
          />
          <Button
            type="button"
            label="Review changes"
            kind="primary"
            size="medium"
            :disabled="saving"
            @click="openReview"
          />
        </template>
      </SaveBar>
    </div>

    <Dialog
      v-model:open="reviewOpen"
      :dismissible="!saving"
      size="medium"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <DialogTitle>Review changes</DialogTitle>
            <DialogClose />
          </PanelHeader>
          <PanelContent>
            <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
              <Alert
                v-if="saveFailed"
                severity="danger"
                label="The new order wasn't saved. The rules still run in the saved order; save again to apply it."
              />
              <DialogDescription>
                Rules run top to bottom within each phase. Saving applies this order to every
                {{ SUBJECT === 'firewall' ? 'request' : 'request and response' }} the
                {{ SUBJECT }} handles.
              </DialogDescription>
              <section
                v-for="phase in changes"
                :key="phase.value"
                class="flex min-w-0 flex-col gap-(--spacing-xs)"
                :aria-labelledby="`rules-review-${phase.value}`"
              >
                <h3
                  :id="`rules-review-${phase.value}`"
                  class="m-0 text-label-sm text-(--text-muted)"
                >
                  {{ phase.label }} phase
                </h3>
                <ul class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0">
                  <li
                    v-for="line in phase.items"
                    :key="line.key"
                    class="text-body-sm text-(--text-muted)"
                  >
                    <span class="font-medium text-(--text-default)">{{ line.name }}</span>
                    {{ line.text }}.
                  </li>
                </ul>
              </section>
            </div>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
              <div class="w-full md:w-fit">
                <Button
                  class="w-full"
                  type="button"
                  label="Cancel"
                  kind="outlined"
                  :disabled="saving"
                  @click="reviewOpen = false"
                />
              </div>
              <div class="w-full md:w-fit">
                <Button
                  class="w-full"
                  type="button"
                  :label="saveFailed ? 'Save again' : 'Save'"
                  kind="primary"
                  :loading="saving"
                  @click="save"
                />
              </div>
            </div>
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>

    <Toaster position="bottom-right" />
  </div>
</template>
