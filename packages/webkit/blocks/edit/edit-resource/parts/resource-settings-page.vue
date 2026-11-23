<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive } from 'vue'

  import { useSettingsDraft } from '../use-settings-draft'
  import SettingsSaveBar from './settings-save-bar.vue'

  type FieldProblem = { type: 'helper' | 'invalid' | 'required'; message: string }

  const typeOptions = [
    {
      value: 'asn',
      label: 'ASN',
      description: 'Identify networks by Autonomous System Number. Suited to grouping traffic.'
    },
    {
      value: 'ip_cidr',
      label: 'IP/CIDR',
      description:
        'Specific IP addresses or ranges in CIDR notation, for precise traffic segmentation.'
    },
    {
      value: 'countries',
      label: 'Countries',
      description: 'Group traffic by country, for location-based rules.'
    }
  ]

  const record = {
    name: 'office-ranges',
    type: 'ip_cidr',
    items: '192.0.2.10\n198.51.100.24\n203.0.113.7 #comment'
  }

  const errors = reactive<Record<string, FieldProblem | undefined>>({})

  const LIST_PATTERN = /^[^\n]*\S[^\n]*(\n[^\n]*\S[^\n]*)*$/
  const COUNTRY_PATTERN = /^[^\S\n]*[A-Za-z]{2}[^\S\n]*(\n[^\S\n]*[A-Za-z]{2}[^\S\n]*)*$/

  const clear = (id: string) => {
    if (errors[id]) delete errors[id]
  }

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    const name = form.name.trim()
    const items = form.items.trim()
    if (!name) errors.name = { type: 'required', message: 'This field is required.' }
    else if (name.length > 250)
      errors.name = { type: 'invalid', message: 'Use at most 250 characters.' }
    if (!items) errors.items = { type: 'required', message: 'This field is required.' }
    else if (form.type === 'countries' && !COUNTRY_PATTERN.test(items))
      errors.items = {
        type: 'invalid',
        message: 'Enter one two-letter country code per line. Example: BR.'
      }
    else if (form.type !== 'countries' && !LIST_PATTERN.test(items))
      errors.items = {
        type: 'invalid',
        message: 'Remove the empty lines. Every line holds one entry.'
      }
    return Object.keys(errors).length === 0
  }

  const { form, saving, dirty, save, discard, leave } = useSettingsDraft(record, { validate })
</script>

<template>
  <form
    class="flex min-h-0 min-w-0 flex-1 flex-col"
    aria-label="access list settings"
    novalidate
    @submit.prevent="save"
  >
    <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
      <PageHeader
        title="Settings"
        description="Group networks once and reference them from policy rules, instead of restating a range per rule."
        size="small"
      />

      <fieldset
        class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="saving"
      >
        <legend class="sr-only">access list settings</legend>

        <SettingsGroup
          label="General"
          hint="Build allowlists, blocklists and greylists from IP addresses, countries or ASNs, and use them in policy rules."
          anchor="general"
        >
          <Card :padded="false">
            <template #default>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <SettingsRow
                    key="name"
                    title="Name"
                    description="Give a unique and descriptive name to identify the access list."
                  >
                    <Input
                      v-model="form.name"
                      size="large"
                      class="w-full"
                      aria-label="Name"
                      placeholder="office-ranges"
                      autocomplete="off"
                      required
                      :invalid="!!errors.name"
                      :aria-describedby="errors.name ? 'access-lists-name-message' : undefined"
                      :disabled="saving"
                      @update:model-value="clear('name')"
                    />
                    <FieldError
                      v-if="errors.name"
                      id="access-lists-name-message"
                      >{{ errors.name.message }}</FieldError
                    >
                  </SettingsRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsGroup>

        <SettingsGroup
          label="List settings"
          hint="The kind of entry the list holds, and the entries themselves. The type cannot be changed after the list is created, because every entry is validated against it."
          anchor="list-settings"
        >
          <Card :padded="false">
            <template #default>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <SettingsRow
                    key="type"
                    title="Type"
                    variant="stacked"
                  >
                    <RadioGroup
                      v-model="form.type"
                      variant="card"
                      name="access-lists-type"
                      aria-label="Type"
                      :disabled="saving"
                    >
                      <RadioGroup.Item
                        v-for="option in typeOptions"
                        :key="option.value"
                        :value="option.value"
                        :description="option.description"
                        >{{ option.label }}</RadioGroup.Item
                      >
                    </RadioGroup>
                  </SettingsRow>
                  <SettingsRow
                    v-if="form.type === 'asn'"
                    key="items-asn"
                    title="List"
                    description="One ASN per line, such as 13335. Public ASNs run from 1 to 64511, private ones from 64512 to 65535. Duplicate entries are removed."
                    variant="stacked"
                  >
                    <Textarea
                      v-model="form.items"
                      class="w-full"
                      :rows="5"
                      aria-label="List"
                      placeholder="13335&#10;53331"
                      required
                      :invalid="!!errors.items"
                      :aria-describedby="errors.items ? 'access-lists-items-message' : undefined"
                      :disabled="saving"
                      @update:model-value="clear('items')"
                    />
                    <FieldError
                      v-if="errors.items"
                      id="access-lists-items-message"
                      >{{ errors.items.message }}</FieldError
                    >
                  </SettingsRow>
                  <SettingsRow
                    v-else-if="form.type === 'ip_cidr'"
                    key="items-ip-cidr"
                    title="List"
                    description="One address or range per line. Add a comment after #, and a date with --LT. Duplicate entries are removed."
                    variant="stacked"
                  >
                    <Textarea
                      v-model="form.items"
                      class="w-full"
                      :rows="5"
                      aria-label="List"
                      placeholder="192.0.2.10&#10;198.51.100.24&#10;203.0.113.7 #comment"
                      required
                      :invalid="!!errors.items"
                      :aria-describedby="errors.items ? 'access-lists-items-message' : undefined"
                      :disabled="saving"
                      @update:model-value="clear('items')"
                    />
                    <FieldError
                      v-if="errors.items"
                      id="access-lists-items-message"
                      >{{ errors.items.message }}</FieldError
                    >
                  </SettingsRow>
                  <SettingsRow
                    v-else
                    key="items-countries"
                    title="Countries"
                    description="One or more countries, one two-letter ISO 3166-1 code per line, such as BR."
                    variant="stacked"
                  >
                    <Textarea
                      v-model="form.items"
                      class="w-full"
                      :rows="5"
                      aria-label="Countries"
                      placeholder="BR&#10;US"
                      required
                      :invalid="!!errors.items"
                      :aria-describedby="errors.items ? 'access-lists-items-message' : undefined"
                      :disabled="saving"
                      @update:model-value="clear('items')"
                    />
                    <FieldError
                      v-if="errors.items"
                      id="access-lists-items-message"
                      >{{ errors.items.message }}</FieldError
                    >
                  </SettingsRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsGroup>
      </fieldset>
    </div>

    <SettingsSaveBar
      :visible="dirty || saving"
      :guard="leave"
      :saving="saving"
      @save="save"
      @discard="discard"
    >
      You have unsaved changes.
    </SettingsSaveBar>
  </form>
</template>
