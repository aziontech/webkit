<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import FieldDescription from '@aziontech/ui/field-description'
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import MultiSelect from '@aziontech/ui/multi-select'
  import RadioGroup from '@aziontech/ui/radio-group'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'
  import { computed, ref } from 'vue'

  import { sampleMtlsModes as mtlsModes, sampleRevocationLists as revocationLists } from '../sample'
  import { useProtocolsSettingsContext } from '../use-protocols-settings'

  const emit = defineEmits<{
    upload: []
  }>()

  const { form, saving, errors, armed, trustedCas, pickCa: choose } = useProtocolsSettingsContext()

  const caLabel = (value: string) =>
    trustedCas.value.find((option) => option.value === value)?.label ?? String(value)
  const listLabel = (values: unknown[] | undefined) => (values ?? []).join(', ')

  const caQuery = ref('')
  const caMatches = computed(() => {
    const needle = caQuery.value.trim().toLowerCase()
    return needle
      ? trustedCas.value.filter((option) => option.label.includes(needle))
      : trustedCas.value
  })
  const pickCa = (value: string) => {
    if (value === '__upload__') {
      emit('upload')
      return
    }
    choose(value)
  }
</script>

<template>
  <SettingsGroup
    label="Mutual authentication"
    hint="Ask each client for a certificate the workload can verify, as well as presenting its own."
    anchor="mutual-authentication"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
            <SettingsRow
              key="mtls"
              title="Mutual authentication"
              description="Clients without a valid certificate are refused or flagged, depending on the mode."
              variant="compact"
            >
              <Switch
                v-model="form.mtls"
                aria-label="Mutual authentication"
                :readonly="saving"
                :disabled="!form.useHttps"
              />
              <FieldDescription v-if="!form.useHttps"
                >Turn on HTTPS support to use mutual authentication.</FieldDescription
              >
            </SettingsRow>
            <SettingsRow
              v-if="armed"
              key="mtlsMode"
              title="Mode"
              description="What happens when a client certificate cannot be verified."
              variant="stacked"
              :depth="1"
            >
              <RadioGroup
                v-model="form.mtlsMode"
                variant="card"
                name="protocols-mtls-mode"
                aria-label="Mutual authentication mode"
                :readonly="saving"
              >
                <RadioGroup.Item
                  v-for="option in mtlsModes"
                  :key="option.value"
                  :value="option.value"
                  :description="option.description"
                  >{{ option.label }}</RadioGroup.Item
                >
              </RadioGroup>
            </SettingsRow>
            <SettingsRow
              v-if="armed"
              key="trustedCa"
              title="Trusted CA certificate"
              description="The authority client certificates are verified against."
              :depth="1"
            >
              <Select
                :model-value="form.trustedCa"
                size="large"
                class="w-full"
                placeholder="Select a trusted CA certificate"
                :display-value="caLabel"
                :readonly="saving"
                required
                :invalid="errors.trustedCa?.type === 'required'"
                @update:model-value="pickCa"
                @update:open="(open) => !open && (caQuery = '')"
              >
                <Select.Trigger
                  id="protocols-trustedCa"
                  aria-label="Trusted CA certificate"
                  :aria-describedby="errors.trustedCa ? 'protocols-trustedCa-message' : undefined"
                />
                <Select.Content>
                  <template #search>
                    <Input
                      v-model="caQuery"
                      size="small"
                      placeholder="Search certificates"
                      aria-label="Search certificates"
                    >
                      <template #leading>
                        <i
                          class="az az-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </template>
                  <Select.Group label="Trusted CA certificates">
                    <Select.Item
                      v-for="option in caMatches"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                      <template #tag>
                        <span class="text-body-xs text-(--text-muted)">{{ option.expires }}</span>
                      </template>
                    </Select.Item>
                    <p
                      v-if="!caMatches.length"
                      class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
                    >
                      No certificate matches "{{ caQuery }}".
                    </p>
                  </Select.Group>
                  <template #footer>
                    <Select.Item
                      value="__upload__"
                      class="w-full"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">
                        <i
                          class="az az-upload"
                          aria-hidden="true"
                        />
                        Upload certificate
                      </span>
                    </Select.Item>
                  </template>
                </Select.Content>
              </Select>
              <FieldError
                v-if="errors.trustedCa"
                id="protocols-trustedCa-message"
                >{{ errors.trustedCa.message }}</FieldError
              >
            </SettingsRow>
            <SettingsRow
              v-if="armed"
              key="crl"
              title="Certificate revocation lists"
              description="Certificates on these lists are refused during the handshake."
              :depth="1"
            >
              <MultiSelect
                v-model="form.crl"
                size="large"
                class="w-full"
                placeholder="No revocation list"
                :display-value="listLabel"
                :readonly="saving"
              >
                <MultiSelect.Trigger
                  id="protocols-crl"
                  aria-label="Certificate revocation lists"
                />
                <MultiSelect.Content>
                  <MultiSelect.Item
                    v-for="option in revocationLists"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </MultiSelect.Item>
                </MultiSelect.Content>
              </MultiSelect>
            </SettingsRow>
          </TransitionGroup>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
