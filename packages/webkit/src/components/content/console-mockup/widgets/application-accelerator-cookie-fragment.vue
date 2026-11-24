<script setup lang="ts">
  import { computed } from 'vue'

  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import Textarea from '../../../input/textarea/textarea.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import CacheVaryHeading from '../parts/cache-vary-heading.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'ApplicationAcceleratorCookieFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a second cookie name is typed into the list while it is, and erased after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const KEPT = 'session'
  const ADDED = '\ncart'

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    typing: boolean
    added: number
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'cookies', x: 0.78, y: 1.4 }
  const COOKIES: MockupCursorTarget = { key: 'cookies', x: 0.45, y: 0.55 }

  const REST = { cursor: IDLE, press: false, typing: false, added: 0 }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: COOKIES, forward: 160, back: 420 },
    { ...REST, cursor: COOKIES, press: true, typing: true, forward: 480, back: 120 },
    ...Array.from(ADDED, (_, index) => ({
      ...REST,
      cursor: COOKIES,
      typing: true,
      added: index + 1,
      forward: index === 0 ? 220 : 110,
      back: 50
    }))
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const cookies = computed(() => KEPT + ADDED.slice(0, frame.value.added))

  const FIELD_RING_CLASS =
    'flex rounded-(--shape-control) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-focused:ring-2 data-focused:ring-offset-2 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:74%]"
    :active="active"
    :cursor="frame.cursor"
    cursor-name="Jane"
    :pressed="frame.press"
  >
    <div class="flex flex-col gap-(--spacing-md) py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <div class="flex flex-col rounded-(--shape-card) border border-(--border-default)">
          <div
            class="flex items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
          >
            <CacheVaryHeading open>
              <template #title>Cache vary by Cookies</template>
              <template #label>Behavior:</template>
              <template #value>Allowlist</template>
            </CacheVaryHeading>
          </div>

          <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
            <ConsoleMockupShellItem :order="1">
              <div class="flex flex-col gap-(--spacing-xs)">
                <FieldLabel for="accelerator-cookies-behavior">Behavior</FieldLabel>
                <MockupSelect
                  value="Allowlist"
                  control-id="accelerator-cookies-behavior"
                  aria-label="Behavior"
                />
                <FieldDescription>Define how the cache should handle cookies.</FieldDescription>
              </div>
            </ConsoleMockupShellItem>

            <ConsoleMockupShellItem :order="2">
              <div class="flex flex-col gap-(--spacing-xs)">
                <FieldLabel
                  for="accelerator-cookies-fields"
                  required
                  >Fields</FieldLabel
                >
                <span
                  :data-focused="frame.typing || null"
                  :class="FIELD_RING_CLASS"
                >
                  <Textarea
                    id="accelerator-cookies-fields"
                    :model-value="cookies"
                    placeholder="user_id
session_token
product_id"
                    resize="none"
                    rows="3"
                    data-cursor="cookies"
                    aria-label="Fields"
                  />
                </span>
                <FieldDescription
                  >Enter the cookie names to be considered for cache variation. Use line breaks to
                  add multiple entries.</FieldDescription
                >
              </div>
            </ConsoleMockupShellItem>
          </div>
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="3">
        <div
          class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
        >
          <CacheVaryHeading>
            <template #title>Cache vary by Devices</template>
            <template #label>Behavior:</template>
            <template #value>Allowlist</template>
          </CacheVaryHeading>
        </div>
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>
