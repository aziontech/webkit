<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import AttributeEditor, { type AttributeEditorColumn } from '@aziontech/ui/attribute-editor'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import PasswordInput from '@aziontech/ui/password-input'
  import Select, { type SelectOptionItem } from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Textarea from '@aziontech/ui/textarea'
  import { computed } from 'vue'

  import { headerProblem, isCredentialHeader } from '../lib/data-stream-checks'
  import { sampleDataStreamConnectors as connectorOptions } from '../sample'
  import { useDataStreamContext } from '../use-data-stream'
  import DataStreamInputRow from './data-stream-input-row.vue'

  const { form, errors, saving, destinationError, onDestinationChange, save } =
    useDataStreamContext()

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? ''
  const connectorLabel = labelOf(connectorOptions)

  const HEADER_COLUMNS: AttributeEditorColumn[] = [
    { key: 'name', label: 'Name', placeholder: 'X-Header-Name' },
    { key: 'value', label: 'Value', placeholder: 'value' }
  ]
  const newHeader = () => ({ name: '', value: '' })
  const headerErrors = computed(() =>
    errors.headers ? form.headers.map((header) => headerProblem(header)) : []
  )
</script>

<template>
  <SettingsGroup
    label="Destination"
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
          <template #actions>
            <Button
              type="button"
              label="Send test record"
              variant="secondary"
              size="medium"
              :loading="saving"
              @click="save"
            />
          </template>
        </Alert>
      </div>
    </Transition>
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="connector"
              title="Connector"
              description="Each platform asks for different values."
            >
              <Select
                v-model="form.connector"
                size="large"
                class="w-full"
                :display-value="connectorLabel"
                :readonly="saving"
                @update:model-value="onDestinationChange('connector')"
              >
                <Select.Trigger
                  id="data-stream-connector"
                  aria-label="Connector"
                />
                <Select.Content>
                  <Select.Item
                    v-for="option in connectorOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <DataStreamInputRow
              v-if="form.connector === 'standard'"
              key="url"
              field="url"
              title="URL"
              description="The URL that receives the records."
              label="URL"
              placeholder="https://collector.example.com/ingest"
              stackable
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 'standard'"
              key="payloadFormat"
              field="payloadFormat"
              title="Payload format"
              description="The format each payload is sent in. $dataset is replaced by the records, joined by the log line separator."
              label="Payload format"
              placeholder="$dataset"
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 'standard'"
              key="lineSeparator"
              field="lineSeparator"
              title="Log line separator"
              description="Written at the end of each record. \n puts one record per line, in NDJSON format."
              label="Log line separator"
              placeholder="\n"
              destination
            />
            <SettingsRow
              v-if="form.connector === 'standard'"
              key="headers"
              title="Custom headers"
              description="Sent with every request, up to 5. A credential such as Authorization or an API key stays masked."
              variant="stacked"
            >
              <AttributeEditor
                id="data-stream-headers"
                v-model:items="form.headers"
                :definition="HEADER_COLUMNS"
                :new-item="newHeader"
                :limit="5"
                :disabled="saving"
                add-button-label="Add header"
                remove-button-label="Remove header"
                aria-label="Custom headers"
                :errors="headerErrors"
                @update:items="onDestinationChange('headers')"
              >
                <template #cell-value="{ item, value, update, invalid }">
                  <PasswordInput
                    v-if="isCredentialHeader(item.name)"
                    :model-value="value"
                    autocomplete="off"
                    monospace
                    :readonly="saving"
                    :invalid="invalid"
                    @update:model-value="update"
                  />
                  <Input
                    v-else
                    :model-value="value"
                    autocomplete="off"
                    :spellcheck="false"
                    :readonly="saving"
                    :invalid="invalid"
                    @update:model-value="update"
                  />
                </template>
              </AttributeEditor>
            </SettingsRow>
            <SettingsRow
              v-if="form.connector === 'kafka'"
              key="bootstrapServers"
              title="Bootstrap servers"
              description="The hosts and ports of the Kafka cluster, separated by a comma and no space."
              variant="stacked"
            >
              <div class="flex w-full">
                <Textarea
                  id="data-stream-bootstrapServers"
                  v-model="form.bootstrapServers"
                  class="w-full"
                  :rows="2"
                  aria-label="Bootstrap servers"
                  placeholder="host1:9092,host2:9092"
                  required
                  :invalid="!!errors.bootstrapServers"
                  :aria-describedby="
                    errors.bootstrapServers ? 'data-stream-bootstrapServers-message' : undefined
                  "
                  :readonly="saving"
                  @update:model-value="onDestinationChange('bootstrapServers')"
                />
              </div>
              <FieldError
                v-if="errors.bootstrapServers"
                id="data-stream-bootstrapServers-message"
                >{{ errors.bootstrapServers.message }}</FieldError
              >
            </SettingsRow>
            <DataStreamInputRow
              v-if="form.connector === 'kafka'"
              key="topic"
              field="topic"
              title="Topic"
              description="The Kafka topic the records are written to."
              label="Topic"
              placeholder="edge-records"
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 's3'"
              key="bucket"
              field="bucket"
              title="Bucket"
              description="The bucket the record files are written to."
              label="Bucket"
              placeholder="my-records-bucket"
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 's3'"
              key="region"
              field="region"
              title="Region"
              description="The region of the bucket, as the storage provider names it."
              label="Region"
              placeholder="us-east-1"
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 's3'"
              key="accessKey"
              field="accessKey"
              title="Access key"
              description="The access key of a user allowed to write to the bucket."
              label="Access key"
              placeholder="AKIAEXAMPLE"
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 's3'"
              key="secretKey"
              field="secretKey"
              title="Secret key"
              description="The secret key paired with the access key. It cannot be read back after saving."
              label="Secret key"
              placeholder="Enter the secret key"
              secret
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 'analytics'"
              key="analyticsUrl"
              field="analyticsUrl"
              title="Intake URL"
              description="The intake URL of your log analytics account."
              label="Intake URL"
              placeholder="https://logs.example.com/api/v2/logs"
              stackable
              destination
            />
            <DataStreamInputRow
              v-if="form.connector === 'analytics'"
              key="apiKey"
              field="apiKey"
              title="API key"
              description="An API key of your log analytics account. It cannot be read back after saving."
              label="API key"
              placeholder="Enter the API key"
              secret
              destination
            />
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
