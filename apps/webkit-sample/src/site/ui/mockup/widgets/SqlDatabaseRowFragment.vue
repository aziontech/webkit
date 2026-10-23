<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Checkbox from '@aziontech/webkit/checkbox'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'SqlDatabaseRowFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a row is inserted while it is, and taken back out after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const VIEWS = [
    { label: 'Data', value: 'data' },
    { label: 'Definition', value: 'definition' }
  ]

  const COLUMNS = [
    { name: 'id', type: 'int8', primaryKey: true },
    { name: 'name', type: 'text', primaryKey: false },
    { name: 'email', type: 'text', primaryKey: false },
    { name: 'created_at', type: 'timestamptz', primaryKey: false }
  ]

  const ROWS = [
    { id: '1', name: 'Ada Lovelace', email: 'ada@azion.com', created_at: '2026-07-21 08:15:00' },
    { id: '2', name: 'Alan Turing', email: 'alan@azion.com', created_at: '2026-07-21 08:15:01' },
    { id: '3', name: 'Grace Hopper', email: 'grace@azion.com', created_at: '2026-07-21 08:15:02' }
  ]

  const INSERTED = {
    id: '4',
    name: 'Katherine Johnson',
    email: 'katherine@azion.com',
    created_at: '2026-07-21 08:15:03'
  }

  const cell = (row: Record<string, string>, name: string) => row[name]

  interface Frame {
    pressed: boolean
    inserted: boolean
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { pressed: false, inserted: false, forward: 0, back: 0 },
    { pressed: true, inserted: false, forward: 260, back: 300 },
    { pressed: true, inserted: true, forward: 380, back: 420 },
    { pressed: false, inserted: true, forward: 260, back: 200 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const goingBack = ref(false)

  const frame = computed(() => FRAMES[step.value])
  const pressed = computed(() => frame.value.pressed && !goingBack.value)

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
        <MockupPart :order="0">
          <div
            class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
          >
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i
                class="pi pi-table shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-heading-xxs text-(--text-default)">users</span>
            </span>
            <SegmentedButton
              model-value="data"
              :options="VIEWS"
              aria-label="Table view"
            />
          </div>
        </MockupPart>

        <MockupPart :order="1">
          <div
            class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
          >
            <span class="flex min-w-0 flex-1">
              <InputText
                model-value=""
                size="medium"
                placeholder="Filter by id, name, email… or ask AI"
                aria-label="Filter rows"
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
              <IconButton
                icon="pi pi-refresh"
                kind="outlined"
                size="medium"
                aria-label="Refresh"
              />
              <span
                :data-pressed="pressed || null"
                class="inline-flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-pressed:ring-2 data-pressed:ring-offset-2 motion-reduce:transition-none"
              >
                <Button
                  label="Insert"
                  kind="primary"
                  size="medium"
                  icon="pi pi-plus"
                />
              </span>
            </span>
          </div>
        </MockupPart>

        <MockupPart :order="2">
          <div class="overflow-hidden">
            <div class="flex w-max flex-col">
              <div
                class="flex items-stretch border-b border-(--border-default) bg-(--bg-surface-raised)"
              >
                <span
                  class="flex w-10 shrink-0 items-center justify-center border-r border-(--border-muted) py-(--spacing-xs)"
                >
                  <Checkbox
                    binary
                    disabled
                    aria-label="Select all rows"
                  />
                </span>
                <span
                  v-for="column in COLUMNS"
                  :key="column.name"
                  class="flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-xxs) border-r border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ column.name }}
                  </span>
                  <span class="shrink-0 text-body-xs text-(--text-muted)">{{ column.type }}</span>
                  <i
                    v-if="column.primaryKey"
                    class="pi pi-key ml-auto shrink-0 pl-(--spacing-xs) text-(--primary)"
                    aria-label="Primary key"
                  />
                </span>
              </div>

              <div
                v-for="row in ROWS"
                :key="row.id"
                class="flex items-stretch border-b border-(--border-muted)"
              >
                <span
                  class="flex w-10 shrink-0 items-center justify-center border-r border-(--border-muted) py-(--spacing-xs)"
                >
                  <Checkbox
                    binary
                    disabled
                    :aria-label="`Select row ${row.id}`"
                  />
                </span>
                <span
                  v-for="column in COLUMNS"
                  :key="column.name"
                  class="flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-xxs) border-r border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ cell(row, column.name) }}
                  </span>
                </span>
              </div>

              <Transition
                enter-active-class="animate-slide-down motion-reduce:animate-none"
                leave-active-class="animate-slide-down [animation-direction:reverse] motion-reduce:animate-none"
              >
                <div
                  v-if="frame.inserted"
                  class="overflow-hidden [interpolate-size:allow-keywords]"
                >
                  <div class="flex items-stretch border-b border-(--border-muted) bg-(--bg-hover)">
                    <span
                      class="flex w-10 shrink-0 items-center justify-center border-r border-(--border-muted) py-(--spacing-xs)"
                    >
                      <Checkbox
                        binary
                        disabled
                        aria-label="Select row 4"
                      />
                    </span>
                    <span
                      v-for="column in COLUMNS"
                      :key="column.name"
                      class="flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-xxs) border-r border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
                    >
                      <span class="truncate text-label-md text-(--text-default)">
                        {{ cell(INSERTED, column.name) }}
                      </span>
                    </span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </MockupPart>
      </div>
    </div>
  </ShellMockup>
</template>
