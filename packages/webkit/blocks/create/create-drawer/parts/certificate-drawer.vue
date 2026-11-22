<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import { useDrawerGuard } from '../composables/use-drawer-guard'
  import { parseCertificates } from '../lib/pem-certificate'
  import { sampleCertificatePem } from '../sample'
  import FormDrawer from './form-drawer.vue'
  import SubmitButton from './submit-button.vue'
  import UnsavedChangesDialog from './unsaved-changes-dialog.vue'

  interface CertificateForm {
    name: string
    kind: string
    certificate: string
    privateKey: string
  }

  type FormErrors = Partial<Record<'name' | 'certificate' | 'privateKey', string>>

  interface Expiry {
    severity: StatusIndicatorSeverity
    label: string
    message: string
  }

  const KINDS: ToggleGroupOption[] = [
    { label: 'Server certificate', value: 'server' },
    { label: 'Trusted CA', value: 'ca' }
  ]
  const KIND_HINTS: Record<string, string> = {
    server:
      'The certificate your domains present, with the private key that signed it. Intermediate certificates go after it in the same field.',
    ca: 'A certificate authority whose client certificates your services accept for mutual TLS.'
  }
  const DAY = 86_400_000
  const RENEW_WITHIN_DAYS = 30

  const { formatDate: formatLocaleDate } = useLocale()

  const formatDate = (date: Date) =>
    formatLocaleDate(date, { dateStyle: 'medium', timeZone: 'UTC' })

  const blankForm = (): CertificateForm => ({
    name: '',
    kind: 'server',
    certificate: '',
    privateKey: ''
  })
  const open = ref(false)
  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = ref(false)
  const certificatePicker = useFilePicker({ accept: '.pem,.crt,.cer,application/x-pem-file' })
  const uploadStatus = ref('')
  const NOW = Date.UTC(2026, 10, 10, 12)

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(form, blankForm(), {
      name: 'shop.example.com',
      certificate: sampleCertificatePem
    })
    submitted.value = false
    uploadStatus.value = ''
    nextTick(() => guard.commit())
  })

  const parsed = computed(() => parseCertificates(form.certificate))
  const daysLeft = computed(() =>
    parsed.value?.notAfter ? Math.floor((parsed.value.notAfter.getTime() - NOW) / DAY) : null
  )
  const expiry = computed((): Expiry | null => {
    const notAfter = parsed.value?.notAfter
    if (daysLeft.value === null || !notAfter) return null
    if (daysLeft.value < 0) {
      return {
        severity: 'danger',
        label: 'Expired',
        message: `This certificate expired on ${formatDate(notAfter)}. Paste a current one.`
      }
    }
    if (daysLeft.value <= RENEW_WITHIN_DAYS) {
      return {
        severity: 'warning',
        label: `Expires in ${daysLeft.value} ${daysLeft.value === 1 ? 'day' : 'days'}`,
        message: 'It can be saved, but renew it before it expires or the domains stop serving TLS.'
      }
    }
    return {
      severity: 'success',
      label: `Valid for ${daysLeft.value} more days`,
      message: ''
    }
  })

  const errors = computed((): FormErrors => {
    if (!submitted.value) return {}
    const list: FormErrors = {}
    if (!form.name.trim()) list.name = 'Name is required.'
    if (!form.certificate.trim()) list.certificate = 'Paste or upload the certificate.'
    else if (!parsed.value || parsed.value.invalid)
      list.certificate =
        'This is not a PEM certificate. It starts with -----BEGIN CERTIFICATE----- and ends with -----END CERTIFICATE-----.'
    else if (expiry.value?.severity === 'danger') list.certificate = expiry.value.message
    if (form.kind === 'server') {
      if (!form.privateKey.trim())
        list.privateKey = 'Paste the private key that signed the certificate.'
      else if (!/-----BEGIN (EC |RSA )?PRIVATE KEY-----/.test(form.privateKey))
        list.privateKey =
          'This is not a PEM private key. It starts with -----BEGIN PRIVATE KEY-----.'
    }
    return list
  })

  const pickCertificate = async () => {
    const [file] = await certificatePicker.open()
    if (!file) return
    form.certificate = await file.text()
    uploadStatus.value = parsed.value?.subject
      ? `${file.name} loaded: ${parsed.value.subject}.`
      : `${file.name} loaded.`
  }

  const submit = async (event: Event) => {
    if (submitting.value) return
    submitted.value = true
    const certificate = parsed.value
    if (Object.keys(errors.value).length || !certificate || certificate.invalid) {
      await nextTick()
      const formEl = event.target instanceof HTMLFormElement ? event.target : null
      formEl?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    submitting.value = true
    await new Promise<void>((resolve) => setTimeout(resolve, 900))
    submitting.value = false
    open.value = false
    toast.success(`${form.name.trim()} created.`, {
      description: `Valid until ${formatDate(certificate.notAfter)}. Bind it to a workload to serve it.`
    })
  }

  const { guard, onOpenChange } = useDrawerGuard({
    open,
    busy: () => submitting.value,
    source: () => form,
    onDiscard: (baseline) => Object.assign(form, baseline)
  })
</script>

<template>
  <FormDrawer
    :open="open"
    title="Create Certificate"
    description="Import a TLS certificate to serve your domains or to verify client certificates."
    submit-label="Save"
    shortcut-label="Save certificate"
    :busy="submitting"
    @update:open="onOpenChange"
    @submit="submit"
  >
    <template #trigger>
      <DrawerTrigger>
        <div class="w-full md:w-fit">
          <Button
            label="Create Certificate"
            icon="az az-plus"
            variant="primary"
            size="large"
            class="w-full"
          />
        </div>
      </DrawerTrigger>
    </template>

    <SettingsGroup
      label="General"
      hint="Names the certificate where domains and workloads pick it."
    >
      <Field
        required
        :invalid="Boolean(errors.name)"
      >
        <Field.Label>Name</Field.Label>
        <Input
          v-model="form.name"
          size="large"
          placeholder="shop.example.com"
          autocomplete="off"
        />
        <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
      </Field>
    </SettingsGroup>

    <SettingsGroup
      label="Certificate"
      :hint="KIND_HINTS[form.kind]"
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <ToggleGroup
          v-model="form.kind"
          :options="KINDS"
          aria-label="Certificate type"
          size="medium"
        />

        <Field
          required
          :invalid="Boolean(errors.certificate)"
        >
          <div class="flex min-w-0 flex-wrap items-center justify-between gap-(--spacing-xs)">
            <Field.Label>Certificate (PEM)</Field.Label>
            <Button
              type="button"
              label="Upload file"
              icon="az az-upload"
              variant="outline"
              size="small"
              @click="pickCertificate"
            />
          </div>
          <div class="[&_textarea]:font-code [&_textarea]:text-body-sm">
            <Textarea
              v-model="form.certificate"
              :rows="8"
              spellcheck="false"
              placeholder="-----BEGIN CERTIFICATE-----"
            />
          </div>
          <Field.Description
            >Paste the certificate, or upload a .pem, .crt or .cer file.</Field.Description
          >
          <Field.Error v-if="errors.certificate">{{ errors.certificate }}</Field.Error>
        </Field>
        <p
          class="sr-only"
          role="status"
          aria-live="polite"
        >
          {{ uploadStatus }}
        </p>

        <section
          v-if="parsed && !parsed.invalid"
          class="flex min-w-0 flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
          aria-label="Certificate details"
          data-testid="certificate-details"
        >
          <KeyValueList
            :columns="2"
            aria-label="Certificate details"
          >
            <KeyValueList.Item label="Issued to">{{
              parsed.subject || 'No common name'
            }}</KeyValueList.Item>
            <KeyValueList.Item label="Issued by">{{
              parsed.issuer || 'No common name'
            }}</KeyValueList.Item>
            <KeyValueList.Item label="Valid from">{{
              formatDate(parsed.notBefore)
            }}</KeyValueList.Item>
            <KeyValueList.Item label="Expires">
              <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <span>{{ formatDate(parsed.notAfter) }}</span>
                <StatusIndicator
                  :severity="expiry?.severity"
                  :label="expiry?.label"
                />
              </span>
            </KeyValueList.Item>
          </KeyValueList>
          <p
            v-if="parsed.chain > 1"
            class="m-0 text-body-sm text-(--text-muted)"
          >
            {{ parsed.chain - 1 }} intermediate
            {{ parsed.chain === 2 ? 'certificate' : 'certificates' }} follow it.
          </p>
          <p
            v-if="expiry?.message && expiry.severity === 'warning'"
            class="m-0 text-body-sm text-(--text-default)"
          >
            {{ expiry.message }}
          </p>
        </section>

        <Field
          v-if="form.kind === 'server'"
          required
          :invalid="Boolean(errors.privateKey)"
        >
          <Field.Label>Private key (PEM)</Field.Label>
          <div class="[&_textarea]:font-code [&_textarea]:text-body-sm">
            <Textarea
              v-model="form.privateKey"
              :rows="6"
              spellcheck="false"
              autocomplete="off"
              placeholder="-----BEGIN PRIVATE KEY-----"
            />
          </div>
          <Field.Description
            >Stored encrypted and never shown again; paste a new key to replace
            it.</Field.Description
          >
          <Field.Error v-if="errors.privateKey">{{ errors.privateKey }}</Field.Error>
        </Field>
      </div>
    </SettingsGroup>
    <template #footer>
      <div class="flex w-full justify-end">
        <SubmitButton :loading="submitting">Save</SubmitButton>
      </div>
    </template>
  </FormDrawer>

  <UnsavedChangesDialog
    :guard="guard"
    data-testid="unsaved-changes-dialog"
  />
</template>
