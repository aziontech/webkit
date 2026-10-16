<script setup lang="ts">
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import MockupSelect from '../MockupSelect.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'ApplicationAcceleratorCookieFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a second cookie name is typed into the list while it is, and erased after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const frame = computed(() => FRAMES[step.value])

  const stage = ref<globalThis.HTMLElement | null>(null)
  const { position } = useMockupCursor(stage, () => frame.value.cursor)

  const cookies = computed(() => KEPT + ADDED.slice(0, frame.value.added))

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
    shell="legacy"
    fade="bottom"
    class="[--mockup-fade-start:74%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative"
    >
      <div class="flex flex-col gap-(--spacing-md) py-(--spacing-xs)">
        <MockupPart :order="0">
          <div class="flex flex-col rounded-(--shape-card) border border-(--border-default)">
            <div
              class="flex items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
            >
              <i
                class="pi pi-chevron-down text-body-xs text-(--text-default)"
                aria-hidden="true"
              />
              <span class="flex min-w-0 flex-col">
                <span class="text-label-md text-(--text-default)">Cache vary by Cookies</span>
                <span class="flex gap-(--spacing-xxs)">
                  <span class="text-body-sm text-(--text-muted)">Behavior:</span>
                  <span class="text-label-sm text-(--text-default)">Allowlist</span>
                </span>
              </span>
            </div>

            <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
              <MockupPart :order="1">
                <div class="flex flex-col gap-(--spacing-xs)">
                  <Label
                    for="accelerator-cookies-behavior"
                    label="Behavior"
                  />
                  <MockupSelect
                    value="Allowlist"
                    control-id="accelerator-cookies-behavior"
                    aria-label="Behavior"
                  />
                  <HelperText label="Define how the cache should handle cookies." />
                </div>
              </MockupPart>

              <MockupPart :order="2">
                <div class="flex flex-col gap-(--spacing-xs)">
                  <Label
                    for="accelerator-cookies-fields"
                    label="Fields"
                    required
                  />
                  <span
                    :data-focused="frame.typing || null"
                    class="flex rounded-(--shape-elements) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-focused:ring-2 data-focused:ring-offset-2 motion-reduce:transition-none"
                  >
                    <Textarea
                      id="accelerator-cookies-fields"
                      :model-value="cookies"
                      placeholder="user_id
session_token
product_id"
                      resizable="none"
                      rows="3"
                      data-cursor="cookies"
                      aria-label="Fields"
                    />
                  </span>
                  <HelperText
                    label="Enter the cookie names to be considered for cache variation. Use line breaks to add multiple entries."
                  />
                </div>
              </MockupPart>
            </div>
          </div>
        </MockupPart>

        <MockupPart :order="3">
          <div
            class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
          >
            <i
              class="pi pi-chevron-right text-body-xs text-(--text-default)"
              aria-hidden="true"
            />
            <span class="flex min-w-0 flex-col">
              <span class="text-label-md text-(--text-default)">Cache vary by Devices</span>
              <span class="flex gap-(--spacing-xxs)">
                <span class="text-body-sm text-(--text-muted)">Behavior:</span>
                <span class="text-label-sm text-(--text-default)">Allowlist</span>
              </span>
            </span>
          </div>
        </MockupPart>
      </div>

      <MockupCursor
        name="Ana"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
