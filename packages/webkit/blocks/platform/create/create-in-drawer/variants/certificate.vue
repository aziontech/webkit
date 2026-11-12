<script setup>
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  const KINDS = [
    { label: 'Server certificate', value: 'server' },
    { label: 'Trusted CA', value: 'ca' }
  ]
  const KIND_HINTS = {
    server:
      'The certificate your domains present, with the private key that signed it. Intermediate certificates go after it in the same field.',
    ca: 'A certificate authority whose client certificates your services accept for mutual TLS.'
  }
  const SAMPLE_PEM = `-----BEGIN CERTIFICATE-----
MIIBvjCCAWSgAwIBAgIUNDoJDa2hJas+aUcp2sbyD9PhjPwwCgYIKoZIzj0EAwIw
LDEYMBYGA1UEAwwPRXhhbXBsZSBUZXN0IENBMRAwDgYDVQQKDAdFeGFtcGxlMB4X
DTI2MTExMTEzMjM1N1oXDTI4MTEzMDEzMjM1N1owGzEZMBcGA1UEAwwQc2hvcC5l
eGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABGnMo5VQJ8H/vKzM
hmnv1ir/DMkDuDahalIy7Bx8GO2D1Dx4fgA6wGYjDCt2XNNnH3WCXXJnrZfjypxs
G1wnUWmjdTBzMDEGA1UdEQQqMCiCEHNob3AuZXhhbXBsZS5jb22CFHd3dy5zaG9w
LmV4YW1wbGUuY29tMB0GA1UdDgQWBBS8Wr4FRmN3ph2hf3/rKTHR2fOU3TAfBgNV
HSMEGDAWgBTXOAjUcHzQoG4oJOPNrSvBx3vxPjAKBggqhkjOPQQDAgNIADBFAiB3
v7BjiqHLNSigs9mHSq+kIKiq1syEkbuiq3g9yuLAFwIhAMLeH4vwZC+ftGD+p6Z9
mr+L2DBwFXtW2qJfNedf/9rU
-----END CERTIFICATE-----`
  const DAY = 86_400_000
  const RENEW_WITHIN_DAYS = 30

  const readTlv = (bytes, offset) => {
    let length = bytes[offset + 1]
    let head = 2
    if (length & 0x80) {
      const size = length & 0x7f
      length = 0
      for (let i = 0; i < size; i += 1) length = length * 256 + bytes[offset + 2 + i]
      head += size
    }
    return { tag: bytes[offset], start: offset + head, end: offset + head + length }
  }
  const childrenOf = (bytes, node) => {
    const list = []
    for (let offset = node.start; offset < node.end;) {
      const child = readTlv(bytes, offset)
      if (child.end > node.end || child.end <= offset) throw new Error('malformed')
      list.push(child)
      offset = child.end
    }
    return list
  }
  const text = (bytes, node) => new TextDecoder().decode(bytes.slice(node.start, node.end))
  const commonName = (bytes, name) => {
    for (const set of childrenOf(bytes, name)) {
      for (const pair of childrenOf(bytes, set)) {
        const [oid, value] = childrenOf(bytes, pair)
        const id = Array.from(bytes.slice(oid.start, oid.end)).join('.')
        if (id === '85.4.3') return text(bytes, value)
      }
    }
    return ''
  }
  const time = (bytes, node) => {
    const raw = text(bytes, node)
    const full = node.tag === 0x17 ? `${Number(raw.slice(0, 2)) < 50 ? '20' : '19'}${raw}` : raw
    const [y, mo, d, h, mi, s] = [0, 4, 6, 8, 10, 12].map((at, i) =>
      Number(full.slice(at, i === 0 ? 4 : at + 2))
    )
    return new Date(Date.UTC(y, mo - 1, d, h, mi, s))
  }
  const PEM_BLOCK = /-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/g
  const parseCertificates = (pem) => {
    const blocks = [...pem.matchAll(PEM_BLOCK)]
    if (!blocks.length) return null
    try {
      const binary = atob(blocks[0][1].replace(/\s+/g, ''))
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
      const [tbs] = childrenOf(bytes, readTlv(bytes, 0))
      const fields = childrenOf(bytes, tbs)
      const at = fields[0].tag === 0xa0 ? 1 : 0
      const issuer = fields[at + 2]
      const [notBefore, notAfter] = childrenOf(bytes, fields[at + 3])
      const subject = fields[at + 4]
      return {
        subject: commonName(bytes, subject),
        issuer: commonName(bytes, issuer),
        notBefore: time(bytes, notBefore),
        notAfter: time(bytes, notAfter),
        chain: blocks.length
      }
    } catch {
      return { invalid: true }
    }
  }
  const formatDate = (date) =>
    new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(date)

  const blankForm = () => ({ name: '', kind: 'server', certificate: '', privateKey: '' })
  const open = ref(false)
  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = ref(false)
  const formEl = ref(null)
  const fileInput = ref(null)
  const uploadStatus = ref('')
  const NOW = Date.UTC(2026, 10, 10, 12)

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(form, blankForm(), { name: 'shop.example.com', certificate: SAMPLE_PEM })
    submitted.value = false
    uploadStatus.value = ''
  })

  const parsed = computed(() => parseCertificates(form.certificate))
  const daysLeft = computed(() =>
    parsed.value?.notAfter ? Math.floor((parsed.value.notAfter.getTime() - NOW) / DAY) : null
  )
  const expiry = computed(() => {
    if (daysLeft.value === null) return null
    if (daysLeft.value < 0) {
      return {
        severity: 'danger',
        label: 'Expired',
        message: `This certificate expired on ${formatDate(parsed.value.notAfter)}. Paste a current one.`
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

  const errors = computed(() => {
    if (!submitted.value) return {}
    const list = {}
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

  const onFilePicked = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    form.certificate = await file.text()
    uploadStatus.value = parsed.value?.subject
      ? `${file.name} loaded: ${parsed.value.subject}.`
      : `${file.name} loaded.`
  }

  const submit = async () => {
    if (submitting.value) return
    submitted.value = true
    if (Object.keys(errors.value).length) {
      await nextTick()
      formEl.value?.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 900))
    submitting.value = false
    open.value = false
    toast.success(`${form.name.trim()} created.`, {
      description: `Valid until ${formatDate(parsed.value.notAfter)}. Bind it to a workload to serve it.`
    })
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="right"
  >
    <DrawerTrigger>
      <div class="w-full md:w-fit">
        <Button
          label="Create Certificate"
          icon="pi pi-plus"
          kind="primary"
          size="large"
          class="w-full"
        />
      </div>
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          ref="formEl"
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Certificate"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Create Certificate</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                Import a TLS certificate to serve your domains or to verify client certificates.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create Certificate</legend>
              <SettingsSection
                title="General"
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
              </SettingsSection>

              <SettingsSection
                title="Certificate"
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
                    <div
                      class="flex min-w-0 flex-wrap items-center justify-between gap-(--spacing-xs)"
                    >
                      <Field.Label>Certificate (PEM)</Field.Label>
                      <Button
                        type="button"
                        label="Upload file"
                        icon="pi pi-upload"
                        kind="outlined"
                        size="small"
                        @click="fileInput?.click()"
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
                      >Paste the certificate, or upload a .pem, .crt or .cer
                      file.</Field.Description
                    >
                    <Field.Error v-if="errors.certificate">{{ errors.certificate }}</Field.Error>
                  </Field>
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".pem,.crt,.cer,application/x-pem-file"
                    class="sr-only"
                    tabindex="-1"
                    aria-hidden="true"
                    @change="onFilePicked"
                  />
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
                    <KeyValuePairs
                      :columns="2"
                      aria-label="Certificate details"
                    >
                      <KeyValuePairs.Item label="Issued to">{{
                        parsed.subject || 'No common name'
                      }}</KeyValuePairs.Item>
                      <KeyValuePairs.Item label="Issued by">{{
                        parsed.issuer || 'No common name'
                      }}</KeyValuePairs.Item>
                      <KeyValuePairs.Item label="Valid from">{{
                        formatDate(parsed.notBefore)
                      }}</KeyValuePairs.Item>
                      <KeyValuePairs.Item label="Expires">
                        <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                          <span>{{ formatDate(parsed.notAfter) }}</span>
                          <StatusIndicator
                            :severity="expiry.severity"
                            :label="expiry.label"
                          />
                        </span>
                      </KeyValuePairs.Item>
                    </KeyValuePairs>
                    <p
                      v-if="parsed.chain > 1"
                      class="m-0 text-body-sm text-(--text-muted)"
                    >
                      {{ parsed.chain - 1 }} intermediate
                      {{ parsed.chain === 2 ? 'certificate' : 'certificates' }} follow it.
                    </p>
                    <p
                      v-if="expiry.message && expiry.severity === 'warning'"
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
              </SettingsSection>
            </fieldset>
          </PanelContent>

          <PanelFooter
            ><div class="flex w-full justify-end">
              <Button
                type="submit"
                label="Save"
                kind="primary"
                size="medium"
                :loading="submitting"
              /></div
          ></PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
  <Toaster position="bottom-right" />
</template>
