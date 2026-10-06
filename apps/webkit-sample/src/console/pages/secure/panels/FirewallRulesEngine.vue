<script setup lang="ts">
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

  interface Props {
    firewall: Record<string, unknown>
  }

  const props = defineProps<Props>()

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
      const draft = bindingRuleDraft(String(resource ?? ''), record, 'firewall')
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
  <div class="flex min-w-0 flex-1 flex-col">
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
    </div>

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
