<script setup>
  // Firewall → Rules Engine. The program that runs before a request reaches the
  // application this firewall protects.
  //
  // It is the application's Rules Engine (../../applications/panels/RulesEngine.vue) with
  // one difference that removes most of its machinery: a firewall has ONE phase. There is
  // no second program to fold away, so there are no sections — one table, one order, one
  // list of rules that run top to bottom until one of them refuses the request.
  //
  // WHAT IT SHARES, it shares as code rather than as a copy: the same drawer writes the
  // rule (../../applications/CreateRuleDrawer.vue, handed this engine's vocabulary
  // — ../../../lib/data/firewall-rules.js), the same reorder composable moves the rows, and
  // the same commit bar holds an order change until it is saved. What a firewall rule can
  // DO is the only thing this file does not own.
  //
  // THE ORDER IS THE BEHAVIOUR here too, and more sharply: a `Deny` at position 2 means
  // every rule under it is unreachable for the requests it matches. So a move is an unsaved
  // edit with a commit bar, not a preference that writes itself.
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { authorAt } from '@shared/lib/people'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { useDragReorder } from '../../../lib/behavior/drag-reorder'
  import { MORPH_TRANSITION } from '../../../lib/behavior/list-morph'
  import { useTabDirty } from '../../../lib/behavior/tab-dirty'
  import { bindingRecord, bindingRuleDraft } from '../../../lib/data/create-bindings'
  import * as firewallRules from '../../../lib/data/firewall-rules'
  import { firewallRulesFor } from '../../../lib/data/firewall-rules-seed'
  import { productFirstUse } from '../../../lib/data/product-empty-states'
  import CreateRuleDrawer from '../../applications/CreateRuleDrawer.vue'

  const props = defineProps({
    /** The firewall these rules belong to. */
    firewall: { type: Object, required: true }
  })

  const HELP = productFirstUse('firewall').learnMore.href

  const route = useRoute()
  const router = useRouter()

  const rules = ref(firewallRulesFor(props.firewall.id))

  const search = ref('')
  const searching = computed(() => search.value.trim().length > 0)

  const visible = computed(() => {
    const term = search.value.trim().toLowerCase()
    if (!term) return [...rules.value]
    return rules.value.filter((rule) =>
      [rule.name, rule.description, rule.status, rule.author].some((field) =>
        (field ?? '').toLowerCase().includes(term)
      )
    )
  })

  // ── The order, and its commit ─────────────────────────────────────────────
  const orderOf = (list) => JSON.stringify(list.map((rule) => rule.id))
  const savedOrder = ref(orderOf(rules.value))
  let savedRows = [...rules.value]

  const dirty = computed(() => orderOf(rules.value) !== savedOrder.value)
  const saving = ref(false)

  const saveOrder = async () => {
    if (saving.value) return
    saving.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      savedOrder.value = orderOf(rules.value)
      savedRows = [...rules.value]
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
    rules.value = [...savedRows]
  }

  useTabDirty(
    'firewall-rules-engine',
    { dirty, saving },
    { label: 'Rule order changed.', save: saveOrder, discard: discardOrder }
  )

  // The first rule is where the program STARTS: every request is measured against it
  // before anything else, so it cannot be moved and nothing can be dropped above it.
  const PINNED_RULES = 1

  const canReorder = computed(() => !searching.value && rules.value.length > PINNED_RULES + 1)

  const dnd = useDragReorder(() => rules.value, {
    enabled: () => canReorder.value,
    pinned: () => PINNED_RULES
  })

  const lockReason = (index) => {
    if (searching.value) return 'Clear the search to change the order rules run in.'
    if (index < PINNED_RULES) return 'The first rule runs first and stays first.'
    if (!dnd.canMove(index)) return 'There is no other rule to move it past.'
    return ''
  }

  // ── Create and edit ───────────────────────────────────────────────────────
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
      const draft = bindingRuleDraft(String(resource ?? ''), record)
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
    rules.value = [...rules.value, stampModified(created)]
    savedOrder.value = orderOf(rules.value)
    savedRows = [...rules.value]
  }

  const onUpdated = (saved) => {
    const rule = stampModified(saved)
    rules.value = rules.value.map((item) => (item.id === rule.id ? rule : item))
    savedOrder.value = orderOf(rules.value)
    savedRows = [...rules.value]
    editingRule.value = null
  }

</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-1 flex-col pb-0">
    <PageHeading
      title="Rules Engine"
      description="Rules run top to bottom on every request this firewall sees, until one of them refuses it."
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

        <CardBox :padded="false">
          <template #content>
            <Table :border="false">
              <Table.Header>
                <Table.Row>
                  <Table.HeadCell
                    align="center"
                    class="w-32 flex-none!"
                  >
                    Order
                  </Table.HeadCell>
                  <Table.HeadCell principal>Name</Table.HeadCell>
                  <Table.HeadCell :grow="3">Description</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell :grow="2">Last Modified</Table.HeadCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <!-- THE MOVE, MADE VISIBLE — the same FLIP the application's engine uses
                     (../../../lib/behavior/list-morph.js), on the same wrapper and for the
                     same reason: the row already ships its own `transition-colors`, and a
                     child that declares one can switch Vue's move class off. -->
                <TransitionGroup
                  tag="div"
                  class="relative flex w-full flex-col [&>*:last-child_[role=row]]:border-b-0"
                  v-bind="MORPH_TRANSITION"
                >
                  <div
                    v-for="(rule, index) in visible"
                    :key="rule.id"
                    class="w-full"
                  >
                    <Table.Row @click="openRule(rule)">
                      <!-- The order cell stops the click: its two buttons are how the row
                           is MOVED, and a nudge that also opened the rule would cost a
                           dismissal every time. -->
                      <Table.Cell
                        align="center"
                        class="w-32 flex-none! gap-(--spacing-xxs)"
                        @click.stop
                      >
                        <span class="text-body-sm tabular-nums text-(--text-muted)">
                          {{ index + 1 }}
                        </span>
                        <Tooltip
                          v-if="lockReason(index)"
                          :text="lockReason(index)"
                        >
                          <span class="flex">
                            <IconButton
                              icon="pi pi-chevron-up"
                              size="small"
                              kind="text"
                              aria-label="Move up"
                              disabled
                            />
                          </span>
                        </Tooltip>
                        <template v-else>
                          <IconButton
                            icon="pi pi-chevron-up"
                            size="small"
                            kind="text"
                            aria-label="Move up"
                            :disabled="!dnd.canMove(index, -1)"
                            @click="dnd.move(index, -1)"
                          />
                          <IconButton
                            icon="pi pi-chevron-down"
                            size="small"
                            kind="text"
                            aria-label="Move down"
                            :disabled="!dnd.canMove(index, 1)"
                            @click="dnd.move(index, 1)"
                          />
                        </template>
                      </Table.Cell>
                      <Table.Cell principal>
                        <span class="min-w-0 truncate">{{ rule.name }}</span>
                      </Table.Cell>
                      <!-- `min-w-0 truncate` on the SPAN, not the cell: a flex child's
                           default `min-width: auto` refuses to shrink below its text, so
                           without it the sentence pushes into the Status chip beside it
                           instead of ellipsising. -->
                      <Table.Cell :grow="3">
                        <span class="min-w-0 truncate text-(--text-muted)">
                          {{ rule.description }}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Tag
                          :label="rule.status"
                          :severity="rule.status === 'Active' ? 'success' : 'neutral'"
                        />
                      </Table.Cell>
                      <Table.Cell :grow="2">
                        <LastModifiedCell
                          :date="rule.modifiedAt"
                          :author="rule.author"
                          :avatar="rule.authorAvatar"
                        />
                      </Table.Cell>
                    </Table.Row>
                  </div>
                </TransitionGroup>
              </Table.Body>
            </Table>

            <EmptyState
              v-if="!visible.length"
              :title="searching ? 'No rule matches' : 'No rules yet'"
              :description="
                searching
                  ? 'Clear the search to see every rule this firewall runs.'
                  : 'A firewall with no rules lets every request through. Add one to start refusing traffic.'
              "
            />
          </template>
        </CardBox>
      </section>
    </section>

    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      @save="saveOrder"
      @discard="discardOrder"
    />

    <CreateRuleDrawer
      v-model:open="drawerOpen"
      :rule="editingRule"
      :draft="draftRule"
      :vocabulary="firewallRules"
      @created="onCreated"
      @updated="onUpdated"
    />
  </div>
</template>
