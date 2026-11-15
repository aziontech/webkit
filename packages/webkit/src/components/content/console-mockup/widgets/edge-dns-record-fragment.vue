<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import Input from '../../../input/input/input.vue'
  import InputGroupRoot from '../../../input/input-group/input-group.vue'
  import InputGroupAddon from '../../../input/input-group/input-group-addon/input-group-addon.vue'
  import NumberInput from '../../../input/number-input/number-input.vue'
  import Textarea from '../../../input/textarea/textarea.vue'
  import Link from '../../../navigation/link/link.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import ConsoleMockupShell from '../parts/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupCursor from '../parts/mockup-cursor.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'EdgeDnsRecordFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the record type is picked from its list while it is, and set back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = useMediaQuery('(hover: hover)', true)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const RECORD_TYPES = [
    { label: 'A - IPv4 Address', placeholder: '192.0.2.1', helper: 'Accepts an IPv4 address.' },
    {
      label: 'AAAA - IPv6 Address',
      placeholder: '2001:db8::1',
      helper: 'Accepts an IPv6 address.'
    },
    {
      label: 'CNAME - Canonical Name',
      placeholder: 'example.com',
      helper: 'Accepts a single hostname.'
    },
    {
      label: 'MX - Mail Exchange',
      placeholder: '10 mail.example.com',
      helper: 'Accepts a priority and a mail server, e.g. 10 mail.example.com.'
    },
    {
      label: 'TXT - Text',
      placeholder: 'v=spf1 include:example.com ~all',
      helper: 'Accepts free-form text.'
    },
    {
      label: 'NS - Nameserver',
      placeholder: 'ns1.example.com',
      helper: 'Accepts a nameserver hostname.'
    }
  ]

  const TYPE_LABELS = RECORD_TYPES.map((type) => type.label)

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    type: number
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'record-type', x: 0.86, y: 1.9 }
  const TRIGGER: MockupCursorTarget = { key: 'record-type', x: 0.35, y: 0.6 }
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    type: 0
  }

  const PICKING = { ...REST, focused: true, open: true }
  const PICKED = { ...REST, type: 2 }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: TRIGGER, forward: 120, back: 420 },
    { ...REST, cursor: TRIGGER, press: true, focused: true, forward: 480, back: 160 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 160, back: 300 },
    { ...PICKING, cursor: option(2), highlight: 2, forward: 460, back: 420 },
    { ...PICKING, cursor: option(2), highlight: 2, press: true, forward: 420, back: 120 },
    { ...PICKING, cursor: option(2), highlight: 2, press: true, type: 2, forward: 120, back: 220 },
    { ...PICKED, cursor: option(2), focused: true, forward: 200, back: 260 },
    { ...PICKED, forward: 260, back: 160 }
  ]

  const LAST = FRAMES.length - 1

  const DOCS_HREF = 'https://www.azion.com/en/documentation/products/secure/edge-dns/'

  const wanted = () => props.active && (props.hovered || !canHover.value)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])
  const selected = computed(() => RECORD_TYPES[frame.value.type])

  const stageEl = ref<globalThis.HTMLElement | null>(null)

  const { position } = useMockupCursor(stageEl, () => frame.value.cursor)

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
    fade="bottom"
    class="[--console-mockup-fade-start:74%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stageEl"
      class="relative"
    >
      <div class="flex flex-col gap-(--spacing-lg) py-(--spacing-xs)">
        <ConsoleMockupShellItem :order="0">
          <div class="flex flex-col gap-(--spacing-xs)">
            <FieldLabel for="edge-dns-record-name">Name</FieldLabel>
            <InputGroupRoot>
              <Input
                id="edge-dns-record-name"
                model-value="www"
                size="medium"
                class="flex-1"
                placeholder="subdomain"
                aria-label="Name"
              />
              <InputGroupAddon>.example.com</InputGroupAddon>
            </InputGroupRoot>
            <FieldDescription>Use @ to create a record for the root domain.</FieldDescription>
          </div>
        </ConsoleMockupShellItem>

        <ConsoleMockupShellItem
          :order="1"
          :data-state="frame.open ? 'open' : 'closed'"
          class="relative data-[state=open]:z-1"
        >
          <div class="flex flex-col gap-(--spacing-xs)">
            <FieldLabel for="edge-dns-record-type">Record type</FieldLabel>
            <MockupSelect
              :value="selected.label"
              :options="TYPE_LABELS"
              :open="frame.open"
              :highlighted-index="frame.highlight"
              :focused="frame.focused"
              data-cursor="record-type"
              control-id="edge-dns-record-type"
              aria-label="Record type"
            />
            <span class="isolate flex">
              <FieldDescription>
                <Link
                  label="Read more about record types"
                  size="medium"
                  :href="DOCS_HREF"
                  target="_blank"
                />
              </FieldDescription>
            </span>
          </div>
        </ConsoleMockupShellItem>

        <ConsoleMockupShellItem :order="2">
          <div class="flex flex-col gap-(--spacing-xs)">
            <FieldLabel for="edge-dns-record-ttl">TTL (seconds)</FieldLabel>
            <NumberInput
              id="edge-dns-record-ttl"
              :model-value="3600"
              size="medium"
              aria-label="TTL in seconds"
            />
            <FieldDescription
              >Time-to-live a response can be cached for on a resolver server.</FieldDescription
            >
          </div>
        </ConsoleMockupShellItem>

        <ConsoleMockupShellItem :order="3">
          <div class="flex flex-col gap-(--spacing-xs)">
            <FieldLabel for="edge-dns-record-value">Value</FieldLabel>
            <Textarea
              id="edge-dns-record-value"
              class="w-full"
              :placeholder="selected.placeholder"
              aria-label="Value"
            />
            <FieldDescription>{{ selected.helper }}</FieldDescription>
          </div>
        </ConsoleMockupShellItem>
      </div>

      <MockupCursor
        name="Alex"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ConsoleMockupShell>
</template>
