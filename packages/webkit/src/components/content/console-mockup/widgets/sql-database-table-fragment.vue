<script setup lang="ts">
  import { computed } from 'vue'

  import Button from '../../../action/button/button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Checkbox from '../../../input/checkbox/checkbox.vue'
  import Input from '../../../input/input/input.vue'
  import Select from '../../../input/select/index'
  import Card from '../../card/card.vue'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'SqlDatabaseTableFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a column is added and named while it is, and taken back out after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const COLUMNS = [
    { name: 'id', type: 'int8', glyph: '#', defaultValue: '', primaryKey: true },
    {
      name: 'created_at',
      type: 'timestamptz',
      glyph: '@',
      defaultValue: 'now()',
      primaryKey: false
    }
  ]

  interface Frame {
    pressed: boolean
    added: boolean
    focused: boolean
    name: string
    forward: number
    back: number
  }

  const REST = { pressed: false, added: false, focused: false, name: '' }
  const typed = (name: string, forward: number) => ({
    ...REST,
    added: true,
    focused: true,
    name,
    forward,
    back: 70
  })

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, pressed: true, forward: 220, back: 300 },
    { ...REST, pressed: true, added: true, forward: 320, back: 420 },
    { ...REST, added: true, focused: true, forward: 360, back: 160 },
    typed('e', 140),
    typed('em', 110),
    typed('ema', 110),
    typed('emai', 110),
    typed('email', 110),
    { ...REST, added: true, name: 'email', forward: 520, back: 220 }
  ]

  const { frame, goingBack } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
  const pressed = computed(() => frame.value.pressed && !goingBack.value)

  const shown = (value: unknown) => String(value)

  const NAME_FIELD_RING_CLASS =
    'flex min-w-0 rounded-(--shape-control) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-focused:ring-2 data-focused:ring-offset-2 ' +
    'motion-reduce:transition-none'

  const ADD_COLUMN_RING_CLASS =
    'flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-pressed:ring-2 data-pressed:ring-offset-2 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    class="[--console-mockup-fade-start:78%]"
    :active="active"
    :width="520"
    :mobile-width="460"
  >
    <div class="py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <Card :padded="false">
          <template #default>
            <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)">
              <div
                class="grid grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto_auto] items-center gap-(--spacing-xs) px-(--spacing-2xs)"
              >
                <span
                  class="size-8"
                  aria-hidden="true"
                />
                <span class="text-label-sm text-(--text-muted)">Name</span>
                <span class="text-label-sm text-(--text-muted)">Type</span>
                <span class="text-label-sm text-(--text-muted)">Default Value</span>
                <span class="text-label-sm text-(--text-muted)">Primary</span>
                <span
                  class="size-10"
                  aria-hidden="true"
                />
              </div>

              <div class="flex flex-col">
                <div class="flex flex-col gap-(--spacing-xs)">
                  <div
                    v-for="column in COLUMNS"
                    :key="column.name"
                    class="grid grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto_auto] items-center gap-(--spacing-xs) p-(--spacing-2xs)"
                  >
                    <span
                      class="inline-flex size-8 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted)"
                    >
                      <i
                        class="az az-menu"
                        aria-hidden="true"
                      />
                    </span>
                    <Input
                      :model-value="column.name"
                      size="large"
                      monospace
                      class="w-full min-w-0"
                      aria-label="Column name"
                      placeholder="column_name"
                    />
                    <Select
                      :model-value="column.type"
                      size="large"
                      class="w-full min-w-0"
                      :display-value="shown"
                    >
                      <Select.Trigger aria-label="Column type">
                        <template #leading>
                          <span
                            class="shrink-0 text-label-code-sm text-(--text-muted)"
                            aria-hidden="true"
                          >
                            {{ column.glyph }}
                          </span>
                        </template>
                      </Select.Trigger>
                    </Select>
                    <Input
                      :model-value="column.defaultValue"
                      size="large"
                      monospace
                      class="w-full min-w-0"
                      aria-label="Default value"
                      placeholder="NULL"
                    />
                    <span class="flex items-center justify-center">
                      <Checkbox
                        :model-value="column.primaryKey"
                        aria-label="Primary key"
                      />
                    </span>
                    <IconButton
                      icon="az az-x"
                      variant="outline"
                      size="large"
                      ariaLabel="Remove column"
                    />
                  </div>
                </div>

                <Transition
                  enter-from-class="-translate-y-1 opacity-0"
                  enter-active-class="transition-[opacity,translate] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
                  leave-to-class="-translate-y-1 opacity-0"
                  leave-active-class="transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                >
                  <div
                    v-if="frame.added"
                    class="overflow-hidden [interpolate-size:allow-keywords]"
                  >
                    <div
                      class="grid grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto_auto] items-center gap-(--spacing-xs) px-(--spacing-2xs) pt-(--spacing-sm) pb-(--spacing-2xs)"
                    >
                      <span
                        class="inline-flex size-8 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted)"
                      >
                        <i
                          class="az az-menu"
                          aria-hidden="true"
                        />
                      </span>
                      <span
                        :data-focused="frame.focused || null"
                        :class="NAME_FIELD_RING_CLASS"
                      >
                        <Input
                          :model-value="frame.name"
                          size="large"
                          monospace
                          class="w-full min-w-0"
                          aria-label="Column name"
                          placeholder="column_name"
                        />
                      </span>
                      <Select
                        model-value="text"
                        size="large"
                        class="w-full min-w-0"
                        :display-value="shown"
                      >
                        <Select.Trigger aria-label="Column type">
                          <template #leading>
                            <span
                              class="shrink-0 text-label-code-sm text-(--text-muted)"
                              aria-hidden="true"
                            >
                              T
                            </span>
                          </template>
                        </Select.Trigger>
                      </Select>
                      <Input
                        model-value=""
                        size="large"
                        monospace
                        class="w-full min-w-0"
                        aria-label="Default value"
                        placeholder="NULL"
                      />
                      <span class="flex items-center justify-center">
                        <Checkbox
                          :model-value="false"
                          aria-label="Primary key"
                        />
                      </span>
                      <IconButton
                        icon="az az-x"
                        variant="outline"
                        size="large"
                        ariaLabel="Remove column"
                      />
                    </div>
                  </div>
                </Transition>
              </div>

              <span
                :data-pressed="pressed || null"
                :class="ADD_COLUMN_RING_CLASS"
              >
                <Button
                  label="Add column"
                  variant="outline"
                  size="medium"
                  icon="az az-plus"
                  class="w-full"
                />
              </span>
            </div>
          </template>
        </Card>
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>
