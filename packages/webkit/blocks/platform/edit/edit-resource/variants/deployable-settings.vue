<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import type { SelectOptionItem } from '@aziontech/webkit/select-root'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import type { TableColumn } from '@aziontech/webkit/table-root'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  type LabeledOption = SelectOptionItem<string | number>

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]

  const activeTab = ref('settings')
  const environments = [
    { name: 'Production', policy: 'Single' },
    { name: 'Preview', policy: 'Versioned' }
  ]
  const environment = ref('Production')
  const environmentQuery = ref('')
  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments
    return environments.filter((option) => option.name.toLowerCase().includes(needle))
  })
  const advancedOpen = ref(false)

  const domains = [
    {
      id: 'generated',
      domain: 'resource-01.azion.app',
      environment: 'Production',
      policy: 'Single',
      certificate: 'Platform (free)',
      generated: true
    },
    {
      id: 'd-7731',
      domain: 'www.example.com',
      environment: 'Production',
      policy: 'Single',
      certificate: 'example.com wildcard',
      generated: false
    }
  ]

  const domainColumns: TableColumn[] = [
    { accessorKey: 'domain', header: 'Domain', principal: true, grow: 2 },
    { accessorKey: 'environment', header: 'Environment' },
    { accessorKey: 'policy', header: 'Policy' },
    { accessorKey: 'certificate', header: 'Certificate' },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const linkedEnvironments = [
    {
      name: 'Production',
      policy: 'Single',
      settingsId: 's1',
      auto: true,
      options: [
        { value: 'default', label: 'Default' },
        { value: 's1', label: 'storefront-production' },
        { value: 's2', label: 'storefront-legacy' }
      ]
    },
    {
      name: 'Preview',
      policy: 'Versioned',
      settingsId: 's5',
      auto: true,
      options: [
        { value: 's5', label: 'analytics-canary' },
        { value: 's10', label: 'blog-platform-stage' }
      ]
    }
  ]

  const httpPortOptions = [
    { value: 80, label: '80 (Default)' },
    { value: 8008, label: '8008' },
    { value: 8080, label: '8080' },
    { value: 8880, label: '8880' }
  ]

  const httpsPortOptions = [
    { value: 443, label: '443 (Default)' },
    { value: 8443, label: '8443' },
    { value: 9440, label: '9440' },
    { value: 9441, label: '9441' },
    { value: 9442, label: '9442' },
    { value: 9443, label: '9443' },
    { value: 7777, label: '7777' },
    { value: 8888, label: '8888' },
    { value: 9553, label: '9553' },
    { value: 9653, label: '9653' },
    { value: 8035, label: '8035' },
    { value: 8090, label: '8090' }
  ]

  const http3PortOptions = [
    { value: 443, label: '443 (Default)' },
    { value: 7777, label: '7777' },
    { value: 8035, label: '8035' },
    { value: 8090, label: '8090' },
    { value: 8443, label: '8443' },
    { value: 8888, label: '8888' },
    { value: 9440, label: '9440' },
    { value: 9441, label: '9441' },
    { value: 9442, label: '9442' },
    { value: 9443, label: '9443' },
    { value: 9553, label: '9553' },
    { value: 9653, label: '9653' }
  ]

  const tlsVersionOptions = [
    { value: 'tls_1_3', label: 'TLS v1.3 (Default)' },
    { value: 'tls_1_2', label: 'TLS v1.2' },
    { value: 'tls_1_1', label: 'TLS v1.1 (Deprecated)' },
    { value: 'tls_1_0', label: 'TLS v1.0 (Deprecated)' }
  ]

  const cipherSuiteOptions = [
    { value: 7, label: 'Modern v2025Q1' },
    { value: 6, label: 'Compatible v2025Q1' },
    { value: 5, label: 'Legacy v2025Q1' },
    { value: 4, label: 'Modern v2022Q1 (migration TLS 1.3)' },
    { value: 3, label: 'Modern v2022Q1 - TLS 1.2' },
    { value: 2, label: 'Compatible v2018Q1 - TLS 1.2' },
    { value: 1, label: 'Legacy v2018Q1 - TLS 1.2' }
  ]

  const mtlsModeOptions = [
    {
      value: 'enforce',
      label: 'Enforce',
      description:
        'Blocks the client certificate during the TLS handshake when the Trusted CA can’t be validated.'
    },
    {
      value: 'permissive',
      label: 'Permissive',
      description:
        'Attempts to verify the client certificate, but allows the handshake even when the Trusted CA can’t be validated. Check which certificate attempted the request in the request logs.'
    }
  ]

  const trustedCaOptions = [
    { value: 'cert-8804', label: 'legacy origin CA' },
    { value: 'cert-8806', label: 'partner mTLS CA' }
  ]

  const revocationListOptions = [{ value: 'cert-8807', label: 'partner revocation list' }]

  const record = {
    name: 'resource-01',
    active: true,
    deploymentSettings: {} as Record<string, string>,
    protocols: {
      httpPorts: [80],
      useHttps: true,
      httpsPorts: [443],
      useHttp3: false,
      http3Ports: [443],
      minimumTlsVersion: 'tls_1_3',
      cipherSuite: 7
    },
    mtls: { enabled: false, mode: 'enforce', certificate: '', crl: [] as string[] }
  }

  const form = reactive(structuredClone(record))
  const saving = ref(false)
  const baseline = ref(JSON.stringify(record))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)

  const secure = computed(() => form.protocols.useHttps || form.protocols.useHttp3)
  const armed = computed(() => form.protocols.useHttps && form.mtls.enabled)

  const optionLabel = (options: LabeledOption[]) => (value: string | number) =>
    options.find((option) => option.value === value)?.label ?? String(value)

  const portsLabel = (values: number[]) =>
    values.map((value) => optionLabel([...httpPortOptions, ...httpsPortOptions])(value)).join(', ')
  const tlsVersionLabel = optionLabel(tlsVersionOptions)
  const cipherSuiteLabel = optionLabel(cipherSuiteOptions)
  const certificateName = (value: string) => (value ? optionLabel(trustedCaOptions)(value) : '')
  const crlLabel = (values: string[]) => values.map(optionLabel(revocationListOptions)).join(', ')
  const settingName = (value: string) =>
    optionLabel(linkedEnvironments.flatMap((environment) => environment.options))(value)

  const setHttps = (value: boolean) => {
    form.protocols.useHttps = value
    if (!value) form.protocols.useHttp3 = false
  }

  const setHttp3 = (value: boolean) => {
    form.protocols.useHttp3 = value
    if (value) form.protocols.useHttps = true
  }

  const nameError = ref(false)
  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )

  const save = () => {
    if (!form.name.trim()) {
      nameError.value = true
      nextTick(() => document.getElementById('resource-name')?.focus())
      return
    }
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
    }, 900)
  }

  const discard = () => Object.assign(form, JSON.parse(baseline.value) as typeof form)

  const deleteOpen = ref(false)
  const deleteConfirmation = ref('')
  const deleteLabelId = useId()
  const canDelete = computed(() => deleteConfirmation.value.trim() === record.name)

  watch(deleteOpen, (isOpen) => {
    if (isOpen) deleteConfirmation.value = ''
  })

  const confirmDelete = () => {
    if (!canDelete.value) return
    deleteOpen.value = false
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <ConsoleLayout.Breadcrumbs
      :items="[
        { label: 'Resources', href: '/resources' },
        { label: record.name, href: '/resources/1020655' }
      ]"
    >
      <Select
        :model-value="environment"
        :display-value="(value) => String(value ?? '')"
        kind="transparent"
        size="small"
        @update:model-value="
          (value) => {
            if (value !== '__add-environment__') environment = String(value)
          }
        "
        @update:open="
          (open) => {
            if (!open) environmentQuery = ''
          }
        "
      >
        <Select.Trigger aria-label="Switch environment" />
        <Select.Content>
          <template #search>
            <Input
              v-model="environmentQuery"
              size="small"
              placeholder="Search environments"
              aria-label="Search environments"
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
          <Select.Group label="Environments">
            <Select.Option
              v-for="option in environmentMatches"
              :key="option.name"
              :value="option.name"
            >
              {{ option.name }}
              <template #tag>
                <Tag
                  :label="option.policy"
                  severity="secondary"
                  size="small"
                />
              </template>
            </Select.Option>
            <p
              v-if="!environmentMatches.length"
              class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
            >
              No environments match "{{ environmentQuery }}".
            </p>
          </Select.Group>
          <template #footer>
            <Select.Option
              value="__add-environment__"
              class="w-full"
            >
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="pi pi-plus-circle"
                  aria-hidden="true"
                />
                Add Environment
              </span>
            </Select.Option>
          </template>
        </Select.Content>
      </Select>
    </ConsoleLayout.Breadcrumbs>
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
        <template #actions>
          <Button
            label="Deploy"
            kind="outlined"
            size="medium"
            icon="pi pi-cloud-upload"
          />
        </template>
      </PageTabs>
    </div>

    <section class="min-h-0 flex-1">
      <div>
        <div
          class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
        >
          <PageHeader
            title="Settings"
            description="Manage this resource’s configuration."
            size="small"
          />

          <form
            class="mt-(--layout-section-gap) flex min-w-0 flex-col"
            aria-label="Resource settings"
            novalidate
            @submit.prevent="save"
          >
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="saving"
            >
              <legend class="sr-only">Resource settings</legend>

              <SettingsSection
                title="General"
                hint="How this resource is identified across the platform, and whether it answers at all."
                anchor="general"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Name"
                        description="A unique and descriptive name to identify the resource."
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            id="resource-name"
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            :disabled="saving"
                            :required="nameError"
                            :aria-describedby="nameError ? 'resource-name-message' : undefined"
                          />
                          <HelperText
                            v-if="nameError"
                            id="resource-name-message"
                            kind="required"
                            label="This field is required."
                          />
                        </div>
                      </SettingRow>
                      <SettingRow
                        title="Active"
                        description="When disabled, the resource stops answering and traffic to its domains is refused. Its deployments are kept."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                          :disabled="saving"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Domains"
                hint="The addresses this resource answers on, the environment each one answers in, and the certificate it is served with."
                anchor="domains"
              >
                <Card :padded="false">
                  <template #content>
                    <div class="flex min-w-0 flex-col">
                      <TableRoot
                        :data="domains"
                        :columns="domainColumns"
                        row-key="id"
                        :bordered="false"
                      >
                        <template #cell-environment="{ value }">
                          <Tag
                            v-if="value"
                            severity="secondary"
                            size="medium"
                            rounded
                            icon="ai ai-layers"
                            :label="value"
                          />
                        </template>
                        <template #cell-policy="{ row, value }">
                          <template v-if="row.environment">{{ value }}</template>
                        </template>
                        <template #cell-certificate="{ value }">
                          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
                            <i
                              class="pi pi-verified shrink-0 text-(--text-muted)"
                              aria-hidden="true"
                            />
                            <span class="min-w-0 truncate">{{ value }}</span>
                          </span>
                        </template>
                        <template #cell-actions="{ row }">
                          <DropdownMenu
                            v-if="!row.generated"
                            placement="bottom-end"
                          >
                            <DropdownMenu.Trigger>
                              <Tooltip text="Row actions">
                                <IconButton
                                  icon="pi pi-ellipsis-h"
                                  kind="outlined"
                                  size="small"
                                  :disabled="saving"
                                  :aria-label="`Actions for ${row.domain}`"
                                />
                              </Tooltip>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Group>
                              <DropdownMenu.Option
                                value="edit"
                                label="Edit"
                              >
                                <template #left
                                  ><i
                                    class="pi pi-pencil"
                                    aria-hidden="true"
                                /></template>
                              </DropdownMenu.Option>
                            </DropdownMenu.Group>
                            <DropdownMenu.Group>
                              <DropdownMenu.Option
                                value="delete"
                                label="Delete"
                              >
                                <template #left
                                  ><i
                                    class="pi pi-trash"
                                    aria-hidden="true"
                                /></template>
                              </DropdownMenu.Option>
                            </DropdownMenu.Group>
                          </DropdownMenu>
                        </template>
                      </TableRoot>

                      <div
                        class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)"
                      >
                        <span class="text-body-xs text-(--text-muted)"
                          >{{ domains.length }}
                          {{ domains.length === 1 ? 'domain' : 'domains' }}</span
                        >
                        <Button
                          type="button"
                          label="Add Domain"
                          kind="outlined"
                          size="medium"
                          icon="pi pi-plus"
                          :disabled="saving"
                        />
                      </div>
                    </div>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Advanced settings"
                hint="Deployment Settings, protocols and mutual authentication, which most resources never change."
                anchor="advanced-settings"
                v-model:open="advancedOpen"
                collapsible
              >
                <div class="flex min-w-0 flex-col">
                  <SettingsSection
                    title="Deployment Settings"
                    hint="Which shared configuration each of this resource’s environments publishes with, linked automatically by deployment policy."
                    anchor="deployment-settings"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                      <Alert
                        severity="info"
                        size="small"
                        action-label="Manage Deployment Settings"
                      >
                        Deployment Settings centralize the services, policies and error pages that
                        environments share. Every environment a domain answers in is linked to one
                        automatically, matching that environment’s deployment policy.
                      </Alert>

                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <SettingRow
                              v-for="environment in linkedEnvironments"
                              :key="environment.name"
                              :title="environment.name"
                            >
                              <template #description>
                                <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                                  <Tag
                                    severity="info"
                                    size="small"
                                    :label="environment.policy"
                                  />
                                  <Tag
                                    v-if="
                                      environment.auto && !form.deploymentSettings[environment.name]
                                    "
                                    severity="secondary"
                                    size="small"
                                    label="Linked automatically"
                                  />
                                  <span class="text-body-xs text-(--text-muted)"
                                    >Only {{ environment.policy }} Deployment Settings can be linked
                                    to this environment.</span
                                  >
                                </span>
                              </template>
                              <Select
                                :model-value="
                                  form.deploymentSettings[environment.name] ??
                                  environment.settingsId
                                "
                                size="large"
                                class="w-full"
                                placeholder="Select a deployment setting"
                                :disabled="saving"
                                :display-value="settingName"
                                @update:model-value="
                                  form.deploymentSettings[environment.name] = $event
                                "
                              >
                                <Select.Trigger
                                  class="w-full"
                                  :aria-label="`Deployment Settings for ${environment.name}`"
                                />
                                <Select.Content>
                                  <Select.Option
                                    v-for="option in environment.options"
                                    :key="option.value"
                                    :value="option.value"
                                  >
                                    {{ option.label }}
                                  </Select.Option>
                                </Select.Content>
                              </Select>
                            </SettingRow>
                          </Item.List>
                        </template>
                      </Card>
                    </div>
                  </SettingsSection>

                  <SettingsSection
                    title="Protocol settings"
                    hint="Which protocols and ports this resource answers on, and the TLS floor it accepts."
                    anchor="protocol-settings"
                  >
                    <Card :padded="false">
                      <template #content>
                        <Item.List>
                          <SettingRow
                            title="HTTP ports"
                            description="The ports this resource answers plain HTTP on."
                          >
                            <MultiSelect
                              v-model="form.protocols.httpPorts"
                              size="large"
                              class="w-full"
                              placeholder="Select an HTTP port"
                              :disabled="saving"
                              :display-value="portsLabel"
                            >
                              <MultiSelect.Trigger aria-label="HTTP ports" />
                              <MultiSelect.Content>
                                <MultiSelect.Option
                                  v-for="option in httpPortOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </MultiSelect.Option>
                              </MultiSelect.Content>
                            </MultiSelect>
                            <HelperText
                              v-if="!form.protocols.httpPorts.length"
                              id="http-ports-message"
                              :kind="'required'"
                              :label="'Select at least one HTTP port.'"
                            />
                          </SettingRow>
                          <SettingRow
                            title="HTTPS support"
                            description="Answer on both HTTP and HTTPS. Required by HTTP/3 and by mutual authentication."
                            kind="compact"
                          >
                            <Switch
                              :model-value="form.protocols.useHttps"
                              aria-label="HTTPS support"
                              :disabled="saving"
                              @update:model-value="setHttps"
                            />
                          </SettingRow>
                          <SettingRow
                            v-if="form.protocols.useHttps"
                            key="https-ports"
                            title="HTTPS ports"
                            description="The ports this resource answers TLS traffic on."
                          >
                            <MultiSelect
                              v-model="form.protocols.httpsPorts"
                              size="large"
                              class="w-full"
                              placeholder="Select an HTTPS port"
                              :disabled="saving"
                              :display-value="portsLabel"
                            >
                              <MultiSelect.Trigger aria-label="HTTPS ports" />
                              <MultiSelect.Content>
                                <MultiSelect.Option
                                  v-for="option in httpsPortOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </MultiSelect.Option>
                              </MultiSelect.Content>
                            </MultiSelect>
                            <HelperText
                              v-if="!form.protocols.httpsPorts.length"
                              id="https-ports-message"
                              :kind="'required'"
                              :label="'Select at least one HTTPS port.'"
                            />
                          </SettingRow>
                          <SettingRow
                            title="HTTP/3 support"
                            description="Serve over HTTP/3 (QUIC) where the client supports it. Turns HTTPS support on with it."
                            kind="compact"
                          >
                            <Switch
                              :model-value="form.protocols.useHttp3"
                              aria-label="HTTP/3 support"
                              :disabled="saving"
                              @update:model-value="setHttp3"
                            />
                          </SettingRow>
                          <SettingRow
                            v-if="form.protocols.useHttp3"
                            key="http3-ports"
                            title="HTTP/3 ports"
                            description="The ports QUIC is answered on."
                          >
                            <MultiSelect
                              v-model="form.protocols.http3Ports"
                              size="large"
                              class="w-full"
                              placeholder="Select an HTTP/3 port"
                              :disabled="saving"
                              :display-value="portsLabel"
                            >
                              <MultiSelect.Trigger aria-label="HTTP/3 ports" />
                              <MultiSelect.Content>
                                <MultiSelect.Option
                                  v-for="option in http3PortOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </MultiSelect.Option>
                              </MultiSelect.Content>
                            </MultiSelect>
                            <HelperText
                              v-if="!form.protocols.http3Ports.length"
                              id="http3-ports-message"
                              :kind="'required'"
                              :label="'Select at least one HTTP/3 port.'"
                            />
                          </SettingRow>
                          <SettingRow
                            v-if="secure"
                            key="tls-version"
                            title="Minimum TLS version"
                            description="The oldest TLS version a client may negotiate with."
                          >
                            <Select
                              v-model="form.protocols.minimumTlsVersion"
                              size="large"
                              class="w-full"
                              :disabled="saving"
                              :display-value="tlsVersionLabel"
                            >
                              <Select.Trigger
                                class="w-full"
                                aria-label="Minimum TLS version"
                              />
                              <Select.Content>
                                <Select.Option
                                  v-for="option in tlsVersionOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                          </SettingRow>
                          <SettingRow
                            v-if="secure"
                            key="cipher-suite"
                            title="Cipher suite"
                            description="The set of ciphers offered during the handshake."
                          >
                            <Select
                              v-model="form.protocols.cipherSuite"
                              size="large"
                              class="w-full"
                              :disabled="saving"
                              :display-value="cipherSuiteLabel"
                            >
                              <Select.Trigger
                                class="w-full"
                                aria-label="Cipher suite"
                              />
                              <Select.Content>
                                <Select.Option
                                  v-for="option in cipherSuiteOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                          </SettingRow>
                        </Item.List>
                      </template>
                    </Card>
                  </SettingsSection>

                  <SettingsSection
                    title="Mutual authentication"
                    hint="Require the client to present a certificate the resource can verify, as well as presenting its own."
                    anchor="mutual-authentication"
                  >
                    <Card :padded="false">
                      <template #content>
                        <Item.List>
                          <SettingRow
                            title="Mutual authentication"
                            description="Require the client to present a certificate the resource can verify, as well as presenting its own."
                            kind="compact"
                          >
                            <Switch
                              v-model="form.mtls.enabled"
                              aria-label="Mutual authentication"
                              :disabled="saving || !form.protocols.useHttps"
                            />
                          </SettingRow>
                          <SettingRow
                            v-if="armed"
                            key="mtls-mode"
                            title="Mode"
                            description="What happens when the client certificate cannot be validated against the Trusted CA."
                            kind="stacked"
                          >
                            <div
                              role="radiogroup"
                              aria-label="Mutual authentication mode"
                              class="flex w-full flex-col gap-(--spacing-sm)"
                            >
                              <Field.Label
                                v-for="option in mtlsModeOptions"
                                :key="option.value"
                              >
                                <Field
                                  orientation="horizontal"
                                  :disabled="saving"
                                >
                                  <RadioButton
                                    v-model="form.mtls.mode"
                                    :value="option.value"
                                    name="mtls-mode"
                                    :input-id="`mtls-mode-${option.value}`"
                                  />
                                  <Field.Content>
                                    <Field.Title>{{ option.label }}</Field.Title>
                                    <Field.Description v-if="option.description">{{
                                      option.description
                                    }}</Field.Description>
                                  </Field.Content>
                                </Field>
                              </Field.Label>
                            </div>
                          </SettingRow>
                          <SettingRow
                            v-if="armed"
                            key="mtls-certificate"
                            title="Trusted CA certificate"
                            description="The authority a client certificate is verified against."
                          >
                            <Select
                              v-model="form.mtls.certificate"
                              size="large"
                              class="w-full"
                              placeholder="Select a Trusted CA certificate"
                              :disabled="saving"
                              :display-value="certificateName"
                            >
                              <Select.Trigger
                                class="w-full"
                                aria-label="Trusted CA certificate"
                              />
                              <Select.Content>
                                <Select.Option
                                  v-for="option in trustedCaOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                            <HelperText
                              v-if="!form.mtls.certificate"
                              id="mtls-certificate-message"
                              :kind="'required'"
                              :label="'Mutual authentication requires a Trusted CA certificate.'"
                            />
                          </SettingRow>
                          <SettingRow
                            v-if="armed"
                            key="mtls-crl"
                            title="Certificate revocation list"
                            description="Revoked certificates are rejected during the handshake."
                          >
                            <MultiSelect
                              v-model="form.mtls.crl"
                              size="large"
                              class="w-full"
                              placeholder="Select a revocation list"
                              :disabled="saving"
                              :display-value="crlLabel"
                            >
                              <MultiSelect.Trigger aria-label="Certificate revocation list" />
                              <MultiSelect.Content>
                                <MultiSelect.Option
                                  v-for="option in revocationListOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </MultiSelect.Option>
                              </MultiSelect.Content>
                            </MultiSelect>
                          </SettingRow>
                        </Item.List>
                      </template>
                    </Card>
                  </SettingsSection>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Danger zone"
                hint="Actions that cannot be undone."
                anchor="danger-zone"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Delete this resource"
                        description="Once deleted, the resource and its deployments cannot be recovered."
                        kind="compact"
                      >
                        <ConfirmDialog
                          v-model:open="deleteOpen"
                          title="Delete resource"
                          size="medium"
                        >
                          <template #trigger>
                            <Button
                              type="button"
                              label="Delete resource"
                              kind="danger"
                              size="medium"
                              icon="pi pi-trash"
                            />
                          </template>
                          <div class="flex flex-col gap-(--spacing-md)">
                            <Alert
                              severity="warning"
                              label="Once confirmed, this action can't be reversed."
                            />
                            <p class="m-0 text-body-sm text-(--text-muted)">
                              The resource will be deleted, along with its domains and deployments.
                            </p>
                            <p
                              :id="deleteLabelId"
                              class="m-0 text-body-sm text-(--text-default)"
                            >
                              Type {{ record.name }} to confirm.
                            </p>
                            <Input
                              v-model="deleteConfirmation"
                              :aria-labelledby="deleteLabelId"
                              autocomplete="off"
                              class="w-full"
                              @keydown.enter="confirmDelete"
                            />
                          </div>
                          <template #actions="{ close }">
                            <Button
                              label="Cancel"
                              kind="outlined"
                              size="medium"
                              @click="close"
                            />
                            <Button
                              label="Delete resource"
                              kind="danger"
                              size="medium"
                              :disabled="!canDelete"
                              @click="confirmDelete"
                            />
                          </template>
                        </ConfirmDialog>
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </form>
        </div>
      </div>
    </section>

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
  </div>
</template>
