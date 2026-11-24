<script setup lang="ts">
  import { computed } from 'vue'

  import Checkbox from '../../../input/checkbox/checkbox.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import CacheVaryHeading from '../parts/cache-vary-heading.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'ApplicationAcceleratorMethodFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; POST and then OPTIONS are checked while it is, and unchecked after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const METHODS = [
    {
      key: 'post',
      title: 'POST',
      description:
        'Enable caching for POST requests, allowing specific POST responses to be stored and reused.'
    },
    {
      key: 'options',
      title: 'OPTIONS',
      description:
        'Enable caching for OPTIONS requests, allowing specific OPTIONS responses to be stored and reused.'
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    post: boolean
    options: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'options-text', x: 0.7, y: 1.6 }
  const POST: MockupCursorTarget = { key: 'post', x: 0.55, y: 0.6 }
  const OPTIONS: MockupCursorTarget = { key: 'options', x: 0.55, y: 0.6 }

  const REST = { cursor: IDLE, press: false, post: false, options: false }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: POST, forward: 160, back: 420 },
    { ...REST, cursor: POST, press: true, forward: 480, back: 120 },
    { ...REST, cursor: POST, press: true, post: true, forward: 120, back: 160 },
    { ...REST, cursor: OPTIONS, post: true, forward: 260, back: 420 },
    { ...REST, cursor: OPTIONS, press: true, post: true, forward: 480, back: 120 },
    { ...REST, cursor: OPTIONS, press: true, post: true, options: true, forward: 120, back: 160 },
    { ...REST, cursor: OPTIONS, post: true, options: true, forward: 160, back: 120 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const checked = (key: string) => (key === 'post' ? frame.value.post : frame.value.options)

  const summary = computed(
    () =>
      METHODS.filter((method) => checked(method.key))
        .map((method) => method.title)
        .join(', ') || 'None'
  )
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:74%]"
    :active="active"
    :cursor="frame.cursor"
    cursor-name="Priya"
    :pressed="frame.press"
  >
    <div class="flex flex-col gap-(--spacing-md) py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <div class="flex flex-col rounded-(--shape-card) border border-(--border-default)">
          <div
            class="flex items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
          >
            <CacheVaryHeading open>
              <template #title>Cache vary by Method</template>
              <template #label>Method:</template>
              <template #value>{{ summary }}</template>
            </CacheVaryHeading>
          </div>

          <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
            <ConsoleMockupShellItem
              v-for="(method, index) in METHODS"
              :key="method.key"
              :order="index + 1"
            >
              <span class="flex items-start gap-(--spacing-sm)">
                <span
                  :data-cursor="method.key"
                  class="flex pt-(--spacing-2xs)"
                >
                  <Checkbox
                    :model-value="checked(method.key)"
                    :aria-label="method.title"
                  />
                </span>
                <span class="flex min-w-0 flex-col gap-(--spacing-xs)">
                  <span class="text-label-md text-(--text-default)">{{ method.title }}</span>
                  <span
                    :data-cursor="`${method.key}-text`"
                    class="text-body-xs text-(--text-muted)"
                  >
                    {{ method.description }}
                  </span>
                </span>
              </span>
            </ConsoleMockupShellItem>
          </div>
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="3">
        <div
          class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
        >
          <CacheVaryHeading>
            <template #title>Cache vary by Query String</template>
            <template #label>Behavior:</template>
            <template #value>Allowlist</template>
          </CacheVaryHeading>
        </div>
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>
