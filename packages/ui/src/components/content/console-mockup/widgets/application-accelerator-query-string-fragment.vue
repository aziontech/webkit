<script setup lang="ts">
  import { computed } from 'vue'

  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import Textarea from '../../../input/textarea/textarea.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import { openAndPick, option } from '../lib/pick-frames'
  import CacheVaryHeading from '../parts/cache-vary-heading.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import LegacySwitch from '../parts/legacy-switch.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'ApplicationAcceleratorQueryStringFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the behavior is switched to Allowlist and its fields typed in while it is, and taken back out after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const BEHAVIORS = ['Allowlist', 'Denylist', 'Ignore', 'All']
  const FIELDS = 'page\nlang'

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    behavior: string
    added: boolean
    typing: boolean
    fields: number
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'behavior', x: 0.82, y: 1.9 }
  const BEHAVIOR: MockupCursorTarget = { key: 'behavior', x: 0.5, y: 0.6 }
  const FIELDS_AREA: MockupCursorTarget = { key: 'fields', x: 0.5, y: 0.5 }

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    behavior: 'Ignore',
    added: false,
    typing: false,
    fields: 0
  }

  const PICKED = { ...REST, behavior: 'Allowlist', added: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    ...openAndPick(
      REST,
      BEHAVIOR,
      [
        [2, 160, 260],
        [1, 380, 260],
        [0, 260, 300]
      ],
      { behavior: 'Allowlist' },
      [
        [160, 420],
        [480, 160]
      ]
    ),
    { ...REST, cursor: option(0), focused: true, behavior: 'Allowlist', forward: 200, back: 120 },
    { ...PICKED, cursor: FIELDS_AREA, forward: 260, back: 420 },
    { ...PICKED, cursor: FIELDS_AREA, press: true, typing: true, forward: 480, back: 120 },
    ...Array.from(FIELDS, (_, index) => ({
      ...PICKED,
      cursor: FIELDS_AREA,
      typing: true,
      fields: index + 1,
      forward: index === 0 ? 200 : 90,
      back: 40
    }))
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const fields = computed(() => FIELDS.slice(0, frame.value.fields))

  const FIELD_RING_CLASS =
    'flex rounded-(--shape-control) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-focused:ring-2 data-focused:ring-offset-2 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:76%]"
    :active="active"
    :cursor="frame.cursor"
    cursor-name="Sam"
    :pressed="frame.press"
  >
    <div class="flex flex-col py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <div class="flex flex-col rounded-(--shape-card) border border-(--border-default)">
          <div
            class="flex items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
          >
            <CacheVaryHeading open>
              <template #title>Cache vary by Query String</template>
              <template #label>Behavior:</template>
              <template #value>{{ frame.behavior }}</template>
            </CacheVaryHeading>
          </div>

          <div class="flex flex-col p-(--spacing-md)">
            <ConsoleMockupShellItem
              :order="1"
              :data-state="frame.open ? 'open' : 'closed'"
              class="relative data-[state=open]:z-1"
            >
              <div class="flex flex-col gap-(--spacing-xs)">
                <FieldLabel for="accelerator-query-string-behavior">Behavior</FieldLabel>
                <MockupSelect
                  :value="frame.behavior"
                  :options="BEHAVIORS"
                  :open="frame.open"
                  :highlighted-index="frame.highlight"
                  :focused="frame.focused"
                  control-id="accelerator-query-string-behavior"
                  data-cursor="behavior"
                  aria-label="Behavior"
                />
                <FieldDescription
                  >Specify how the cache should handle query string parameters.</FieldDescription
                >
              </div>
            </ConsoleMockupShellItem>

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
                <div class="flex flex-col gap-(--spacing-xs) pt-(--spacing-lg)">
                  <FieldLabel
                    for="accelerator-query-string-fields"
                    required
                    >Fields</FieldLabel
                  >
                  <span
                    :data-focused="frame.typing || null"
                    :class="FIELD_RING_CLASS"
                  >
                    <Textarea
                      id="accelerator-query-string-fields"
                      :model-value="fields"
                      placeholder="user_id
session_token
product_id"
                      resize="none"
                      rows="3"
                      data-cursor="fields"
                      aria-label="Fields"
                    />
                  </span>
                  <FieldDescription
                    >Enter the query string parameters to be considered for cache variation. Use
                    line breaks to add multiple entries.</FieldDescription
                  >
                </div>
              </div>
            </Transition>

            <ConsoleMockupShellItem :order="2">
              <span class="flex items-start gap-(--spacing-sm) pt-(--spacing-lg)">
                <LegacySwitch :checked="true" />
                <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                  <span class="text-label-md text-(--text-default)">Sort</span>
                  <span class="text-body-xs text-(--text-muted)">
                    Enable sorting of query string parameters to ensure consistent cache behavior
                    regardless of parameter order.
                  </span>
                </span>
              </span>
            </ConsoleMockupShellItem>
          </div>
        </div>
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>
