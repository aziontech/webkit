<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import SegmentedButton from '../../../actions/segmented-button/segmented-button.vue'
  import TableRoot from '../../../data/table/table.vue'
  import EmptyState from '../../../feedback/empty-state/empty-state.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import Textarea from '../../../inputs/textarea/textarea.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'SqlDatabaseQueryFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the query runs and its rows come back while it is, and clear after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const SQL = 'SELECT id, name, email\nFROM users\nLIMIT 3;'

  const VIEWS = [
    { label: 'Table', value: 'table' },
    { label: 'Json', value: 'json' }
  ]

  const COLUMNS = [
    { accessorKey: 'id', header: 'id', principal: true },
    { accessorKey: 'name', header: 'name' },
    { accessorKey: 'email', header: 'email' }
  ]

  const ROWS = [
    { id: 1, name: 'Ada Lovelace', email: 'ada@azion.com' },
    { id: 2, name: 'Alan Turing', email: 'alan@azion.com' },
    { id: 3, name: 'Grace Hopper', email: 'grace@azion.com' }
  ]

  interface Frame {
    pressed: boolean
    running: boolean
    results: boolean
    forward: number
    back: number
  }

  const REST = { pressed: false, running: false, results: false }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, pressed: true, forward: 260, back: 240 },
    { ...REST, pressed: true, running: true, forward: 220, back: 0 },
    { ...REST, running: true, forward: 320, back: 0 },
    { ...REST, results: true, forward: 700, back: 360 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const goingBack = ref(false)

  const frame = computed(() => FRAMES[step.value])
  const pressed = computed(() => frame.value.pressed && !goingBack.value)
  const running = computed(() => frame.value.running && !goingBack.value)

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    const target = wanted() ? LAST : 0
    if (step.value === target) return
    if (reduced) {
      step.value = target
      return
    }
    const forward = target > step.value
    goingBack.value = !forward
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onScopeDispose(halt)
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="460"
    :mobile-width="420"
  >
    <div class="py-(--spacing-xs)">
      <div
        class="flex flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
      >
        <ShellMockupPart :order="0">
          <div
            class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
          >
            <span
              :data-pressed="pressed || null"
              class="inline-flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-pressed:ring-2 data-pressed:ring-offset-2 motion-reduce:transition-none"
            >
              <Button
                label="Run Query"
                kind="primary"
                size="medium"
                icon="pi pi-play"
                :loading="running"
              />
            </span>
            <span class="ml-auto flex items-center gap-(--spacing-xs)">
              <Button
                label="Prettify"
                kind="outlined"
                size="medium"
                icon="pi pi-align-left"
                :disabled="running"
              />
              <Button
                label="Templates"
                kind="outlined"
                size="medium"
                icon="pi pi-bolt"
                :disabled="running"
              />
            </span>
          </div>
        </ShellMockupPart>

        <ShellMockupPart :order="1">
          <Textarea
            :model-value="SQL"
            :disabled="running"
            resizable="none"
            class="w-full rounded-none! border-0! font-code"
            aria-label="SQL editor"
            placeholder="Write your SQL query here"
          />
        </ShellMockupPart>

        <ShellMockupPart :order="2">
          <div class="flex flex-col border-t border-(--border-default)">
            <div
              class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
            >
              <span class="shrink-0 text-heading-xxs text-(--text-default)">Results</span>
              <span class="ml-(--spacing-sm) flex min-w-0 flex-1">
                <InputText
                  model-value=""
                  size="medium"
                  placeholder="Search"
                  aria-label="Search results"
                  :disabled="!frame.results"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
              </span>
              <span class="ml-auto flex items-center gap-(--spacing-xs)">
                <SegmentedButton
                  model-value="table"
                  :options="VIEWS"
                  aria-label="Result view"
                />
                <IconButton
                  icon="pi pi-refresh"
                  kind="outlined"
                  size="medium"
                  ariaLabel="Refresh results"
                  :loading="running"
                />
              </span>
            </div>

            <div class="h-48">
              <Transition
                mode="out-in"
                enter-active-class="animate-fade-in motion-reduce:animate-none"
                leave-active-class="animate-fade-out motion-reduce:animate-none"
              >
                <div
                  v-if="frame.results"
                  key="rows"
                >
                  <TableRoot
                    :data="ROWS"
                    :columns="COLUMNS"
                    row-key="id"
                    :border="false"
                  />
                </div>
                <div
                  v-else
                  key="ready"
                  class="flex h-full items-center justify-center p-(--spacing-lg)"
                >
                  <EmptyState
                    title="Ready to execute"
                    description="Execute a query to see the results here."
                  />
                </div>
              </Transition>
            </div>
          </div>
        </ShellMockupPart>
      </div>
    </div>
  </ShellMockup>
</template>
