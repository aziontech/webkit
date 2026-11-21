<script setup lang="ts">
  import { computed } from 'vue'

  import Button from '../../../action/button/button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import ToggleGroup from '../../../action/toggle-group/toggle-group.vue'
  import Checkbox from '../../../input/checkbox/checkbox.vue'
  import Input from '../../../input/input/input.vue'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'SqlDatabaseRowFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a row is inserted while it is, and taken back out after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

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
    { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', created_at: '2026-07-21 08:15:00' },
    { id: '2', name: 'Alan Turing', email: 'alan@example.com', created_at: '2026-07-21 08:15:01' },
    { id: '3', name: 'Grace Hopper', email: 'grace@example.com', created_at: '2026-07-21 08:15:02' }
  ]

  const INSERTED = {
    id: '4',
    name: 'Katherine Johnson',
    email: 'katherine@example.com',
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

  const { frame, goingBack } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
  const pressed = computed(() => frame.value.pressed && !goingBack.value)

  const INSERT_BUTTON_RING_CLASS =
    'inline-flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-pressed:ring-2 data-pressed:ring-offset-2 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    class="[--console-mockup-fade-start:80%]"
    :active="active"
    :width="460"
    :mobile-width="420"
  >
    <div class="py-(--spacing-xs)">
      <div
        class="flex flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
      >
        <ConsoleMockupShellItem :order="0">
          <div
            class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
          >
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i
                class="az az-table shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-heading-2xs text-(--text-default)">users</span>
            </span>
            <ToggleGroup
              model-value="data"
              :options="VIEWS"
              aria-label="Table view"
            />
          </div>
        </ConsoleMockupShellItem>

        <ConsoleMockupShellItem :order="1">
          <div
            class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
          >
            <span class="flex min-w-0 flex-1">
              <Input
                model-value=""
                size="medium"
                placeholder="Filter by id, name, email… or ask AI"
                aria-label="Filter rows"
              >
                <template #leading>
                  <i
                    class="az az-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </span>
            <span class="ms-auto flex items-center gap-(--spacing-xs)">
              <IconButton
                icon="az az-refresh"
                variant="outline"
                size="medium"
                ariaLabel="Refresh"
              />
              <span
                :data-pressed="pressed || null"
                :class="INSERT_BUTTON_RING_CLASS"
              >
                <Button
                  label="Insert"
                  variant="primary"
                  size="medium"
                  icon="az az-plus"
                />
              </span>
            </span>
          </div>
        </ConsoleMockupShellItem>

        <ConsoleMockupShellItem :order="2">
          <div class="overflow-hidden">
            <div class="flex w-max flex-col">
              <div
                class="flex items-stretch border-b border-(--border-default) bg-(--bg-surface-raised)"
              >
                <span
                  class="flex w-10 shrink-0 items-center justify-center border-e border-(--border-muted) py-(--spacing-xs)"
                >
                  <Checkbox
                    disabled
                    aria-label="Select all rows"
                  />
                </span>
                <span
                  v-for="column in COLUMNS"
                  :key="column.name"
                  class="flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-2xs) border-e border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ column.name }}
                  </span>
                  <span class="shrink-0 text-body-xs text-(--text-muted)">{{ column.type }}</span>
                  <i
                    v-if="column.primaryKey"
                    class="az az-key ms-auto shrink-0 ps-(--spacing-xs) text-(--primary)"
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
                  class="flex w-10 shrink-0 items-center justify-center border-e border-(--border-muted) py-(--spacing-xs)"
                >
                  <Checkbox
                    disabled
                    :aria-label="`Select row ${row.id}`"
                  />
                </span>
                <span
                  v-for="column in COLUMNS"
                  :key="column.name"
                  class="flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-2xs) border-e border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ cell(row, column.name) }}
                  </span>
                </span>
              </div>

              <Transition
                enter-from-class="-translate-y-1 opacity-0"
                enter-active-class="transition-[opacity,translate] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
                leave-to-class="-translate-y-1 opacity-0"
                leave-active-class="transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
              >
                <div
                  v-if="frame.inserted"
                  class="overflow-hidden [interpolate-size:allow-keywords]"
                >
                  <div class="flex items-stretch border-b border-(--border-muted) bg-(--bg-hover)">
                    <span
                      class="flex w-10 shrink-0 items-center justify-center border-e border-(--border-muted) py-(--spacing-xs)"
                    >
                      <Checkbox
                        disabled
                        aria-label="Select row 4"
                      />
                    </span>
                    <span
                      v-for="column in COLUMNS"
                      :key="column.name"
                      class="flex w-(--container-3xs) shrink-0 items-center gap-(--spacing-2xs) border-e border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
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
        </ConsoleMockupShellItem>
      </div>
    </div>
  </MockupFragment>
</template>
