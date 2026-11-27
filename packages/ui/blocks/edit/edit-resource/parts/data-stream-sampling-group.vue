<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Item from '@aziontech/ui/item'
  import NumberInput from '@aziontech/ui/number-input'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'

  import { useDataStreamContext } from '../use-data-stream'

  const { form, errors, saving, clear } = useDataStreamContext()
</script>

<template>
  <SettingsGroup
    v-if="form.scope === 'all'"
    label="Sampling"
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
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="sampling"
              title="Sampling"
              description="Collect a share of the records instead of all of them, to save resources."
              variant="compact"
            >
              <Switch
                v-model="form.sampling"
                aria-label="Sampling"
                :readonly="saving"
              />
            </SettingsRow>
            <SettingsRow
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
                :readonly="saving"
                @update:model-value="clear('samplingRate')"
              >
                <template #trailing>%</template>
              </NumberInput>
              <FieldError
                v-if="errors.samplingRate"
                id="data-stream-samplingRate-message"
                >{{ errors.samplingRate.message }}</FieldError
              >
            </SettingsRow>
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
