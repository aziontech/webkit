<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { daysAgo } from '@shared/lib/dates'
  import { authorAt } from '@shared/lib/people'
  import { computed, nextTick, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { DRAG_ROW_CLASS, useDragReorder } from '../../../lib/behavior/drag-reorder'
  import { MORPH_TRANSITION } from '../../../lib/behavior/list-morph'
  import { useTabDirty } from '../../../lib/behavior/tab-dirty'
  import { useVersionChange } from '../../../lib/behavior/version-commit'
  import { bindingRecord, bindingRuleDraft } from '../../../lib/data/create-bindings'
  import { productFirstUse } from '../../../lib/data/product-empty-states'
  import CreateRuleDrawer from '../CreateRuleDrawer.vue'

  const HELP = productFirstUse('applications').learnMore.href

  const PHASES = [
    { value: 'request', label: 'Request' },
    { value: 'response', label: 'Response' }
  ]

  const condition = (variable, operator, argument = '') => ({
    id: `${variable}-${operator}-${argument}`,
    join: null,
    variable,
    operator,
    argument
  })

  const withAuthors = (byPhase) => {
    let index = 0
    return Object.fromEntries(
      Object.entries(byPhase).map(([key, list]) => [
        key,
        list.map((rule) => {
          const person = authorAt(index++)
          return { ...rule, author: person.name, authorAvatar: person.avatar }
        })
      ])
    )
  }

  const seed = () =>
    withAuthors({
      request: [
        {
          id: 're-maintenance',
          name: 'Maintenance page',
          description: 'Serves the maintenance page while the header is set.',
          phase: 'request',
          criteria: [{ id: 'c1', conditions: [condition('${http_x_maintenance}', 'exists')] }],
          behaviors: [{ id: 'b1', type: 'deliver' }],
          status: 'Inactive',
          modifiedAt: daysAgo(34)
        },
        {
          id: 're-www',
          name: 'Redirect www',
          description: 'Sends the www host to the apex domain.',
          phase: 'request',
          criteria: [{ id: 'c2', conditions: [condition('${host}', 'matches', 'www.*')] }],
          behaviors: [{ id: 'b2', type: 'redirect-301', target: 'https://edgeflow.com${uri}' }],
          status: 'Active',
          modifiedAt: daysAgo(12)
        },
        {
          id: 're-gateway',
          name: 'API gateway',
          description: 'Sends API traffic to the gateway connector, through the auth handler.',
          phase: 'request',
          criteria: [{ id: 'c3', conditions: [condition('${uri}', 'matches', '/api/*')] }],
          behaviors: [
            { id: 'b3', type: 'set-connector', connectorId: '7710021' },
            { id: 'b3b', type: 'run-function', functionId: '4021884' }
          ],
          status: 'Active',
          modifiedAt: daysAgo(2)
        },
        {
          id: 're-docs',
          name: 'Docs rewrite',
          description: 'Rewrites the docs path and caches it as a static asset.',
          phase: 'request',
          criteria: [{ id: 'c4', conditions: [condition('${uri}', 'matches', '/docs/*')] }],
          behaviors: [
            { id: 'b4', type: 'rewrite-request', target: '/documentation${uri}' },
            { id: 'b4b', type: 'set-cache-policy', cacheId: 'cs-static' }
          ],
          status: 'Active',
          modifiedAt: daysAgo(21)
        },
        {
          id: 're-remote-port',
          name: 'Add remote port header',
          description: 'Adds the client port to every request reaching the origin.',
          phase: 'request',
          criteria: [{ id: 'c5', conditions: [condition('${uri}', 'matches', '/*')] }],
          behaviors: [
            { id: 'b5', type: 'add-request-header', target: 'x-remote-port: ${remote_port}' }
          ],
          status: 'Active',
          modifiedAt: daysAgo(58)
        }
      ],
      response: [
        {
          id: 're-cache-bypass',
          name: 'Cache bypass',
          description: 'Keeps API responses out of the cache.',
          phase: 'response',
          criteria: [{ id: 'c6', conditions: [condition('${uri}', 'matches', '/api')] }],
          behaviors: [{ id: 'b6', type: 'add-response-header', target: 'cache-control: no-store' }],
          status: 'Active',
          modifiedAt: daysAgo(5)
        },
        {
          id: 're-security-headers',
          name: 'Security headers',
          description: 'Adds the security header set to successful responses.',
          phase: 'response',
          criteria: [{ id: 'c7', conditions: [condition('${status}', 'is-equal', '200')] }],
          behaviors: [
            {
              id: 'b7',
              type: 'add-response-header',
              target: 'strict-transport-security: max-age=31536000'
            }
          ],
          status: 'Active',
          modifiedAt: daysAgo(9)
        },
        {
          id: 're-compress',
          name: 'Compress assets',
          description: 'Compresses script bundles on the way out.',
          phase: 'response',
          criteria: [{ id: 'c8', conditions: [condition('${uri}', 'matches', '*.js')] }],
          behaviors: [{ id: 'b8', type: 'enable-gzip' }],
          status: 'Inactive',
          modifiedAt: daysAgo(47)
        }
      ]
    })

  const rules = ref(seed())

  const search = ref('')
  const searching = computed(() => search.value.trim().length > 0)

  const visibleByPhase = computed(() => {
    const term = search.value.trim().toLowerCase()
    return Object.fromEntries(
      PHASES.map(({ value }) => [
        value,
        term
          ? rules.value[value].filter((rule) =>
              [rule.name, rule.description, rule.status, rule.author].some((field) =>
                (field ?? '').toLowerCase().includes(term)
              )
            )
          : [...rules.value[value]]
      ])
    )
  })

  const openPhases = ref(PHASES.map((item) => item.value))

  watch(search, () => {
    if (!searching.value) return
    const hits = PHASES.filter((item) => visibleByPhase.value[item.value].length).map(
      (item) => item.value
    )
    openPhases.value = [...new Set([...openPhases.value, ...hits])]
  })

  const revealPhase = (value) => {
    if (!openPhases.value.includes(value)) openPhases.value = [...openPhases.value, value]
  }

  const orderOf = (value) =>
    JSON.stringify({
      request: value.request.map((rule) => rule.id),
      response: value.response.map((rule) => rule.id)
    })

  const savedOrder = ref(orderOf(rules.value))
  let savedRows = { request: [...rules.value.request], response: [...rules.value.response] }

  const dirty = computed(() => orderOf(rules.value) !== savedOrder.value)
  const saving = ref(false)

  const noteChange = useVersionChange()

  const saveOrder = async () => {
    if (saving.value) return
    saving.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      savedOrder.value = orderOf(rules.value)
      savedRows = { request: [...rules.value.request], response: [...rules.value.response] }
      noteChange('Reorder Rules Engine rules')
      toast.success('Rule order saved.')
    } catch (error) {
      toast.error('Could not save the rule order.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => saveOrder() }
      })
    } finally {
      saving.value = false
    }
  }

  const discardOrder = () => {
    rules.value = { request: [...savedRows.request], response: [...savedRows.response] }
  }

  useTabDirty(
    'rules-engine',
    { dirty, saving },
    { label: 'Rule order changed.', save: saveOrder, discard: discardOrder }
  )

  const PINNED_RULES = 1

  const canReorder = (phase) => !searching.value && rules.value[phase].length > PINNED_RULES + 1

  const reorderers = Object.fromEntries(
    PHASES.map(({ value }) => [
      value,
      useDragReorder(() => rules.value[value], {
        enabled: () => canReorder(value),
        pinned: () => PINNED_RULES
      })
    ])
  )

  const groups = computed(() =>
    PHASES.map((item, index) => ({
      ...item,
      index,
      total: rules.value[item.value].length,
      rows: visibleByPhase.value[item.value],
      dnd: reorderers[item.value],
      open: openPhases.value.includes(item.value)
    }))
  )

  const lockReason = (phase, index) => {
    if (searching.value) return 'Clear the search to change the order rules run in.'
    if (index < PINNED_RULES) return `The first ${phase} rule runs first and stays first.`
    if (!reorderers[phase].canMove(index)) {
      return 'There is no other rule in this phase to move it past.'
    }
    return ''
  }

  const positionDraft = ref(null)

  const rulePosition = (rule) => rules.value[rule.phase].indexOf(rule) + 1

  const positionValue = (rule) =>
    positionDraft.value?.id === rule.id ? positionDraft.value.value : String(rulePosition(rule))

  const onPositionInput = (rule, value) => {
    positionDraft.value = { id: rule.id, value }
  }

  const commitPosition = (phase, index, field) => {
    const draft = positionDraft.value
    positionDraft.value = null
    if (!draft) return
    const typed = Number.parseInt(draft.value, 10)
    if (!Number.isFinite(typed)) return
    field?.blur()
    const to = reorderers[phase].moveTo(index, typed)
    if (to === index || !field) return
    nextTick(() => field.focus({ preventScroll: true }))
  }

  const cancelPosition = () => {
    positionDraft.value = null
  }

  const drawerOpen = ref(false)
  const editingRule = ref(null)
  const draftRule = ref(null)

  const openCreate = () => {
    editingRule.value = null
    draftRule.value = null
    drawerOpen.value = true
  }

  const openRule = (rule) => {
    editingRule.value = rule
    draftRule.value = null
    drawerOpen.value = true
  }

  const route = useRoute()
  const router = useRouter()

  const clearHandoff = () => {
    if (!route.query.bind) return
    const query = { ...route.query }
    delete query.bind
    delete query.record
    router.replace({ query })
  }

  watch(
    () => [route.query.bind, route.query.record],
    ([resource, id]) => {
      const record = bindingRecord(String(resource ?? ''), String(id ?? ''))
      const draft = bindingRuleDraft(String(resource ?? ''), record, 'application')
      if (!draft) return
      editingRule.value = null
      draftRule.value = draft
      drawerOpen.value = true
    },
    { immediate: true }
  )

  watch(drawerOpen, (isOpen) => {
    if (isOpen) return
    draftRule.value = null
    clearHandoff()
  })

  const stampModified = (rule) => {
    const person = authorAt(0)
    return { ...rule, modifiedAt: new Date(), author: person.name, authorAvatar: person.avatar }
  }

  const onCreated = (created) => {
    const rule = stampModified(created)
    rules.value[rule.phase] = [...rules.value[rule.phase], rule]
    savedOrder.value = orderOf(rules.value)
    savedRows = { request: [...rules.value.request], response: [...rules.value.response] }
    revealPhase(rule.phase)
    noteChange(`Add rule "${rule.name}"`)
  }

  const onUpdated = (saved) => {
    const rule = stampModified(saved)
    const previous = editingRule.value
    for (const key of ['request', 'response']) {
      rules.value[key] = rules.value[key].filter((item) => item.id !== rule.id)
    }
    if (previous && previous.phase === rule.phase) {
      const index = savedRows[rule.phase].findIndex((item) => item.id === rule.id)
      const next = [...rules.value[rule.phase]]
      next.splice(index < 0 ? next.length : index, 0, rule)
      rules.value[rule.phase] = next
    } else {
      rules.value[rule.phase] = [...rules.value[rule.phase], rule]
    }
    savedOrder.value = orderOf(rules.value)
    savedRows = { request: [...rules.value.request], response: [...rules.value.response] }
    revealPhase(rule.phase)
    editingRule.value = null
  }
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col">
    <div class="layout-column layout-boundary flex min-w-0 flex-1 flex-col pb-0">
      <PageHeading
        title="Rules Engine"
        description="Conditional rules applied to requests and responses. Rules run top to bottom within each phase, so their order is their behavior."
        size="small"
        :documentation="HELP"
      >
        <template #actions>
          <HeadingAction
            label="Add Rule"
            kind="outlined"
            icon="pi pi-plus"
            @click="openCreate"
          />
        </template>
      </PageHeading>

      <section
        class="layout-section-start flex min-w-0 flex-1 flex-col gap-(--layout-section-gap) pb-(--layout-boundary-end)"
      >
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader>
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search rules"
              aria-label="Search rules"
              class="min-w-36 grow basis-(--container-2xs)"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>
          </ControlsHeader>

          <Message
            v-if="searching"
            severity="info"
            label="Reordering is unavailable while a search narrows the list. Clear the search to change the order rules run in."
          />

          <CardBox :padded="false">
            <template #content>
              <Table :border="false">
                <Table.Header>
                  <Table.Row>
                    <Table.HeadCell
                      align="center"
                      class="w-48 flex-none!"
                    >
                      <span class="sr-only">Order</span>
                    </Table.HeadCell>
                    <Table.HeadCell principal>Name</Table.HeadCell>
                    <Table.HeadCell :grow="3">Description</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell :grow="2">Last Modified</Table.HeadCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Accordion
                    v-model:value="openPhases"
                    type="multiple"
                    size="large"
                    arrow-position="left"
                  >
                    <Accordion.Item
                      v-for="group in groups"
                      :key="group.value"
                      :value="group.value"
                    >
                      <Accordion.Trigger
                        :class="[
                          'bg-(--bg-canvas)! [&>span]:flex-1!',
                          group.index > 0 ? 'border-t border-(--border-default)' : '',
                          group.open ? '' : 'border-b-0!'
                        ]"
                      >
                        <span class="flex min-w-0 items-center gap-(--spacing-sm)">
                          <span class="truncate text-label-sm text-(--text-default)">
                            {{ group.label }}
                          </span>
                          <span class="shrink-0 text-body-xs text-(--text-muted) tabular-nums">
                            {{
                              searching
                                ? `${group.rows.length} of ${group.total}`
                                : `${group.total} ${group.total === 1 ? 'rule' : 'rules'}`
                            }}
                          </span>
                        </span>
                      </Accordion.Trigger>

                      <Accordion.Content>
                        <TransitionGroup
                          tag="div"
                          class="relative flex w-full flex-col [&>*:last-child_[role=row]]:border-b-0"
                          v-bind="MORPH_TRANSITION"
                        >
                          <div
                            v-for="(rule, index) in group.rows"
                            :key="rule.id"
                            data-drag-row
                            :data-dragging="group.dnd.isDragging(index) || null"
                            :data-drop="group.dnd.isDropTarget(index) || null"
                            :class="['w-full', DRAG_ROW_CLASS]"
                            @dragenter.prevent="group.dnd.onDragEnter(index)"
                            @dragover.prevent
                            @drop="group.dnd.drop(index)"
                          >
                            <Table.Row @click="openRule(rule)">
                              <Table.Cell
                                align="center"
                                class="w-48 flex-none! gap-(--spacing-xxs)"
                                @click.stop
                              >
                                <span class="w-14 shrink-0 [&>span]:w-full">
                                  <Tooltip
                                    key="position-locked"
                                    v-if="lockReason(group.value, index)"
                                    :text="lockReason(group.value, index)"
                                  >
                                    <InputText
                                      :model-value="positionValue(rule)"
                                      size="small"
                                      disabled
                                      class="[&_input]:text-center [&_input]:tabular-nums"
                                      :aria-label="`Position ${rulePosition(rule)} in the ${group.label} phase. ${lockReason(group.value, index)}`"
                                    />
                                  </Tooltip>
                                  <Tooltip
                                    key="position"
                                    v-else
                                    text="Type a position to move the rule there"
                                  >
                                    <InputText
                                      :model-value="positionValue(rule)"
                                      size="small"
                                      inputmode="numeric"
                                      class="[&_input]:text-center [&_input]:tabular-nums"
                                      :aria-label="`Position of ${rule.name} in the ${group.label} phase. Type a number from ${PINNED_RULES + 1} to ${group.rows.length} to move it.`"
                                      @update:model-value="onPositionInput(rule, $event)"
                                      @focus="$event.target.select()"
                                      @keydown.enter.prevent="
                                        commitPosition(group.value, index, $event.target)
                                      "
                                      @keydown.esc.prevent="cancelPosition()"
                                      @blur="commitPosition(group.value, index, $event.target)"
                                    />
                                  </Tooltip>
                                </span>
                                <Tooltip
                                  key="grip-locked"
                                  v-if="lockReason(group.value, index)"
                                  :text="lockReason(group.value, index)"
                                >
                                  <IconButton
                                    icon="pi pi-bars"
                                    kind="outlined"
                                    size="small"
                                    disabled
                                    :aria-label="`${rule.name} cannot be reordered. ${lockReason(group.value, index)}`"
                                  />
                                </Tooltip>
                                <Tooltip
                                  key="grip"
                                  v-else
                                  text="Drag to reorder, or use the arrow keys"
                                  draggable="true"
                                  class="cursor-grab active:cursor-grabbing"
                                  @dragstart="group.dnd.onDragStart(index, $event)"
                                  @dragend="group.dnd.onDragEnd"
                                  @keydown.up.prevent="group.dnd.move(index, -1)"
                                  @keydown.down.prevent="group.dnd.move(index, 1)"
                                >
                                  <IconButton
                                    icon="pi pi-bars"
                                    kind="outlined"
                                    size="small"
                                    class="cursor-grab active:cursor-grabbing"
                                    :aria-label="`Reorder ${rule.name}. Position ${index + 1} of ${group.rows.length} in the ${group.label} phase. Use the arrow keys to move it.`"
                                  />
                                </Tooltip>
                                <Tooltip text="Move up">
                                  <IconButton
                                    icon="pi pi-chevron-up"
                                    kind="outlined"
                                    size="small"
                                    :aria-label="`Move ${rule.name} up`"
                                    :disabled="!group.dnd.canMove(index, -1)"
                                    @click="group.dnd.move(index, -1)"
                                  />
                                </Tooltip>
                                <Tooltip text="Move down">
                                  <IconButton
                                    icon="pi pi-chevron-down"
                                    kind="outlined"
                                    size="small"
                                    :aria-label="`Move ${rule.name} down`"
                                    :disabled="!group.dnd.canMove(index, 1)"
                                    @click="group.dnd.move(index, 1)"
                                  />
                                </Tooltip>
                              </Table.Cell>
                              <Table.Cell
                                principal
                                clickable
                              >
                                <button
                                  type="button"
                                  class="min-w-0 cursor-pointer truncate rounded-(--shape-button) text-left outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                  @click="openRule(rule)"
                                >
                                  {{ rule.name }}
                                </button>
                              </Table.Cell>
                              <Table.Cell :grow="3">
                                <span class="min-w-0 truncate">{{ rule.description }}</span>
                              </Table.Cell>
                              <Table.Cell>
                                <Tag
                                  :label="rule.status"
                                  :severity="rule.status === 'Active' ? 'success' : 'secondary'"
                                  size="medium"
                                />
                              </Table.Cell>
                              <Table.Cell :grow="2">
                                <LastModifiedCell
                                  :author="rule.author"
                                  :avatar-src="rule.authorAvatar"
                                  :date="rule.modifiedAt"
                                />
                              </Table.Cell>
                            </Table.Row>
                          </div>
                        </TransitionGroup>

                        <div v-if="!group.rows.length">
                          <EmptyState
                            v-if="!group.total"
                            size="small"
                            :title="`No ${group.label.toLowerCase()} rules yet`"
                            :description="`Create a rule to act on every ${group.label.toLowerCase()} this application handles.`"
                          />
                          <p
                            v-else
                            class="py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                          >
                            No {{ group.label.toLowerCase() }} rules match "{{ search }}".
                          </p>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </Table.Body>
              </Table>
            </template>
          </CardBox>
        </section>
      </section>
    </div>

    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      :route-guard="false"
      label="Rule order changed."
      hint="Saving applies the new order to every request this application handles."
      @save="saveOrder"
      @discard="discardOrder"
    />

    <CreateRuleDrawer
      v-model:open="drawerOpen"
      :rule="editingRule"
      :draft="draftRule"
      @created="onCreated"
      @updated="onUpdated"
    />
  </div>
</template>
