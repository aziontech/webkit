<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import HelperText, { type HelperTextKind } from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, reactive, ref } from 'vue'

  type FieldProblem = { kind: HelperTextKind; message: string }

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

  const form = reactive(structuredClone(record))
  const saving = ref(false)
  const baseline = ref(JSON.stringify(record))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)

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
    if (!name) errors.name = { kind: 'required', message: 'This field is required.' }
    else if (name.length > 250)
      errors.name = { kind: 'invalid', message: 'Use at most 250 characters.' }
    if (!items) errors.items = { kind: 'required', message: 'This field is required.' }
    else if (form.type === 'countries' && !COUNTRY_PATTERN.test(items))
      errors.items = {
        kind: 'invalid',
        message: 'Enter one two-letter country code per line. Example: BR.'
      }
    else if (form.type !== 'countries' && !LIST_PATTERN.test(items))
      errors.items = {
        kind: 'invalid',
        message: 'Remove the empty lines. Every line holds one entry.'
      }
    return Object.keys(errors).length === 0
  }

  const save = () => {
    if (!validate()) return
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
    }, 900)
  }

  const discard = () => Object.assign(form, JSON.parse(baseline.value) as typeof form)
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

        <SettingsSection
          title="General"
          hint="Build allowlists, blocklists and greylists from IP addresses, countries or ASNs, and use them in policy rules."
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
                    description="Give a unique and descriptive name to identify the access list."
                  >
                    <Input
                      v-model="form.name"
                      size="large"
                      class="w-full"
                      aria-label="Name"
                      placeholder="office-ranges"
                      autocomplete="off"
                      :required="errors.name?.kind === 'required'"
                      :invalid="errors.name?.kind === 'invalid'"
                      :aria-describedby="errors.name ? 'access-lists-name-message' : undefined"
                      :disabled="saving"
                      @update:model-value="clear('name')"
                    />
                    <HelperText
                      v-if="errors.name"
                      id="access-lists-name-message"
                      :kind="errors.name.kind"
                      :label="errors.name.message"
                    />
                  </SettingRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsSection>

        <SettingsSection
          title="List settings"
          hint="The kind of entry the list holds, and the entries themselves. The type cannot be changed after the list is created, because every entry is validated against it."
          anchor="list-settings"
        >
          <Card :padded="false">
            <template #content>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <SettingRow
                    key="type"
                    title="Type"
                    kind="stacked"
                  >
                    <fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
                      <legend class="sr-only">Type</legend>
                      <Field.Label
                        v-for="option in typeOptions"
                        :key="option.value"
                      >
                        <Field
                          orientation="horizontal"
                          :disabled="saving"
                        >
                          <RadioButton
                            v-model="form.type"
                            :value="option.value"
                            name="access-lists-type"
                          />
                          <Field.Content>
                            <Field.Title>{{ option.label }}</Field.Title>
                            <Field.Description v-if="option.description">{{
                              option.description
                            }}</Field.Description>
                          </Field.Content>
                        </Field>
                      </Field.Label>
                    </fieldset>
                  </SettingRow>
                  <SettingRow
                    v-if="form.type === 'asn'"
                    key="items-asn"
                    title="List"
                    description="One ASN per line, such as 13335. Public ASNs run from 1 to 64511, private ones from 64512 to 65535. Duplicate entries are removed."
                    kind="stacked"
                  >
                    <Textarea
                      v-model="form.items"
                      class="w-full"
                      :rows="5"
                      aria-label="List"
                      placeholder="13335&#10;53331"
                      :required="errors.items?.kind === 'required'"
                      :invalid="errors.items?.kind === 'invalid'"
                      :aria-describedby="errors.items ? 'access-lists-items-message' : undefined"
                      :disabled="saving"
                      @update:model-value="clear('items')"
                    />
                    <HelperText
                      v-if="errors.items"
                      id="access-lists-items-message"
                      :kind="errors.items.kind"
                      :label="errors.items.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-else-if="form.type === 'ip_cidr'"
                    key="items-ip-cidr"
                    title="List"
                    description="One address or range per line. Add a comment after #, and a date with --LT. Duplicate entries are removed."
                    kind="stacked"
                  >
                    <Textarea
                      v-model="form.items"
                      class="w-full"
                      :rows="5"
                      aria-label="List"
                      placeholder="192.0.2.10&#10;198.51.100.24&#10;203.0.113.7 #comment"
                      :required="errors.items?.kind === 'required'"
                      :invalid="errors.items?.kind === 'invalid'"
                      :aria-describedby="errors.items ? 'access-lists-items-message' : undefined"
                      :disabled="saving"
                      @update:model-value="clear('items')"
                    />
                    <HelperText
                      v-if="errors.items"
                      id="access-lists-items-message"
                      :kind="errors.items.kind"
                      :label="errors.items.message"
                    />
                  </SettingRow>
                  <SettingRow
                    v-else
                    key="items-countries"
                    title="Countries"
                    description="One or more countries, one two-letter ISO 3166-1 code per line, such as BR."
                    kind="stacked"
                  >
                    <Textarea
                      v-model="form.items"
                      class="w-full"
                      :rows="5"
                      aria-label="Countries"
                      placeholder="BR&#10;US"
                      :required="errors.items?.kind === 'required'"
                      :invalid="errors.items?.kind === 'invalid'"
                      :aria-describedby="errors.items ? 'access-lists-items-message' : undefined"
                      :disabled="saving"
                      @update:model-value="clear('items')"
                    />
                    <HelperText
                      v-if="errors.items"
                      id="access-lists-items-message"
                      :kind="errors.items.kind"
                      :label="errors.items.message"
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
        You have unsaved changes.

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
