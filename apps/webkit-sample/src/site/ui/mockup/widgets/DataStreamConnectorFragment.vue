<script setup lang="ts">
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import MockupSelect from '../MockupSelect.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'DataStreamConnectorFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; Splunk is picked as the connector and its fields replace Datadog's while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const CONNECTORS = [
    'Google BigQuery',
    'Elasticsearch',
    'Splunk',
    'AWS Kinesis Data Firehose',
    'Datadog',
    'IBM QRadar'
  ]

  const FIELDS = {
    Datadog: {
      url: 'https://http-intake.logs.datadoghq.com/v1/input',
      urlHelp: 'URL or URI of the Datadog endpoint.',
      key: 'ij9076f1ujik17a81f938yhru5g713422',
      keyHelp: 'API key generated through the Datadog dashboard.'
    },
    Splunk: {
      url: 'https://inputs.splunk-client.splunkcloud.com:123456/services/collector',
      urlHelp:
        "URL that'll receive the collected data. If you have an alternative index to point, add it at the end of the URL.",
      key: 'crfe25d2-23j8-48gf-a9ks-6b75w3ska674',
      keyHelp: 'HTTP Event Collector Token provided during the Splunk installation.'
    }
  }

  type Connector = keyof typeof FIELDS

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    connector: Connector
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'connector', x: 0.66, y: -0.9 }
  const TRIGGER: MockupCursorTarget = { key: 'connector', x: 0.4, y: 0.6 }
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    connector: 'Datadog' as Connector
  }

  const PICKING = { ...REST, focused: true, open: true }
  const PICKED = { ...REST, connector: 'Splunk' as Connector }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: TRIGGER, forward: 120, back: 420 },
    { ...REST, cursor: TRIGGER, press: true, focused: true, forward: 480, back: 160 },
    { ...PICKING, cursor: option(4), highlight: 4, forward: 160, back: 300 },
    { ...PICKING, cursor: option(3), highlight: 3, forward: 300, back: 260 },
    { ...PICKING, cursor: option(2), highlight: 2, forward: 300, back: 420 },
    { ...PICKING, cursor: option(2), highlight: 2, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(2),
      highlight: 2,
      press: true,
      connector: 'Splunk' as Connector,
      forward: 120,
      back: 220
    },
    { ...PICKED, cursor: option(2), focused: true, forward: 200, back: 260 },
    { ...PICKED, cursor: IDLE, forward: 420, back: 0 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const stage = ref<globalThis.HTMLElement | null>(null)

  const frame = computed(() => FRAMES[step.value])
  const fields = computed(() => FIELDS[frame.value.connector])
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
    class="[--mockup-fade-start:72%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative flex h-full flex-col gap-(--spacing-lg) py-(--spacing-xs)"
    >
      <MockupPart
        :order="0"
        :data-open="frame.open || null"
        class="relative data-open:z-1"
      >
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="data-stream-connector"
            label="Connector"
            required
          />
          <MockupSelect
            control-id="data-stream-connector"
            :value="frame.connector"
            :options="CONNECTORS"
            :open="frame.open"
            :highlight="frame.highlight"
            :focused="frame.focused"
            data-cursor="connector"
            aria-label="Connector"
          />
          <HelperText
            label="Each option represents a different platform and requires different values."
          />
        </div>
      </MockupPart>

      <MockupPart :order="1">
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="data-stream-url"
            label="URL"
            required
          />
          <InputText
            id="data-stream-url"
            model-value=""
            :placeholder="fields.url"
            size="medium"
            aria-label="URL"
          />
          <HelperText :label="fields.urlHelp" />
        </div>
      </MockupPart>

      <MockupPart :order="2">
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="data-stream-api-key"
            label="API Key"
            required
          />
          <Textarea
            id="data-stream-api-key"
            model-value=""
            :placeholder="fields.key"
            resizable="none"
            rows="2"
            aria-label="API Key"
          />
          <HelperText :label="fields.keyHelp" />
        </div>
      </MockupPart>

      <MockupCursor
        name="Diego"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
