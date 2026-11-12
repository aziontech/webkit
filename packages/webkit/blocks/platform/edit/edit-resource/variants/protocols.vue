<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import HelperText, { type HelperTextKind } from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import type { SelectValue } from '@aziontech/webkit/select-root'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue'

  type FieldProblem = { kind: HelperTextKind; message: string }
  type LabeledOption = { value: unknown; label: string }

  const port = (value: number, label = String(value)) => ({ value, label })
  const httpPorts = [port(80, '80 (default)'), port(8008), port(8080), port(8880)]
  const httpsPorts = [port(443, '443 (default)'), port(8443), port(9440), port(9443)]
  const http3Ports = [port(443, '443 (default)'), port(8443), port(9443)]
  const tlsVersions = [
    { value: 'tls_1_3', label: 'TLS 1.3 (default)' },
    { value: 'tls_1_2', label: 'TLS 1.2' },
    { value: 'tls_1_1', label: 'TLS 1.1 (deprecated)' }
  ]
  const cipherSuites = [
    { value: 'modern-2025', label: 'Modern 2025' },
    { value: 'compatible-2025', label: 'Compatible 2025' },
    { value: 'legacy-2025', label: 'Legacy 2025' }
  ]
  const mtlsModes = [
    {
      value: 'enforce',
      label: 'Enforce',
      description:
        'Stops the TLS handshake when the client certificate cannot be verified against the trusted CA.'
    },
    {
      value: 'permissive',
      label: 'Permissive',
      description:
        'Tries to verify the client certificate but lets the handshake finish either way. The firewall sees which certificate was presented.'
    }
  ]
  const trustedCas = ref([
    { value: 'partners-ca', label: 'partners-ca', expires: 'Expires Mar 2027' },
    { value: 'devices-ca', label: 'devices-ca', expires: 'Expires Aug 2026' }
  ])
  const revocationLists = [
    { value: 'partners-crl', label: 'partners-crl' },
    { value: 'devices-crl', label: 'devices-crl' }
  ]

  const labelOf = (options: LabeledOption[]) => (value: unknown) =>
    options.find((option) => option.value === value)?.label ?? String(value ?? '')
  const caLabel = (value: unknown) => labelOf(trustedCas.value)(value)
  const portsLabel = (values: unknown[] | undefined) => (values ?? []).join(', ')
  const listLabel = (values: unknown[] | undefined) => (values ?? []).join(', ')

  const form = reactive({
    httpPorts: [80],
    useHttps: true,
    httpsPorts: [443],
    useHttp3: false,
    http3Ports: [443],
    minimumTls: 'tls_1_3',
    cipherSuite: 'modern-2025',
    mtls: false,
    mtlsMode: 'enforce',
    trustedCa: '',
    crl: [] as string[]
  })
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const saving = ref(false)
  const errors = reactive<Record<string, FieldProblem | undefined>>({})
  const armed = computed(() => form.useHttps && form.mtls)

  const clear = (key: string) => {
    delete errors[key]
  }

  const setHttps = (value: boolean) => {
    form.useHttps = value
    if (!value) {
      form.useHttp3 = false
      form.mtls = false
    }
  }
  const setHttp3 = (value: boolean) => {
    form.useHttp3 = value
    if (value) form.useHttps = true
  }

  const caQuery = ref('')
  const caMatches = computed(() => {
    const needle = caQuery.value.trim().toLowerCase()
    return needle
      ? trustedCas.value.filter((option) => option.label.includes(needle))
      : trustedCas.value
  })
  const pickCa = (value: SelectValue) => {
    if (value === '__upload__') {
      uploadOpen.value = true
      return
    }
    form.trustedCa = String(value)
    clear('trustedCa')
  }

  const uploadOpen = ref(false)
  const upload = reactive({ name: '', pem: '' })
  const uploadErrors = reactive<Record<string, FieldProblem | undefined>>({})
  const submitUpload = () => {
    Object.keys(uploadErrors).forEach((key) => delete uploadErrors[key])
    if (!/^[a-z0-9-]+$/.test(upload.name.trim())) {
      uploadErrors.name = upload.name.trim()
        ? { kind: 'invalid', message: 'Use lowercase letters, numbers and hyphens only.' }
        : { kind: 'required', message: 'Enter a name for the certificate.' }
    }
    if (!upload.pem.includes('BEGIN CERTIFICATE')) {
      uploadErrors.pem = upload.pem.trim()
        ? { kind: 'invalid', message: 'Paste a PEM certificate, starting with BEGIN CERTIFICATE.' }
        : { kind: 'required', message: 'Paste the CA certificate.' }
    }
    if (Object.keys(uploadErrors).length) return
    const value = upload.name.trim()
    trustedCas.value = [...trustedCas.value, { value, label: value, expires: 'Added now' }]
    form.trustedCa = value
    clear('trustedCa')
    upload.name = ''
    upload.pem = ''
    uploadOpen.value = false
  }

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (!form.httpPorts.length) {
      errors.httpPorts = { kind: 'required', message: 'Select at least one HTTP port.' }
    }
    if (form.useHttps && !form.httpsPorts.length) {
      errors.httpsPorts = { kind: 'required', message: 'Select at least one HTTPS port.' }
    }
    if (form.useHttp3 && !form.http3Ports.length) {
      errors.http3Ports = { kind: 'required', message: 'Select at least one HTTP/3 port.' }
    }
    if (armed.value && !form.trustedCa) {
      errors.trustedCa = {
        kind: 'required',
        message: 'Mutual authentication needs a trusted CA certificate.'
      }
    }
    return Object.keys(errors).length === 0
  }

  const ERROR_ORDER = ['httpPorts', 'httpsPorts', 'http3Ports', 'trustedCa']
  const focusFirstError = () =>
    nextTick(() => {
      const first = ERROR_ORDER.find((key) => errors[key])
      if (first) document.getElementById(`protocols-${first}`)?.focus()
    })

  const RUN_TOAST = 'protocols-deploy'
  let timer: ReturnType<typeof setTimeout> | undefined

  const editAgain = () => {
    toast.dismiss(RUN_TOAST)
    nextTick(() => document.getElementById('protocols-httpPorts')?.focus())
  }

  const deploy = () => {
    toast.loading('Deploying storefront…', {
      id: RUN_TOAST,
      description: 'Clients keep connecting with the current settings until it finishes.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      saving.value = false
      baseline.value = JSON.stringify(form)
      toast.success('storefront is live.', {
        id: RUN_TOAST,
        description: armed.value
          ? 'Production now asks every client for a certificate.'
          : 'Production answers on the new ports and TLS settings.',
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: editAgain },
          { label: 'Redeploy', onClick: deploy }
        ]
      })
    }, 1200)
  }

  const save = () => {
    if (!validate()) {
      focusFirstError()
      return
    }
    saving.value = true
    deploy()
  }

  const discard = () => {
    Object.assign(form, JSON.parse(baseline.value) as typeof form)
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col">
    <form
      class="flex min-h-0 min-w-0 flex-1 flex-col"
      aria-label="Protocol settings"
      novalidate
      @submit.prevent="save"
    >
      <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
        <PageHeader
          title="Protocols"
          description="How clients connect to storefront: ports, TLS, and whether they must present a certificate."
          size="small"
        />

        <fieldset
          class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
          :disabled="saving"
        >
          <legend class="sr-only">Protocol settings</legend>

          <SettingsSection
            title="Protocols"
            hint="The ports and TLS settings clients connect to this workload with."
            anchor="protocols"
          >
            <Card :padded="false">
              <template #content>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingRow
                      key="httpPorts"
                      title="HTTP ports"
                      description="The ports this workload answers plain HTTP on."
                    >
                      <MultiSelect
                        v-model="form.httpPorts"
                        size="large"
                        class="w-full"
                        placeholder="Select an HTTP port"
                        :display-value="portsLabel"
                        :disabled="saving"
                        :required="errors.httpPorts?.kind === 'required'"
                        :invalid="errors.httpPorts?.kind === 'invalid'"
                        :aria-describedby="
                          errors.httpPorts ? 'protocols-httpPorts-message' : undefined
                        "
                        @update:model-value="clear('httpPorts')"
                      >
                        <MultiSelect.Trigger
                          id="protocols-httpPorts"
                          aria-label="HTTP ports"
                        />
                        <MultiSelect.Content>
                          <MultiSelect.Option
                            v-for="option in httpPorts"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Option>
                        </MultiSelect.Content>
                      </MultiSelect>
                      <HelperText
                        v-if="errors.httpPorts"
                        id="protocols-httpPorts-message"
                        :kind="errors.httpPorts.kind"
                        :label="errors.httpPorts.message"
                      />
                    </SettingRow>
                    <SettingRow
                      key="useHttps"
                      title="HTTPS support"
                      description="Answer on HTTPS as well as HTTP. HTTP/3 and mutual authentication need it."
                      kind="compact"
                    >
                      <Switch
                        :model-value="form.useHttps"
                        aria-label="HTTPS support"
                        :disabled="saving"
                        @update:model-value="setHttps"
                      />
                    </SettingRow>
                    <SettingRow
                      v-if="form.useHttps"
                      key="httpsPorts"
                      title="HTTPS ports"
                      description="The ports this workload answers TLS traffic on."
                      :level="1"
                    >
                      <MultiSelect
                        v-model="form.httpsPorts"
                        size="large"
                        class="w-full"
                        placeholder="Select an HTTPS port"
                        :display-value="portsLabel"
                        :disabled="saving"
                        :required="errors.httpsPorts?.kind === 'required'"
                        :invalid="errors.httpsPorts?.kind === 'invalid'"
                        :aria-describedby="
                          errors.httpsPorts ? 'protocols-httpsPorts-message' : undefined
                        "
                        @update:model-value="clear('httpsPorts')"
                      >
                        <MultiSelect.Trigger
                          id="protocols-httpsPorts"
                          aria-label="HTTPS ports"
                        />
                        <MultiSelect.Content>
                          <MultiSelect.Option
                            v-for="option in httpsPorts"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Option>
                        </MultiSelect.Content>
                      </MultiSelect>
                      <HelperText
                        v-if="errors.httpsPorts"
                        id="protocols-httpsPorts-message"
                        :kind="errors.httpsPorts.kind"
                        :label="errors.httpsPorts.message"
                      />
                    </SettingRow>
                    <SettingRow
                      key="useHttp3"
                      title="HTTP/3 support"
                      description="Serve over HTTP/3 where the client supports it. Turns HTTPS support on with it."
                      kind="compact"
                    >
                      <Switch
                        :model-value="form.useHttp3"
                        aria-label="HTTP/3 support"
                        :disabled="saving"
                        @update:model-value="setHttp3"
                      />
                    </SettingRow>
                    <SettingRow
                      v-if="form.useHttp3"
                      key="http3Ports"
                      title="HTTP/3 ports"
                      description="The ports QUIC is answered on."
                      :level="1"
                    >
                      <MultiSelect
                        v-model="form.http3Ports"
                        size="large"
                        class="w-full"
                        placeholder="Select an HTTP/3 port"
                        :display-value="portsLabel"
                        :disabled="saving"
                        :required="errors.http3Ports?.kind === 'required'"
                        :invalid="errors.http3Ports?.kind === 'invalid'"
                        :aria-describedby="
                          errors.http3Ports ? 'protocols-http3Ports-message' : undefined
                        "
                        @update:model-value="clear('http3Ports')"
                      >
                        <MultiSelect.Trigger
                          id="protocols-http3Ports"
                          aria-label="HTTP/3 ports"
                        />
                        <MultiSelect.Content>
                          <MultiSelect.Option
                            v-for="option in http3Ports"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Option>
                        </MultiSelect.Content>
                      </MultiSelect>
                      <HelperText
                        v-if="errors.http3Ports"
                        id="protocols-http3Ports-message"
                        :kind="errors.http3Ports.kind"
                        :label="errors.http3Ports.message"
                      />
                    </SettingRow>
                    <SettingRow
                      v-if="form.useHttps"
                      key="minimumTls"
                      title="Minimum TLS version"
                      description="The oldest TLS version a client may negotiate."
                    >
                      <Select
                        v-model="form.minimumTls"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(tlsVersions)"
                        :disabled="saving"
                      >
                        <Select.Trigger aria-label="Minimum TLS version" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in tlsVersions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </SettingRow>
                    <SettingRow
                      v-if="form.useHttps"
                      key="cipherSuite"
                      title="Cipher suite"
                      description="The ciphers offered during the handshake."
                    >
                      <Select
                        v-model="form.cipherSuite"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(cipherSuites)"
                        :disabled="saving"
                      >
                        <Select.Trigger aria-label="Cipher suite" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in cipherSuites"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </SettingRow>
                  </TransitionGroup>
                </Item.List>
              </template>
            </Card>
          </SettingsSection>
          <SettingsSection
            title="Mutual authentication"
            hint="Ask each client for a certificate the workload can verify, as well as presenting its own."
            anchor="mutual-authentication"
          >
            <Card :padded="false">
              <template #content>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingRow
                      key="mtls"
                      title="Mutual authentication"
                      description="Clients without a valid certificate are refused or flagged, depending on the mode."
                      kind="compact"
                    >
                      <Switch
                        v-model="form.mtls"
                        aria-label="Mutual authentication"
                        :disabled="saving || !form.useHttps"
                      />
                      <HelperText
                        v-if="!form.useHttps"
                        label="Turn on HTTPS support to use mutual authentication."
                      />
                    </SettingRow>
                    <SettingRow
                      v-if="armed"
                      key="mtlsMode"
                      title="Mode"
                      description="What happens when a client certificate cannot be verified."
                      kind="stacked"
                      :level="1"
                    >
                      <fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
                        <legend class="sr-only">Mutual authentication mode</legend>
                        <Field.Label
                          v-for="option in mtlsModes"
                          :key="option.value"
                        >
                          <Field
                            orientation="horizontal"
                            :disabled="saving"
                          >
                            <RadioButton
                              v-model="form.mtlsMode"
                              :value="option.value"
                              name="protocols-mtls-mode"
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
                      v-if="armed"
                      key="trustedCa"
                      title="Trusted CA certificate"
                      description="The authority client certificates are verified against."
                      :level="1"
                    >
                      <Select
                        :model-value="form.trustedCa"
                        size="large"
                        class="w-full"
                        placeholder="Select a trusted CA certificate"
                        :display-value="caLabel"
                        :disabled="saving"
                        :required="errors.trustedCa?.kind === 'required'"
                        @update:model-value="pickCa"
                        @update:open="(open) => !open && (caQuery = '')"
                      >
                        <Select.Trigger
                          id="protocols-trustedCa"
                          aria-label="Trusted CA certificate"
                          :aria-describedby="
                            errors.trustedCa ? 'protocols-trustedCa-message' : undefined
                          "
                        />
                        <Select.Content>
                          <template #search>
                            <Input
                              v-model="caQuery"
                              size="small"
                              placeholder="Search certificates"
                              aria-label="Search certificates"
                              @keydown.stop
                            >
                              <template #iconLeft>
                                <i
                                  class="pi pi-search"
                                  aria-hidden="true"
                                />
                              </template>
                            </Input>
                          </template>
                          <Select.Group label="Trusted CA certificates">
                            <Select.Option
                              v-for="option in caMatches"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                              <template #tag>
                                <span class="text-body-xs text-(--text-muted)">{{
                                  option.expires
                                }}</span>
                              </template>
                            </Select.Option>
                            <p
                              v-if="!caMatches.length"
                              class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                            >
                              No certificate matches"{{ caQuery }}".
                            </p>
                          </Select.Group>
                          <template #footer>
                            <Select.Option
                              value="__upload__"
                              class="w-full"
                            >
                              <span class="flex items-center gap-(--spacing-xs)">
                                <i
                                  class="pi pi-upload"
                                  aria-hidden="true"
                                />
                                Upload certificate
                              </span>
                            </Select.Option>
                          </template>
                        </Select.Content>
                      </Select>
                      <HelperText
                        v-if="errors.trustedCa"
                        id="protocols-trustedCa-message"
                        :kind="errors.trustedCa.kind"
                        :label="errors.trustedCa.message"
                      />
                    </SettingRow>
                    <SettingRow
                      v-if="armed"
                      key="crl"
                      title="Certificate revocation lists"
                      description="Certificates on these lists are refused during the handshake."
                      :level="1"
                    >
                      <MultiSelect
                        v-model="form.crl"
                        size="large"
                        class="w-full"
                        placeholder="No revocation list"
                        :display-value="listLabel"
                        :disabled="saving"
                      >
                        <MultiSelect.Trigger
                          id="protocols-crl"
                          aria-label="Certificate revocation lists"
                        />
                        <MultiSelect.Content>
                          <MultiSelect.Option
                            v-for="option in revocationLists"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Option>
                        </MultiSelect.Content>
                      </MultiSelect>
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
          Protocol settings changed.
          <span class="text-(--text-muted)">Saving deploys storefront to Production.</span>

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

    <Drawer
      v-model:open="uploadOpen"
      side="right"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex h-full min-h-0 flex-col"
            novalidate
            @submit.prevent="submitUpload"
          >
            <PanelHeader class="w-full">
              <DrawerTitle>Upload certificate</DrawerTitle>
              <DrawerClose />
            </PanelHeader>
            <PanelContent>
              <div class="flex flex-col gap-(--spacing-md)">
                <DrawerDescription>
                  A trusted CA certificate in PEM format. It is added to the account and picked for
                  this workload.
                </DrawerDescription>
                <Field>
                  <Field.Label for="protocols-upload-name">
                    <span class="text-label-md">Name</span>
                  </Field.Label>
                  <Input
                    id="protocols-upload-name"
                    v-model="upload.name"
                    size="large"
                    class="w-full"
                    placeholder="partners-ca"
                    autocomplete="off"
                    :required="uploadErrors.name?.kind === 'required'"
                    :invalid="uploadErrors.name?.kind === 'invalid'"
                    :aria-describedby="
                      uploadErrors.name ? 'protocols-upload-name-message' : undefined
                    "
                  />
                  <HelperText
                    v-if="uploadErrors.name"
                    id="protocols-upload-name-message"
                    :kind="uploadErrors.name.kind"
                    :label="uploadErrors.name.message"
                  />
                </Field>
                <Field>
                  <Field.Label for="protocols-upload-pem">
                    <span class="text-label-md">Certificate</span>
                  </Field.Label>
                  <Textarea
                    id="protocols-upload-pem"
                    v-model="upload.pem"
                    class="w-full"
                    :rows="8"
                    placeholder="-----BEGIN CERTIFICATE-----"
                    :required="uploadErrors.pem?.kind === 'required'"
                    :invalid="uploadErrors.pem?.kind === 'invalid'"
                    :aria-describedby="
                      uploadErrors.pem ? 'protocols-upload-pem-message' : undefined
                    "
                  />
                  <HelperText
                    v-if="uploadErrors.pem"
                    id="protocols-upload-pem-message"
                    :kind="uploadErrors.pem.kind"
                    :label="uploadErrors.pem.message"
                  />
                </Field>
              </div>
            </PanelContent>
            <PanelFooter>
              <div class="flex w-full justify-end gap-(--spacing-xs)">
                <Button
                  type="button"
                  label="Cancel"
                  kind="outlined"
                  @click="uploadOpen = false"
                />
                <Button
                  type="submit"
                  label="Upload"
                  kind="primary"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <Toaster position="bottom-right" />
  </div>
</template>
