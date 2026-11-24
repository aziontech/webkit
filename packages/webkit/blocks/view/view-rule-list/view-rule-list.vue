<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import Kbd from '@aziontech/webkit/kbd'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import { toast } from '@aziontech/webkit/toast'
  import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { computed, reactive, ref, watch } from 'vue'

  import { useNarrowViewport } from './composables/use-narrow-viewport'
  import { useRuleListAnnouncement } from './composables/use-rule-list-announcement'
  import { useRuleListDraft } from './composables/use-rule-list-draft'
  import { useRuleListPosition } from './composables/use-rule-list-position'
  import { useRuleListReorder } from './composables/use-rule-list-reorder'
  import {
    ALL_PHASES,
    matchesSearch,
    pageDescription,
    ruleColumns,
    type RuleListDraft
  } from './lib/rule-list'
  import RulePhaseTable from './parts/rule-phase-table.vue'
  import RuleReviewDialog from './parts/rule-review-dialog.vue'
  import { sampleApplicationRules, sampleFirewallRules } from './sample'

  /** What runs the rules: an application has Request and Response phases, a firewall only Request. */
  export type RuleListSubject = 'application' | 'firewall'
  /** The phase a rule runs in. */
  export type RuleListPhase = 'request' | 'response'

  /** One rule, in the order it runs within its phase. */
  export interface RuleListRule {
    /** Stable key. */
    id: string
    /** Display name; it opens the rule. */
    name: string
    /** What the rule does, in one line. */
    description: string
    /** The phase it runs in. */
    phase: RuleListPhase
    /** Who changed it last. */
    author: string
    /** When it changed last, as shown. */
    modified: string
    /** Whether it runs; an inactive rule keeps its place. */
    active: boolean
    /** Pinned first in its phase: it cannot move or turn off. */
    locked: boolean
  }

  /** An unsaved change the list opens with. */
  export interface RuleListEdit {
    /** The rule's phase. */
    phase: RuleListPhase
    /** The rule's id. */
    id: string
    /** The zero-based position it moves to. */
    to?: number
    /** The status it switches to. */
    active?: boolean
  }

  export interface RuleListProps {
    /** What runs the rules; it sets the phases and the copy. */
    subject?: RuleListSubject
    /** The saved rules of every phase, each phase in run order. Pass an empty list for none. Left out, the sample renders. */
    rules?: RuleListRule[]
    /** The rules are loading: each phase shows skeleton rows and the search and Add Rule disable. */
    loading?: boolean
    /** Why the rules could not load; a danger alert with Retry takes the phases' place. */
    error?: string
    /** Unsaved moves and switches the list opens with, so the save bar shows. */
    defaultEdits?: RuleListEdit[]
    /** The search the list opens with. */
    defaultSearch?: string
    /** Opens the Review changes dialog when the block opens. */
    defaultReviewOpen?: boolean
    /** The save is in flight: the dialog locks and Save spins. When it turns off with no saveError, the order is saved. */
    saving?: boolean
    /** Why the save failed, shown at the top of the review dialog; Save reads Save again. */
    saveError?: string
  }

  const props = withDefaults(defineProps<RuleListProps>(), {
    subject: 'application',
    rules: undefined,
    loading: false,
    error: '',
    defaultEdits: () => [],
    defaultSearch: '',
    defaultReviewOpen: false,
    saving: false,
    saveError: ''
  })

  const emit = defineEmits<{
    edit: [event: MouseEvent, rule: RuleListRule]
    create: [event: MouseEvent, phase?: RuleListPhase]
    retry: [event: MouseEvent]
    save: [event: MouseEvent, rules: RuleListRule[]]
  }>()

  const SUBJECT = computed(() => props.subject)
  const PAGE_DESCRIPTION = computed(() => pageDescription(props.subject))
  const PHASES = computed(() =>
    props.subject === 'firewall' ? ALL_PHASES.slice(0, 1) : ALL_PHASES
  )

  const source = computed<RuleListRule[]>(
    () =>
      props.rules ??
      (props.loading || props.error
        ? []
        : props.subject === 'firewall'
          ? sampleFirewallRules
          : sampleApplicationRules)
  )
  const loadFailed = computed(() => props.error !== '')

  const draft = reactive<RuleListDraft>({ request: [], response: [] })
  const {
    dirty,
    changes,
    changeCount,
    markSaved,
    discard: discardDraft
  } = useRuleListDraft(draft, source, PHASES, () => props.defaultEdits)

  const loading = computed(() => props.loading)
  const saving = computed(() => props.saving)
  const search = ref(props.defaultSearch)
  const searchEl = ref<InstanceType<typeof Input> | null>(null)
  useShortcuts({
    keys: '/',
    label: 'Focus search',
    element: () => (searchEl.value?.$el as HTMLElement | null | undefined) ?? null,
    when: () => !props.loading && !loadFailed.value,
    handler: () => searchEl.value?.focus()
  })
  const searching = computed(() => search.value.trim().length > 0)
  const matches = (item: RuleListRule) => matchesSearch(item, search.value)

  const openPhases = ref<string[]>(PHASES.value.map((item) => item.value))
  watch(search, () => {
    if (!searching.value) return
    const hits = PHASES.value
      .filter(({ value }) => draft[value].some(matches))
      .map(({ value }) => value)
    openPhases.value = [...new Set([...openPhases.value, ...hits])]
  })
  watch(source, (next, previous) => {
    if (!previous?.length) return
    const known = new Set(previous.map((item) => item.id))
    const added = next.filter((item) => !known.has(item.id)).map((item) => item.phase)
    if (added.length) openPhases.value = [...new Set([...openPhases.value, ...added])]
  })

  const groups = computed(() =>
    PHASES.value.map((phase) => {
      const list = draft[phase.value]
      return {
        ...phase,
        total: list.length,
        items: list.filter(matches)
      }
    })
  )

  const listEl = ref<HTMLElement | null>(null)
  const { announcement, announce } = useRuleListAnnouncement()
  const reorder = useRuleListReorder(draft, searching, saving, listEl, announce)
  const positioning = useRuleListPosition(draft, reorder)

  const narrow = useNarrowViewport('(width < 48rem)')
  const columns = computed(() => ruleColumns(narrow.value))

  const setActive = (item: RuleListRule, value: boolean) => {
    item.active = value
  }

  const discard = () => {
    discardDraft()
    announce('Changes discarded. The rules are back in their saved order.')
  }

  const reviewOpen = ref(props.defaultReviewOpen)
  const saveFailed = ref(props.saveError !== '')
  const openReview = () => {
    saveFailed.value = false
    reviewOpen.value = true
  }
  const onSaveShortcut = () => {
    if (!dirty.value || saving.value || reviewOpen.value) return
    openReview()
  }
  const save = (event: MouseEvent) => {
    if (saving.value) return
    saveFailed.value = false
    emit(
      'save',
      event,
      PHASES.value.flatMap(({ value }) => draft[value].map((item) => ({ ...item })))
    )
  }

  watch(
    () => props.saveError,
    (next) => {
      saveFailed.value = next !== ''
    }
  )

  watch(
    () => props.saving,
    (now, before) => {
      if (!before || now) return
      if (props.saveError) {
        saveFailed.value = true
        return
      }
      markSaved()
      reviewOpen.value = false
      setTimeout(() => listEl.value?.focus(), 0)
      toast.success('Rule order saved.', {
        description: `The ${SUBJECT.value} runs its rules in the new order.`
      })
    }
  )
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
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/rules"
            target="_blank"
          />
          <Button
            label="Add Rule"
            icon="az az-plus"
            variant="outline"
            size="medium"
            :disabled="loading || loadFailed"
            @click="(event: MouseEvent) => emit('create', event)"
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
              ref="searchEl"
              v-model="search"
              size="medium"
              placeholder="Search rules"
              aria-keyshortcuts="/"
              aria-label="Search rules"
              class="w-full"
              :disabled="loading || loadFailed"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
        </div>

        <Alert
          v-if="loadFailed"
          key="load-error"
          severity="danger"
          :label="error"
          action-label="Retry"
          @action="(event: MouseEvent) => emit('retry', event)"
        />
        <Alert
          v-else-if="searching"
          key="searching"
          severity="info"
          label="Reordering is off while a search narrows the list. Clear the search to change the order rules run in."
        />

        <Card
          v-if="!loadFailed"
          :padded="false"
        >
          <template #default>
            <Accordion
              v-model="openPhases"
              type="multiple"
              size="large"
              icon-position="leading"
            >
              <Accordion.Item
                v-for="group in groups"
                :key="group.value"
                :value="group.value"
              >
                <Accordion.Trigger :heading-level="2">
                  <span class="flex min-w-0 items-center gap-(--spacing-sm)">
                    <span class="truncate">{{ group.label }} phase</span>
                    <span
                      class="shrink-0 text-body-xs tabular-nums text-(--text-muted)"
                      :data-testid="`rule-list__count-${group.value}`"
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
                <Accordion.Content :padded="false">
                  <div>
                    <RulePhaseTable
                      v-if="loading || group.total"
                      :group="group"
                      :columns="columns"
                      :loading="loading"
                      :saving="saving"
                      :narrow="narrow"
                      :search="search"
                      :reorder="reorder"
                      :positioning="positioning"
                      @edit="(event, rule) => emit('edit', event, rule)"
                      @set-active="setActive"
                      @clear-search="search = ''"
                    />
                    <EmptyState
                      v-else
                      size="small"
                      :title="`No ${group.label.toLowerCase()} rules yet`"
                      :description="`Add a rule to act on every ${group.label.toLowerCase()} this ${SUBJECT} handles.`"
                    >
                      <template #actions>
                        <Button
                          label="Add Rule"
                          icon="az az-plus"
                          variant="outline"
                          size="medium"
                          @click="(event: MouseEvent) => emit('create', event, group.value)"
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
          data-testid="rule-list__announcer"
        >
          {{ announcement }}
        </p>
      </section>

      <SaveBar
        v-if="dirty"
        @save="onSaveShortcut"
      >
        {{ changeCount }} {{ changeCount === 1 ? 'change' : 'changes' }} to the rules, not saved
        yet.
        <template #actions>
          <Button
            type="button"
            label="Discard"
            variant="outline"
            size="medium"
            :disabled="saving"
            @click="discard"
          />
          <Button
            type="button"
            variant="primary"
            size="medium"
            :disabled="saving"
            @click="openReview"
            aria-keyshortcuts="Meta+S Control+S"
          >
            Review changes
            <span
              class="pointer-coarse:hidden"
              aria-hidden="true"
              data-testid="shortcut-hint"
            >
              <Kbd
                meta
                size="small"
                >S</Kbd
              >
            </span>
          </Button>
        </template>
      </SaveBar>
    </div>

    <RuleReviewDialog
      v-model:open="reviewOpen"
      :changes="changes"
      :subject="SUBJECT"
      :saving="saving"
      :save-failed="saveFailed"
      :save-error="saveError"
      @save="save"
    />
  </div>
</template>
