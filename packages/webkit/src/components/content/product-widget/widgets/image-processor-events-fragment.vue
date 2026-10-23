<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'ImageProcessorEventsFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the log is refreshed and a new processed image arrives on top while it is, and leaves after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const AGENT =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15'

  const event = (time: string, requestUri: string, bytesSent: string) => ({
    time,
    body: [
      { key: 'configurationId', value: '1790219143' },
      { key: 'host', value: 'shop.example.com' },
      { key: 'requestUri', value: requestUri },
      { key: 'status', value: '200' },
      { key: 'httpReferer', value: 'https://shop.example.com/' },
      { key: 'httpUserAgent', value: AGENT },
      { key: 'bytesSent', value: bytesSent }
    ]
  })

  const ARRIVAL = event(
    'October 16, 2026 at 02:14:31 PM',
    '/img/sneaker.jpg?ims=fit-in/400x300/filters:format(avif)',
    '18406'
  )

  const EVENTS = [
    event(
      'October 16, 2026 at 02:14:07 PM',
      '/img/sneaker.jpg?ims=fit-in/800x600/filters:format(webp):quality(80)',
      '48213'
    ),
    event('October 16, 2026 at 02:13:52 PM', '/img/banner.png?ims=1280x', '96734'),
    event('October 16, 2026 at 02:13:40 PM', '/img/bag.jpg?ims=800x600:quality=85:webp', '37108'),
    event('October 16, 2026 at 02:13:18 PM', '/img/cover.jpg?ims=x600', '52990')
  ]

  const formatValue = (text: string) => (text.length > 100 ? `${text.slice(0, 100)}...` : text)

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    pressed: boolean
    added: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'refresh', x: 3.4, y: 0.7 }
  const REFRESH: MockupCursorTarget = { key: 'refresh', x: 0.55, y: 0.6 }

  const REST = { cursor: IDLE, press: false, pressed: false, added: false }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: REFRESH, forward: 160, back: 420 },
    { ...REST, cursor: REFRESH, press: true, pressed: true, forward: 480, back: 0 },
    { ...REST, cursor: REFRESH, pressed: true, added: true, forward: 260, back: 60 },
    { ...REST, cursor: REFRESH, added: true, forward: 300, back: 300 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const goingBack = ref(false)
  const stage = ref<globalThis.HTMLElement | null>(null)

  const frame = computed(() => FRAMES[step.value])
  const pressed = computed(() => frame.value.pressed && !goingBack.value)
  const records = computed(() => EVENTS.length + (frame.value.added ? 1 : 0))
  const { position } = useMockupCursor(stage, () => frame.value.cursor)

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
    shell="legacy"
    fade="bottom"
    class="[--mockup-fade-start:70%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative flex h-full flex-col gap-(--spacing-sm) py-(--spacing-xs)"
    >
      <ShellMockupPart :order="0">
        <span class="flex items-center justify-between gap-(--spacing-sm)">
          <span
            data-cursor="refresh"
            :data-pressed="pressed || null"
            class="inline-flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-pressed:ring-2 data-pressed:ring-offset-2 motion-reduce:transition-none"
          >
            <Button
              label="Refresh"
              kind="outlined"
              size="small"
              icon="pi pi-refresh"
            />
          </span>
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs) text-body-xs text-(--text-default) tabular-nums"
          >
            {{ records }} records found
          </span>
        </span>
      </ShellMockupPart>

      <ShellMockupPart :order="1">
        <div
          class="flex flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default)"
        >
          <span
            class="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-(--spacing-md) bg-(--bg-surface-raised) px-(--spacing-md) py-(--spacing-sm) text-label-sm text-(--text-default)"
          >
            <span>Time</span>
            <span>Log Body</span>
          </span>

          <Transition
            enter-active-class="animate-slide-down motion-reduce:animate-none"
            leave-active-class="animate-slide-down [animation-direction:reverse] motion-reduce:animate-none"
          >
            <div
              v-if="frame.added"
              class="overflow-hidden [interpolate-size:allow-keywords]"
            >
              <span
                class="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-(--spacing-md) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
                <span class="text-body-xs text-(--text-default)">{{ ARRIVAL.time }}</span>
                <span class="line-clamp-4 text-body-code-sm wrap-anywhere text-(--text-default)">
                  <span
                    v-for="item in ARRIVAL.body"
                    :key="item.key"
                    class="mr-(--spacing-xs)"
                  >
                    <span class="bg-(--bg-surface-raised)">{{ item.key }}:</span>
                    {{ formatValue(item.value) }}
                  </span>
                </span>
              </span>
            </div>
          </Transition>

          <span
            v-for="row in EVENTS"
            :key="row.time"
            class="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-(--spacing-md) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
          >
            <span class="text-body-xs text-(--text-default)">{{ row.time }}</span>
            <span class="line-clamp-4 text-body-code-sm wrap-anywhere text-(--text-default)">
              <span
                v-for="item in row.body"
                :key="item.key"
                class="mr-(--spacing-xs)"
              >
                <span class="bg-(--bg-surface-raised)">{{ item.key }}:</span>
                {{ formatValue(item.value) }}
              </span>
            </span>
          </span>
        </div>
      </ShellMockupPart>

      <MockupCursor
        name="Bianca"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
