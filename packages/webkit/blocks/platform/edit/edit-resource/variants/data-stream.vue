<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import CodeEditor, { type CodeEditorMonacoModule } from '@aziontech/webkit/code-editor'
  import Field from '@aziontech/webkit/field'
  import HelperText, { type HelperTextKind } from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import NumberInput from '@aziontech/webkit/number-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, nextTick, reactive, ref } from 'vue'

  type FieldProblem = { kind: HelperTextKind; message: string }
  type LabeledOption = SelectOptionItem

  const loadMonaco = async (): Promise<CodeEditorMonacoModule> => {
    const [{ default: EditorWorker }, { default: JsonWorker }, { default: TsWorker }] =
      await Promise.all([
        import('monaco-editor/editor/editor.worker?worker'),
        import('monaco-editor/languages/features/json/json.worker?worker'),
        import('monaco-editor/languages/features/typescript/ts.worker?worker')
      ])
    globalThis.MonacoEnvironment = {
      getWorker: (_id, label) => {
        if (label === 'json') return new JsonWorker()
        if (label === 'typescript' || label === 'javascript') return new TsWorker()
        return new EditorWorker()
      }
    }
    return (await import('monaco-editor')) as unknown as CodeEditorMonacoModule
  }

  const sourceOptions = [
    { value: 'applications', label: 'Applications' },
    { value: 'functions', label: 'Functions' },
    { value: 'firewall', label: 'Firewall' },
    { value: 'activity', label: 'Activity history' }
  ]

  const scopeOptions = [
    {
      value: 'all',
      label: 'All current and future workloads',
      description:
        'Collect from every workload, including the ones created later. Unlocks sampling.'
    },
    {
      value: 'filtered',
      label: 'Selected workloads',
      description: 'Collect only from the workloads you list.'
    }
  ]

  const presetTemplates: Record<string, { label: string; dataSet: Record<string, string> }> = {
    'http-requests': {
      label: 'HTTP requests',
      dataSet: {
        time: '$time',
        host: '$host',
        request_method: '$request_method',
        request_uri: '$request_uri',
        status: '$status',
        bytes_sent: '$bytes_sent',
        request_time: '$request_time',
        upstream_cache_status: '$upstream_cache_status',
        remote_addr: '$remote_addr',
        geoip_country: '$geoip_country'
      }
    },
    'function-runs': {
      label: 'Function runs',
      dataSet: {
        time: '$time',
        function_id: '$function_id',
        function_name: '$function_name',
        duration_ms: '$duration_ms',
        status: '$status',
        log_level: '$log_level',
        message: '$message'
      }
    },
    'firewall-events': {
      label: 'Firewall events',
      dataSet: {
        time: '$time',
        host: '$host',
        rule_id: '$rule_id',
        rule_action: '$rule_action',
        threat_family: '$threat_family',
        remote_addr: '$remote_addr',
        request_uri: '$request_uri'
      }
    }
  }

  const templateOptions = [
    ...Object.entries(presetTemplates).map(([value, template]) => ({
      value,
      label: template.label
    })),
    { value: 'custom', label: 'Custom template' }
  ]

  const connectorOptions = [
    { value: 'standard', label: 'Standard HTTP/HTTPS POST' },
    { value: 'kafka', label: 'Apache Kafka' },
    { value: 's3', label: 'S3-compatible storage' },
    { value: 'analytics', label: 'Log analytics service' }
  ]

  const labelOf = (options: LabeledOption[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? ''

  const sourceLabel = labelOf(sourceOptions)
  const templateLabel = labelOf(templateOptions)
  const connectorLabel = labelOf(connectorOptions)

  const record = {
    name: 'http-to-collector',
    active: true,
    source: 'applications',
    scope: 'all',
    workloads: '',
    sampling: true,
    samplingRate: 25,
    template: 'custom',
    templateName: 'http-compact',
    dataSet: JSON.stringify(
      {
        time: '$time',
        host: '$host',
        status: '$status',
        request_uri: '$request_uri',
        request_time: '$request_time',
        upstream_cache_status: '$upstream_cache_status'
      },
      null,
      2
    ),
    connector: 'standard',
    url: 'https://collector.example.com/ingest',
    payloadFormat: '$dataset',
    lineSeparator: '\\n',
    headers: 'Authorization:Bearer example-token',
    bootstrapServers: '',
    topic: '',
    bucket: '',
    region: '',
    accessKey: '',
    secretKey: '',
    analyticsUrl: '',
    apiKey: ''
  }

  const form = reactive(structuredClone(record))
  const saving = ref(false)
  const baseline = ref(JSON.stringify(record))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)

  const errors = reactive<Record<string, FieldProblem | undefined>>({})
  const destinationError = ref('')

  const URL_PATTERN = /^https?:\/\/[^\s/$.?#][^\s]*$/
  const HEADERS_PATTERN = /^[^:\n]+:[^\n]*\S[^\n]*(\n[^:\n]+:[^\n]*\S[^\n]*){0,4}$/
  const SERVERS_PATTERN = /^[^\s,]+(,[^\s,]+)*$/
  const WORKLOADS_PATTERN = /^[^\n]*\S[^\n]*(\n[^\n]*\S[^\n]*)*$/

  const presetDocument = computed(() => {
    const template = presetTemplates[form.template]
    return template ? JSON.stringify(template.dataSet, null, 2) : ''
  })

  const presetTabs = computed(() => [
    {
      label: 'Data set',
      value: 'data-set',
      language: 'json',
      code: presetDocument.value
    }
  ])

  const clear = (id: string) => {
    if (errors[id]) delete errors[id]
  }

  const onDestinationChange = (id: string) => {
    clear(id)
    destinationError.value = ''
  }

  const required = (id: keyof typeof form) => {
    if (!String(form[id] ?? '').trim()) {
      errors[id] = { kind: 'required', message: 'This field is required.' }
      return false
    }
    return true
  }

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (required('name') && form.name.trim().length > 250)
      errors.name = { kind: 'invalid', message: 'Use at most 250 characters.' }
    if (
      form.scope === 'filtered' &&
      required('workloads') &&
      !WORKLOADS_PATTERN.test(form.workloads.trim())
    )
      errors.workloads = {
        kind: 'invalid',
        message: 'Remove the empty lines. Every line holds one workload.'
      }
    if (form.scope === 'all' && form.sampling) {
      const rate = Number(form.samplingRate)
      if (!Number.isFinite(rate) || rate < 1 || rate > 100)
        errors.samplingRate = { kind: 'invalid', message: 'Enter a rate from 1 to 100.' }
    }
    if (form.template === 'custom') {
      required('templateName')
      if (required('dataSet')) {
        let parsed: unknown = null
        try {
          parsed = JSON.parse(form.dataSet)
        } catch {
          parsed = null
        }
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
          errors.dataSet = { kind: 'invalid', message: 'Write the data set as a JSON object.' }
        else if (!Object.keys(parsed).length)
          errors.dataSet = {
            kind: 'invalid',
            message: 'Add at least one variable to the data set.'
          }
      }
    }
    if (form.connector === 'standard') {
      if (required('url') && !URL_PATTERN.test(form.url.trim()))
        errors.url = {
          kind: 'invalid',
          message: 'Enter a valid URL. Example: https://collector.example.com/ingest.'
        }
      required('payloadFormat')
      required('lineSeparator')
      if (form.headers.trim() && !HEADERS_PATTERN.test(form.headers.trim()))
        errors.headers = {
          kind: 'invalid',
          message: 'Write up to 5 headers, one per line, in the Key:Value format.'
        }
    }
    if (form.connector === 'kafka') {
      if (required('bootstrapServers') && !SERVERS_PATTERN.test(form.bootstrapServers.trim()))
        errors.bootstrapServers = {
          kind: 'invalid',
          message: 'Separate the servers with a comma and no space.'
        }
      required('topic')
    }
    if (form.connector === 's3') {
      required('bucket')
      required('region')
      required('accessKey')
      required('secretKey')
    }
    if (form.connector === 'analytics') {
      if (required('analyticsUrl') && !URL_PATTERN.test(form.analyticsUrl.trim()))
        errors.analyticsUrl = {
          kind: 'invalid',
          message: 'Enter a valid URL. Example: https://logs.example.com/api/v2/logs.'
        }
      required('apiKey')
    }
    return Object.keys(errors).length === 0
  }

  const focusFirstError = () =>
    nextTick(() => {
      const id = Object.keys(errors)[0]
      if (id) document.getElementById(`data-stream-${id}`)?.focus()
    })

  const unreachable = (value: string) => {
    try {
      return new URL(value).hostname.endsWith('.invalid')
    } catch {
      return false
    }
  }

  const save = () => {
    destinationError.value = ''
    if (!validate()) {
      focusFirstError()
      return
    }
    saving.value = true
    setTimeout(() => {
      saving.value = false
      const target = form.connector === 'analytics' ? 'analyticsUrl' : 'url'
      if (['standard', 'analytics'].includes(form.connector) && unreachable(form[target])) {
        destinationError.value =
          'The endpoint did not answer the test record, so the stream was not saved. Your other changes are still here.'
        errors[target] = {
          kind: 'invalid',
          message: 'The endpoint did not answer within 10 seconds.'
        }
        nextTick(() => document.getElementById('destination')?.scrollIntoView({ block: 'start' }))
        focusFirstError()
        return
      }
      baseline.value = JSON.stringify(form)
    }, 900)
  }

  const discard = () => {
    Object.assign(form, JSON.parse(baseline.value) as typeof form)
    Object.keys(errors).forEach((key) => delete errors[key])
    destinationError.value = ''
  }
</script>

<template>
  <form
    class="flex min-h-0 min-w-0 flex-1 flex-col"
    aria-label="Data stream settings"
    novalidate
    @submit.prevent="save"
  >
    <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
      <PageHeader
        title="Settings"
        description="Ship the records of your workloads to your own observability or storage platform. One stream, one destination."
        size="small"
      />

      <fieldset
        class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="saving"
      >
        <legend class="sr-only">Data stream settings</legend>

        <SettingsSection
          title="General"
          hint="How the stream is identified, and whether it is collecting records."
          anchor="general"
        >
          <Card :padded="false">
            <template #content>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <SettingRow
                    key="name"
                    title="Name"
                    description="Give a unique and descriptive name to identify the data stream."
                  >
                    <Input
                      id="data-stream-name"
                      v-model="form.name"
                      size="large"
                      class="w-full"
                      aria-label="Name"
                      placeholder="my-data-stream"
                      autocomplete="off"
                      :required="errors.name?.kind === 'required'"
                      :invalid="errors.name?.kind === 'invalid'"
                      :aria-describedby="errors.name ? 'data-stream-name-message' : undefined"
                      :disabled="saving"
                      @update:model-value="clear('name')"
                    />
                    <HelperText
                      v-if="errors.name"
                      id="data-stream-name-message"
                      :kind="errors.name.kind"
                      :label="errors.name.message"
                    />
                  </SettingRow>
                  <SettingRow
                    key="active"
                    title="Active"
                    description="When off, the stream stops collecting records and nothing is sent to the destination."
                    kind="compact"
                  >
                    <Switch
                      v-model="form.active"
                      aria-label="Active"
                      :disabled="saving"
                    />
                  </SettingRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsSection>

        <SettingsSection
          title="Source"
          hint="Which records the stream collects, and from which workloads."
          anchor="source"
        >
          <Card :padded="false">
            <template #content>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <SettingRow
                    key="source"
                    title="Data source"
                    description="The product the records are collected from."
                  >
                    <Select
                      v-model="form.source"
                      size="large"
                      class="w-full"
                      :display-value="sourceLabel"
                      :disabled="saving"
                      @update:model-value="clear('source')"
                    >
                      <Select.Trigger aria-label="Data source" />
                      <Select.Content>
                        <Select.Option
                          v-for="option in sourceOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </SettingRow>
                  <SettingRow
                    key="scope"
                    title="Workloads"
                    kind="stacked"
                  >
                    <fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
                      <legend class="sr-only">Workloads</legend>
                      <Field.Label
                        v-for="option in scopeOptions"
                        :key="option.value"
                      >
                        <Field
                          orientation="horizontal"
                          :disabled="saving"
                        >
                          <RadioButton
                            v-model="form.scope"
                            :value="option.value"
                            name="data-stream-scope"
                          />
                          <Field.Content>
                            <Field.Title>{{ option.label }}</Field.Title>
                            <Field.Description>{{ option.description }}</Field.Description>
                          </Field.Content>
                        </Field>
                      </Field.Label>
                    </fieldset>
                  </SettingRow>
                  <SettingRow
                    v-if="form.scope === 'filtered'"
                    key="workloads"
                    title="Selected workloads"
                    description="One workload per line. Only their records are sent to the destination."
                    kind="stacked"
                  >
                    <Textarea
                      id="data-stream-workloads"
                      v-model="form.workloads"
                      class="w-full"
                      :rows="4"
                      aria-label="Selected workloads"
                      placeholder="storefront&#10;checkout-api"
                      :required="errors.workloads?.kind === 'required'"
                      :invalid="errors.workloads?.kind === 'invalid'"
                      :aria-describedby="
                        errors.workloads ? 'data-stream-workloads-message' : undefined
                      "
                      :disabled="saving"
                      @update:model-value="clear('workloads')"
                    />
                    <HelperText
                      v-if="errors.workloads"
                      id="data-stream-workloads-message"
                      :kind="errors.workloads.kind"
                      :label="errors.workloads.message"
                    />
                  </SettingRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsSection>

        <SettingsSection
          v-if="form.scope === 'all'"
          title="Sampling"
          hint="Collect a share of the records instead of all of them. Only available when the stream collects from every workload."
          anchor="sampling"
        >
          <div
            v-if="form.sampling"
            class="mb-(--spacing-sm)"
          >
            <Alert
              severity="warning"
              label="Saving a stream with sampling on turns off every other data stream in this account."
            />
          </div>
          <Card :padded="false">
            <template #content>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <SettingRow
                    key="sampling"
                    title="Sampling"
                    description="Collect a share of the records instead of all of them, to save resources."
                    kind="compact"
                  >
                    <Switch
                      v-model="form.sampling"
                      aria-label="Sampling"
                      :disabled="saving"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.sampling"
                    key="samplingRate"
                    title="Sampling rate"
                    description="Percentage of records collected, from 1 to 100. The rate is statistical, and when streams differ the lowest one applies."
                  >
                    <NumberInput
                      id="data-stream-samplingRate"
                      v-model="form.samplingRate"
                      size="large"
                      class="w-full"
                      :min="1"
                      :max="100"
                      aria-label="Sampling rate, in percent"
                      :invalid="!!errors.samplingRate"
                      :aria-describedby="
                        errors.samplingRate ? 'data-stream-samplingRate-message' : undefined
                      "
                      :disabled="saving"
                      @update:model-value="clear('samplingRate')"
                    >
                      <template #suffix>%</template>
                    </NumberInput>
                    <HelperText
                      v-if="errors.samplingRate"
                      id="data-stream-samplingRate-message"
                      :kind="errors.samplingRate.kind"
                      :label="errors.samplingRate.message"
                    />
                  </SettingRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsSection>

        <SettingsSection
          title="Template"
          hint="The structure of each record sent to the destination."
          anchor="template"
        >
          <Card :padded="false">
            <template #content>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <SettingRow
                    key="template"
                    title="Template"
                    description="A preset sends a fixed set of variables for one source. A custom template lets you choose the variables."
                  >
                    <Select
                      v-model="form.template"
                      size="large"
                      class="w-full"
                      :display-value="templateLabel"
                      :disabled="saving"
                      @update:model-value="clear('template')"
                    >
                      <Select.Trigger aria-label="Template" />
                      <Select.Content>
                        <Select.Option
                          v-for="option in templateOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </SettingRow>
                  <SettingRow
                    v-if="form.template === 'custom'"
                    key="templateName"
                    title="Template name"
                    description="Give a unique and descriptive name to identify the custom template."
                  >
                    <Input
                      id="data-stream-templateName"
                      v-model="form.templateName"
                      size="large"
                      class="w-full"
                      aria-label="Template name"
                      placeholder="my-custom-template"
                      autocomplete="off"
                      :required="errors.templateName?.kind === 'required'"
                      :invalid="errors.templateName?.kind === 'invalid'"
                      :aria-describedby="
                        errors.templateName ? 'data-stream-templateName-message' : undefined
                      "
                      :disabled="saving"
                      @update:model-value="clear('templateName')"
                    />
                    <HelperText
                      v-if="errors.templateName"
                      id="data-stream-templateName-message"
                      :kind="errors.templateName.kind"
                      :label="errors.templateName.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.template === 'custom'"
                    key="dataSet"
                    title="Data set"
                    description="The variables sent to the destination, as a JSON object. Each value is a variable such as $host or $status."
                    kind="stacked"
                  >
                    <div class="flex w-full flex-col">
                      <CodeEditor
                        id="data-stream-dataSet"
                        v-model="form.dataSet"
                        :loader="loadMonaco"
                        language="json"
                        path="data-set.json"
                        height="16rem"
                        aria-label="Data set"
                        :invalid="!!errors.dataSet"
                        :aria-describedby="
                          errors.dataSet ? 'data-stream-dataSet-message' : undefined
                        "
                        :disabled="saving"
                        @update:model-value="clear('dataSet')"
                      />
                    </div>
                    <HelperText
                      v-if="errors.dataSet"
                      id="data-stream-dataSet-message"
                      :kind="errors.dataSet.kind"
                      :label="errors.dataSet.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-else
                    key="preset"
                    title="Data set"
                    description="The variables this template sends. A preset cannot be edited; choose Custom template to pick the variables yourself."
                    kind="stacked"
                  >
                    <div class="w-full min-w-0">
                      <CodeBlock
                        :tabs="presetTabs"
                        copy-aria-label="Copy the data set as JSON"
                      />
                    </div>
                  </SettingRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsSection>

        <SettingsSection
          title="Destination"
          hint="The platform the records are sent to. Every value comes from that platform, and credentials cannot be read back."
          anchor="destination"
        >
          <Transition
            enter-active-class="transition duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
            enter-from-class="translate-y-2 opacity-0"
            leave-active-class="transition duration-fast-02 ease-productive-exit motion-reduce:transition-none"
            leave-to-class="-translate-y-2 opacity-0"
          >
            <div
              v-if="destinationError"
              class="mb-(--spacing-sm)"
            >
              <Alert
                severity="danger"
                :label="destinationError"
              >
                <template #action>
                  <Button
                    type="button"
                    label="Send test record"
                    kind="secondary"
                    size="medium"
                    :loading="saving"
                    @click="save"
                  />
                </template>
              </Alert>
            </div>
          </Transition>
          <Card :padded="false">
            <template #content>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <SettingRow
                    key="connector"
                    title="Connector"
                    description="Each platform asks for different values."
                  >
                    <Select
                      v-model="form.connector"
                      size="large"
                      class="w-full"
                      :display-value="connectorLabel"
                      :disabled="saving"
                      @update:model-value="onDestinationChange('connector')"
                    >
                      <Select.Trigger
                        id="data-stream-connector"
                        aria-label="Connector"
                      />
                      <Select.Content>
                        <Select.Option
                          v-for="option in connectorOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 'standard'"
                    key="url"
                    title="URL"
                    description="The URL that receives the records."
                    stackable
                  >
                    <Input
                      id="data-stream-url"
                      v-model="form.url"
                      size="large"
                      class="w-full"
                      aria-label="URL"
                      placeholder="https://collector.example.com/ingest"
                      autocomplete="off"
                      :required="errors.url?.kind === 'required'"
                      :invalid="errors.url?.kind === 'invalid'"
                      :aria-describedby="errors.url ? 'data-stream-url-message' : undefined"
                      :disabled="saving"
                      @update:model-value="onDestinationChange('url')"
                    />
                    <HelperText
                      v-if="errors.url"
                      id="data-stream-url-message"
                      :kind="errors.url.kind"
                      :label="errors.url.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 'standard'"
                    key="payloadFormat"
                    title="Payload format"
                    description="The format each payload is sent in. $dataset is replaced by the records, joined by the log line separator."
                  >
                    <Input
                      id="data-stream-payloadFormat"
                      v-model="form.payloadFormat"
                      size="large"
                      class="w-full"
                      aria-label="Payload format"
                      placeholder="$dataset"
                      autocomplete="off"
                      :required="errors.payloadFormat?.kind === 'required'"
                      :invalid="errors.payloadFormat?.kind === 'invalid'"
                      :aria-describedby="
                        errors.payloadFormat ? 'data-stream-payloadFormat-message' : undefined
                      "
                      :disabled="saving"
                      @update:model-value="onDestinationChange('payloadFormat')"
                    />
                    <HelperText
                      v-if="errors.payloadFormat"
                      id="data-stream-payloadFormat-message"
                      :kind="errors.payloadFormat.kind"
                      :label="errors.payloadFormat.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 'standard'"
                    key="lineSeparator"
                    title="Log line separator"
                    description="Written at the end of each record. \n puts one record per line, in NDJSON format."
                  >
                    <Input
                      id="data-stream-lineSeparator"
                      v-model="form.lineSeparator"
                      size="large"
                      class="w-full"
                      aria-label="Log line separator"
                      placeholder="\n"
                      autocomplete="off"
                      :required="errors.lineSeparator?.kind === 'required'"
                      :invalid="errors.lineSeparator?.kind === 'invalid'"
                      :aria-describedby="
                        errors.lineSeparator ? 'data-stream-lineSeparator-message' : undefined
                      "
                      :disabled="saving"
                      @update:model-value="onDestinationChange('lineSeparator')"
                    />
                    <HelperText
                      v-if="errors.lineSeparator"
                      id="data-stream-lineSeparator-message"
                      :kind="errors.lineSeparator.kind"
                      :label="errors.lineSeparator.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 'standard'"
                    key="headers"
                    title="Custom headers"
                    description="Sent with every request. One per line, up to 5, in the Key:Value format."
                    kind="stacked"
                  >
                    <div class="flex w-full font-code">
                      <Textarea
                        id="data-stream-headers"
                        v-model="form.headers"
                        class="w-full"
                        :rows="3"
                        aria-label="Custom headers"
                        placeholder="header-name:value"
                        :required="errors.headers?.kind === 'required'"
                        :invalid="errors.headers?.kind === 'invalid'"
                        :aria-describedby="
                          errors.headers ? 'data-stream-headers-message' : undefined
                        "
                        :disabled="saving"
                        @update:model-value="onDestinationChange('headers')"
                      />
                    </div>
                    <HelperText
                      v-if="errors.headers"
                      id="data-stream-headers-message"
                      :kind="errors.headers.kind"
                      :label="errors.headers.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 'kafka'"
                    key="bootstrapServers"
                    title="Bootstrap servers"
                    description="The hosts and ports of the Kafka cluster, separated by a comma and no space."
                    kind="stacked"
                  >
                    <div class="flex w-full font-code">
                      <Textarea
                        id="data-stream-bootstrapServers"
                        v-model="form.bootstrapServers"
                        class="w-full"
                        :rows="2"
                        aria-label="Bootstrap servers"
                        placeholder="host1:9092,host2:9092"
                        :required="errors.bootstrapServers?.kind === 'required'"
                        :invalid="errors.bootstrapServers?.kind === 'invalid'"
                        :aria-describedby="
                          errors.bootstrapServers
                            ? 'data-stream-bootstrapServers-message'
                            : undefined
                        "
                        :disabled="saving"
                        @update:model-value="onDestinationChange('bootstrapServers')"
                      />
                    </div>
                    <HelperText
                      v-if="errors.bootstrapServers"
                      id="data-stream-bootstrapServers-message"
                      :kind="errors.bootstrapServers.kind"
                      :label="errors.bootstrapServers.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 'kafka'"
                    key="topic"
                    title="Topic"
                    description="The Kafka topic the records are written to."
                  >
                    <Input
                      id="data-stream-topic"
                      v-model="form.topic"
                      size="large"
                      class="w-full"
                      aria-label="Topic"
                      placeholder="edge-records"
                      autocomplete="off"
                      :required="errors.topic?.kind === 'required'"
                      :invalid="errors.topic?.kind === 'invalid'"
                      :aria-describedby="errors.topic ? 'data-stream-topic-message' : undefined"
                      :disabled="saving"
                      @update:model-value="onDestinationChange('topic')"
                    />
                    <HelperText
                      v-if="errors.topic"
                      id="data-stream-topic-message"
                      :kind="errors.topic.kind"
                      :label="errors.topic.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 's3'"
                    key="bucket"
                    title="Bucket"
                    description="The bucket the record files are written to."
                  >
                    <Input
                      id="data-stream-bucket"
                      v-model="form.bucket"
                      size="large"
                      class="w-full"
                      aria-label="Bucket"
                      placeholder="my-records-bucket"
                      autocomplete="off"
                      :required="errors.bucket?.kind === 'required'"
                      :invalid="errors.bucket?.kind === 'invalid'"
                      :aria-describedby="errors.bucket ? 'data-stream-bucket-message' : undefined"
                      :disabled="saving"
                      @update:model-value="onDestinationChange('bucket')"
                    />
                    <HelperText
                      v-if="errors.bucket"
                      id="data-stream-bucket-message"
                      :kind="errors.bucket.kind"
                      :label="errors.bucket.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 's3'"
                    key="region"
                    title="Region"
                    description="The region of the bucket, as the storage provider names it."
                  >
                    <Input
                      id="data-stream-region"
                      v-model="form.region"
                      size="large"
                      class="w-full"
                      aria-label="Region"
                      placeholder="us-east-1"
                      autocomplete="off"
                      :required="errors.region?.kind === 'required'"
                      :invalid="errors.region?.kind === 'invalid'"
                      :aria-describedby="errors.region ? 'data-stream-region-message' : undefined"
                      :disabled="saving"
                      @update:model-value="onDestinationChange('region')"
                    />
                    <HelperText
                      v-if="errors.region"
                      id="data-stream-region-message"
                      :kind="errors.region.kind"
                      :label="errors.region.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 's3'"
                    key="accessKey"
                    title="Access key"
                    description="The access key of a user allowed to write to the bucket."
                  >
                    <Input
                      id="data-stream-accessKey"
                      v-model="form.accessKey"
                      size="large"
                      class="w-full"
                      aria-label="Access key"
                      placeholder="AKIAEXAMPLE"
                      autocomplete="off"
                      :required="errors.accessKey?.kind === 'required'"
                      :invalid="errors.accessKey?.kind === 'invalid'"
                      :aria-describedby="
                        errors.accessKey ? 'data-stream-accessKey-message' : undefined
                      "
                      :disabled="saving"
                      @update:model-value="onDestinationChange('accessKey')"
                    />
                    <HelperText
                      v-if="errors.accessKey"
                      id="data-stream-accessKey-message"
                      :kind="errors.accessKey.kind"
                      :label="errors.accessKey.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 's3'"
                    key="secretKey"
                    title="Secret key"
                    description="The secret key paired with the access key. It cannot be read back after saving."
                  >
                    <PasswordInput
                      id="data-stream-secretKey"
                      v-model="form.secretKey"
                      class="w-full"
                      aria-label="Secret key"
                      placeholder="Enter the secret key"
                      autocomplete="off"
                      :required="errors.secretKey?.kind === 'required'"
                      :invalid="errors.secretKey?.kind === 'invalid'"
                      :aria-describedby="
                        errors.secretKey ? 'data-stream-secretKey-message' : undefined
                      "
                      :disabled="saving"
                      @update:model-value="onDestinationChange('secretKey')"
                    />
                    <HelperText
                      v-if="errors.secretKey"
                      id="data-stream-secretKey-message"
                      :kind="errors.secretKey.kind"
                      :label="errors.secretKey.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 'analytics'"
                    key="analyticsUrl"
                    title="Intake URL"
                    description="The intake URL of your log analytics account."
                    stackable
                  >
                    <Input
                      id="data-stream-analyticsUrl"
                      v-model="form.analyticsUrl"
                      size="large"
                      class="w-full"
                      aria-label="Intake URL"
                      placeholder="https://logs.example.com/api/v2/logs"
                      autocomplete="off"
                      :required="errors.analyticsUrl?.kind === 'required'"
                      :invalid="errors.analyticsUrl?.kind === 'invalid'"
                      :aria-describedby="
                        errors.analyticsUrl ? 'data-stream-analyticsUrl-message' : undefined
                      "
                      :disabled="saving"
                      @update:model-value="onDestinationChange('analyticsUrl')"
                    />
                    <HelperText
                      v-if="errors.analyticsUrl"
                      id="data-stream-analyticsUrl-message"
                      :kind="errors.analyticsUrl.kind"
                      :label="errors.analyticsUrl.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-if="form.connector === 'analytics'"
                    key="apiKey"
                    title="API key"
                    description="An API key of your log analytics account. It cannot be read back after saving."
                  >
                    <PasswordInput
                      id="data-stream-apiKey"
                      v-model="form.apiKey"
                      class="w-full"
                      aria-label="API key"
                      placeholder="Enter the API key"
                      autocomplete="off"
                      :required="errors.apiKey?.kind === 'required'"
                      :invalid="errors.apiKey?.kind === 'invalid'"
                      :aria-describedby="errors.apiKey ? 'data-stream-apiKey-message' : undefined"
                      :disabled="saving"
                      @update:model-value="onDestinationChange('apiKey')"
                    />
                    <HelperText
                      v-if="errors.apiKey"
                      id="data-stream-apiKey-message"
                      :kind="errors.apiKey.kind"
                      :label="errors.apiKey.message"
                    />
                  </SettingRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsSection>
      </fieldset>
    </div>

    <Transition
      enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
      leave-to-class="translate-y-2 opacity-0"
    >
      <SaveBar v-if="dirty || saving">
        Data stream settings changed.
        <span class="text-(--text-muted)">Saving sends one test record to the destination.</span>

        <template #actions>
          <Button
            type="button"
            label="Discard"
            kind="outlined"
            size="medium"
            :disabled="saving"
            @click="discard"
          />
          <Button
            label="Save"
            kind="primary"
            size="medium"
            :loading="saving"
            @click="save"
          />
        </template>
      </SaveBar>
    </Transition>
  </form>
</template>
