<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import Checkbox from '../../../input/checkbox/checkbox.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import ConsoleMockupShell from '../console-mockup-shell/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../console-mockup-shell/console-mockup-shell-item/console-mockup-shell-item.vue'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'ApplicationAcceleratorMethodFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; POST and then OPTIONS are checked while it is, and unchecked after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = useMediaQuery('(hover: hover)', true)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

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

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hovered || !canHover.value)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const stageEl = ref<globalThis.HTMLElement | null>(null)
  const { position } = useMockupCursor(stageEl, () => frame.value.cursor)

  const checked = (key: string) => (key === 'post' ? frame.value.post : frame.value.options)

  const summary = computed(
    () =>
      METHODS.filter((method) => checked(method.key))
        .map((method) => method.title)
        .join(', ') || 'None'
  )

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    const target = wanted() ? LAST : 0
    if (step.value === target) return
    if (reduced.value || !canHover.value) {
      step.value = target
      return
    }
    const forward = target > step.value
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
  <ConsoleMockupShell
    variant="bare"
    shell="legacy"
    fade="bottom"
    class="[--mockup-fade-start:74%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stageEl"
      class="relative"
    >
      <div class="flex flex-col gap-(--spacing-md) py-(--spacing-xs)">
        <ConsoleMockupShellItem :order="0">
          <div class="flex flex-col rounded-(--shape-card) border border-(--border-default)">
            <div
              class="flex items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
            >
              <i
                class="ai ai-chevron-down text-body-xs text-(--text-default)"
                aria-hidden="true"
              />
              <span class="flex min-w-0 flex-col">
                <span class="text-label-md text-(--text-default)">Cache vary by Method</span>
                <span class="flex gap-(--spacing-2xs)">
                  <span class="text-body-sm text-(--text-muted)">Method:</span>
                  <span class="text-label-sm text-(--text-default)">{{ summary }}</span>
                </span>
              </span>
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
            <i
              class="ai ai-chevron-right text-body-xs text-(--text-default) rtl:-scale-x-100"
              aria-hidden="true"
            />
            <span class="flex min-w-0 flex-col">
              <span class="text-label-md text-(--text-default)">Cache vary by Query String</span>
              <span class="flex gap-(--spacing-2xs)">
                <span class="text-body-sm text-(--text-muted)">Behavior:</span>
                <span class="text-label-sm text-(--text-default)">Allowlist</span>
              </span>
            </span>
          </div>
        </ConsoleMockupShellItem>
      </div>

      <MockupCursor
        name="Priya"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ConsoleMockupShell>
</template>
