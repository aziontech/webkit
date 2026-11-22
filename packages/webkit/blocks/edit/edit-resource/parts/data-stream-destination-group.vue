<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Textarea from '@aziontech/webkit/textarea'

  import { sampleDataStreamConnectors as connectorOptions } from '../sample'
  import { useDataStreamContext } from '../use-data-stream'
  import DataStreamInputRow from './data-stream-input-row.vue'

  const { form, errors, saving, destinationError, onDestinationChange, save } =
    useDataStreamContext()

  const labelOf = (options: SelectOptionItem[]) => (value: string) =>
    options.find((option) => option.value === value)?.label ?? ''
  const connectorLabel = labelOf(connectorOptions)
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
                :disabled="saving"
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
              description="Sent with every request. One per line, up to 5, in the Key:Value format."
              variant="stacked"
            >
              <div class="flex w-full font-code">
                <Textarea
                  id="data-stream-headers"
                  v-model="form.headers"
                  class="w-full"
                  :rows="3"
                  aria-label="Custom headers"
                  placeholder="header-name:value"
                  required
                  :invalid="!!errors.headers"
                  :aria-describedby="errors.headers ? 'data-stream-headers-message' : undefined"
                  :disabled="saving"
                  @update:model-value="onDestinationChange('headers')"
                />
              </div>
              <FieldError
                v-if="errors.headers"
                id="data-stream-headers-message"
                >{{ errors.headers.message }}</FieldError
              >
            </SettingsRow>
            <SettingsRow
              v-if="form.connector === 'kafka'"
              key="bootstrapServers"
              title="Bootstrap servers"
              description="The hosts and ports of the Kafka cluster, separated by a comma and no space."
              variant="stacked"
            >
              <div class="flex w-full font-code">
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
                  :disabled="saving"
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
