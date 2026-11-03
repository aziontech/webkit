<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Checkbox from '../../../inputs/checkbox/checkbox.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import Select from '../../../inputs/select/index'
  import CardBox from '../../card-box/card-box.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'SqlDatabaseTableFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a column is added and named while it is, and taken back out after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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

  const shown = (value: unknown) => String(value)
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:78%]"
    :chrome="false"
    :active="active"
    :width="520"
    :mobile-width="460"
  >
    <div class="py-(--spacing-xs)">
      <ShellMockupPart :order="0">
        <CardBox :padded="false">
          <template #content>
            <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)">
              <div
                class="grid grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto_auto] items-center gap-(--spacing-xs) px-(--spacing-xxs)"
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
                    class="grid grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto_auto] items-center gap-(--spacing-xs) p-(--spacing-xxs)"
                  >
                    <span
                      class="inline-flex size-8 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted)"
                    >
                      <i
                        class="pi pi-bars"
                        aria-hidden="true"
                      />
                    </span>
                    <InputText
                      :model-value="column.name"
                      size="large"
                      class="w-full min-w-0 font-code"
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
                        <template #iconLeft>
                          <span
                            class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                            aria-hidden="true"
                          >
                            {{ column.glyph }}
                          </span>
                        </template>
                      </Select.Trigger>
                    </Select>
                    <InputText
                      :model-value="column.defaultValue"
                      size="large"
                      class="w-full min-w-0 font-code"
                      aria-label="Default value"
                      placeholder="NULL"
                    />
                    <span class="flex items-center justify-center">
                      <Checkbox
                        :model-value="column.primaryKey"
                        binary
                        aria-label="Primary key"
                      />
                    </span>
                    <IconButton
                      icon="pi pi-times"
                      kind="outlined"
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
                      class="grid grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto_auto] items-center gap-(--spacing-xs) px-(--spacing-xxs) pt-(--spacing-sm) pb-(--spacing-xxs)"
                    >
                      <span
                        class="inline-flex size-8 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted)"
                      >
                        <i
                          class="pi pi-bars"
                          aria-hidden="true"
                        />
                      </span>
                      <span
                        :data-focused="frame.focused || null"
                        class="flex min-w-0 rounded-(--shape-elements) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-focused:ring-2 data-focused:ring-offset-2 motion-reduce:transition-none"
                      >
                        <InputText
                          :model-value="frame.name"
                          size="large"
                          class="w-full min-w-0 font-code"
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
                          <template #iconLeft>
                            <span
                              class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                              aria-hidden="true"
                            >
                              T
                            </span>
                          </template>
                        </Select.Trigger>
                      </Select>
                      <InputText
                        model-value=""
                        size="large"
                        class="w-full min-w-0 font-code"
                        aria-label="Default value"
                        placeholder="NULL"
                      />
                      <span class="flex items-center justify-center">
                        <Checkbox
                          :model-value="false"
                          binary
                          aria-label="Primary key"
                        />
                      </span>
                      <IconButton
                        icon="pi pi-times"
                        kind="outlined"
                        size="large"
                        ariaLabel="Remove column"
                      />
                    </div>
                  </div>
                </Transition>
              </div>

              <span
                :data-pressed="pressed || null"
                class="flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-pressed:ring-2 data-pressed:ring-offset-2 motion-reduce:transition-none"
              >
                <Button
                  label="Add column"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-plus"
                  class="w-full"
                />
              </span>
            </div>
          </template>
        </CardBox>
      </ShellMockupPart>
    </div>
  </ShellMockup>
</template>
