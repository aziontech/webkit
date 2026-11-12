<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref } from 'vue'

  interface FormErrors {
    capacity?: string
    title?: string
  }

  const SESSION_OPTIONS = [
    { value: '5', label: '5 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' }
  ]

  const saved = ref({ enabled: true, capacity: '400', title: 'You are in line', session: '15' })
  const form = reactive({ ...saved.value })
  const dirty = computed(() => JSON.stringify(form) !== JSON.stringify(saved.value))
  const submitted = ref(false)
  const saving = ref(false)
  const formEl = ref<HTMLElement | null>(null)

  const errors = computed((): FormErrors => {
    if (!submitted.value) return {}
    const out: FormErrors = {}
    const capacity = Number(form.capacity)
    if (!form.capacity.trim()) out.capacity = 'Enter the requests per second to let in.'
    else if (!Number.isInteger(capacity) || capacity < 1)
      out.capacity = 'Enter a whole number of 1 or more.'
    if (!form.title.trim()) out.title = 'Enter the title visitors see while they wait.'
    return out
  })

  const discard = () => {
    Object.assign(form, saved.value)
    submitted.value = false
  }

  const save = () => {
    submitted.value = true
    if (saving.value) return
    if (Object.keys(errors.value).length) {
      nextTick(() => formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    saving.value = true
    setTimeout(() => {
      saved.value = { ...form }
      saving.value = false
      submitted.value = false
      toast.success('Waiting Room settings saved.', {
        description: form.enabled
          ? `storefront queues visitors above ${form.capacity} requests per second.`
          : 'The queue is off; every visitor goes straight in.'
      })
    }, 800)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <nav
        aria-label="Breadcrumb"
        class="pt-(--layout-group-gap)"
      >
        <Link
          href="/marketplace/waiting-room"
          label="Back to Waiting Room"
          size="medium"
          :show-icon="false"
        />
      </nav>
      <PageHeader
        title="Configure Waiting Room"
        description="Settings of Waiting Room 1.4.0 on storefront. They apply from the next request."
      />

      <form
        ref="formEl"
        class="layout-section-start flex min-w-0 flex-col pb-(--layout-boundary-end)"
        novalidate
        aria-label="Waiting Room settings"
        @submit.prevent="save"
      >
        <Alert
          v-if="Object.keys(errors).length"
          severity="danger"
          label="Some settings need a fix before they can be saved."
        />

        <SettingsSection
          title="Queue"
          hint="When the queue starts and what visitors see while they wait."
        >
          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
            <Item.List>
              <SettingRow
                title="Queue visitors"
                description="Off lets every visitor in and keeps the settings below."
                kind="compact"
              >
                <Switch
                  v-model="form.enabled"
                  aria-label="Queue visitors"
                  :disabled="saving"
                />
              </SettingRow>
            </Item.List>
            <Field
              required
              :invalid="Boolean(errors.capacity)"
              :disabled="saving || !form.enabled"
            >
              <Field.Label>Capacity</Field.Label>
              <Input
                v-model="form.capacity"
                size="large"
                inputmode="numeric"
                autocomplete="off"
              />
              <Field.Error v-if="errors.capacity">{{ errors.capacity }}</Field.Error>
              <Field.Description v-else
                >Requests per second let through. Above it, new visitors wait in
                line.</Field.Description
              >
            </Field>
            <Field
              required
              :invalid="Boolean(errors.title)"
              :disabled="saving || !form.enabled"
            >
              <Field.Label>Queue page title</Field.Label>
              <Input
                v-model="form.title"
                size="large"
                autocomplete="off"
              />
              <Field.Error v-if="errors.title">{{ errors.title }}</Field.Error>
            </Field>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Sessions"
          hint="How long a visitor who got in keeps their place."
        >
          <Field :disabled="saving || !form.enabled">
            <Field.Label>Session length</Field.Label>
            <Select
              v-model="form.session"
              size="large"
            >
              <Select.Trigger class="w-full" />
              <Select.Content>
                <Select.Option
                  v-for="option in SESSION_OPTIONS"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.label }}</Select.Option
                >
              </Select.Content>
            </Select>
            <Field.Description
              >Shorter sessions free places sooner when visitors leave.</Field.Description
            >
          </Field>
        </SettingsSection>
      </form>

      <SaveBar v-if="dirty">
        Waiting Room settings changed, not saved yet.
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
            type="button"
            label="Save"
            kind="primary"
            size="medium"
            :loading="saving"
            @click="save"
          />
        </template>
      </SaveBar>
    </div>
  </div>
</template>
