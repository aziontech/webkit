<script setup lang="ts">
  import { computed } from 'vue'

  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import Input from '../../../input/input/input.vue'
  import Textarea from '../../../input/textarea/textarea.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import { openAndPick, option } from '../lib/pick-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'DataStreamConnectorFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; Splunk is picked as the connector and its fields replace Datadog's while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

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
      url: 'https://logs.example.com/v1/input',
      urlHelp: 'URL or URI of the Datadog endpoint.',
      key: 'ij9076f1ujik17a81f938yhru5g713422',
      keyHelp: 'API key generated through the Datadog dashboard.'
    },
    Splunk: {
      url: 'https://splunk.example.com:8088/services/collector',
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

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    connector: 'Datadog' as Connector
  }

  const PICKED = { ...REST, connector: 'Splunk' as Connector }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    ...openAndPick(
      REST,
      TRIGGER,
      [
        [4, 160, 300],
        [3, 300, 260],
        [2, 300, 420]
      ],
      { connector: 'Splunk' as Connector }
    ),
    { ...PICKED, cursor: option(2), focused: true, forward: 200, back: 260 },
    { ...PICKED, cursor: IDLE, forward: 420, back: 0 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const fields = computed(() => FIELDS[frame.value.connector])
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:72%]"
    :active="active"
    stage-class="flex h-full flex-col gap-(--spacing-lg) py-(--spacing-xs)"
    :cursor="frame.cursor"
    cursor-name="Chris"
    :pressed="frame.press"
  >
    <ConsoleMockupShellItem
      :order="0"
      :data-state="frame.open ? 'open' : 'closed'"
      class="relative data-[state=open]:z-1"
    >
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel
          for="data-stream-connector"
          required
          >Connector</FieldLabel
        >
        <MockupSelect
          control-id="data-stream-connector"
          :value="frame.connector"
          :options="CONNECTORS"
          :open="frame.open"
          :highlighted-index="frame.highlight"
          :focused="frame.focused"
          data-cursor="connector"
          aria-label="Connector"
        />
        <FieldDescription
          >Each option represents a different platform and requires different
          values.</FieldDescription
        >
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="1">
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel
          for="data-stream-url"
          required
          >URL</FieldLabel
        >
        <Input
          id="data-stream-url"
          model-value=""
          :placeholder="fields.url"
          size="medium"
          aria-label="URL"
        />
        <FieldDescription>{{ fields.urlHelp }}</FieldDescription>
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="2">
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel
          for="data-stream-api-key"
          required
          >API Key</FieldLabel
        >
        <Textarea
          id="data-stream-api-key"
          model-value=""
          :placeholder="fields.key"
          resize="none"
          rows="2"
          aria-label="API Key"
        />
        <FieldDescription>{{ fields.keyHelp }}</FieldDescription>
      </div>
    </ConsoleMockupShellItem>
  </MockupFragment>
</template>
