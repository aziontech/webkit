<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, reactive, ref } from 'vue'

  const form = reactive({
    accountName: 'Acme',
    clientId: '9757a',
    companyName: '',
    companyId: '',
    billingEmails: 'name@example.com',
    postalCode: '00000-000',
    country: 'br',
    state: 'rs',
    city: 'poa',
    address: 'n',
    apartment: '',
    allowSocialLogin: true,
    enforceMfa: false
  })
  const saving = ref(false)
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const save = () => {
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
    }, 900)
  }
  const discard = () => Object.assign(form, JSON.parse(baseline.value))

  const places = [
    {
      key: 'country',
      label: 'Country',
      options: [
        { label: 'Brazil', value: 'br' },
        { label: 'United States', value: 'us' },
        { label: 'Portugal', value: 'pt' }
      ]
    },
    {
      key: 'state',
      label: 'State/Region',
      options: [
        { label: 'Rio Grande do Sul', value: 'rs' },
        { label: 'São Paulo', value: 'sp' },
        { label: 'Rio de Janeiro', value: 'rj' }
      ]
    },
    {
      key: 'city',
      label: 'City',
      options: [
        { label: 'Porto Alegre', value: 'poa' },
        { label: 'São Paulo', value: 'sao' },
        { label: 'Rio de Janeiro', value: 'rio' }
      ]
    }
  ]
  const sourceControls = [
    {
      key: 'github',
      name: 'Github',
      icon: 'ai ai-github',
      connected: true,
      tag: 'Active',
      description:
        'Connected as rafael.umman: to repositories in organizations: acme, rafael-personal.',
      action: 'Manage'
    },
    {
      key: 'gitlab',
      name: 'Gitlab',
      icon: 'ai-cor ai-gitlab',
      connected: false,
      tag: '',
      description: 'Connect GitLab to build and deploy from its repositories.',
      action: 'Connect'
    },
    {
      key: 'bitbucket',
      name: 'Bitbucket',
      icon: 'ai-cor ai-bitbucket',
      connected: false,
      tag: '',
      description: 'Connect Bitbucket to build and deploy from its repositories.',
      action: 'Connect'
    }
  ]
  const fonts = [
    { value: 'rubik', label: 'Rubik (Default)' },
    { value: 'rubik', label: 'Rubik' },
    { value: 'inter', label: 'Inter' },
    { value: 'ibm-plex-sans', label: 'IBM Plex Sans' },
    { value: 'geist', label: 'Geist' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'work-sans', label: 'Work Sans' },
    { value: 'instrument-sans', label: 'Instrument Sans' },
    { value: 'hedvig-letters-sans', label: 'Hedvig Letters Sans' }
  ]
  const appearances = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ]
  const font = ref('rubik')
  const theme = ref('system')
</script>

<template>
  <main class="flex h-screen flex-col bg-(--bg-canvas)">
    <div class="flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Profile"
        novalidate
        @submit.prevent="save"
      >
        <div class="min-h-0 flex-1 overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Profile"
              description="Manage your identity, company details, address, and sign-in preferences."
              size="small"
            />
            <fieldset
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
              :disabled="saving"
            >
              <legend class="sr-only">Profile</legend>
              <SettingsSection
                title="General"
                hint="How this account is identified on the platform."
                anchor="general"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Account Name"
                        description="What this account is called across the console."
                      >
                        <Input
                          v-model="form.accountName"
                          size="large"
                          class="w-full"
                          aria-label="Account Name"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Client ID"
                        description="Can't be changed. Quote it when opening a support ticket about this account."
                      >
                        <Input
                          v-model="form.clientId"
                          size="large"
                          class="w-full"
                          aria-label="Client ID"
                          readonly
                          :disabled="saving"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Company information"
                hint="The company that owns the account, as it appears on every invoice."
                anchor="company-information"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Company Name"
                        description="The legal entity that owns this account."
                      >
                        <Input
                          v-model="form.companyName"
                          size="large"
                          class="w-full"
                          aria-label="Company Name"
                          placeholder="Company S.A."
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Company ID"
                        description="Personal or company ID number that identifies account ownership."
                      >
                        <Input
                          v-model="form.companyId"
                          size="large"
                          class="w-full"
                          aria-label="Company ID"
                          placeholder="00.000.000/0001-00"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Billing emails"
                        description="Billing is forwarded to every address listed here. Separate each one with a semicolon ( ; )."
                        kind="stacked"
                      >
                        <Textarea
                          v-model="form.billingEmails"
                          class="w-full"
                          :rows="3"
                          aria-label="Billing emails"
                          :disabled="saving"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Address information"
                hint="Where the account owner is registered, for invoices and tax purposes."
                anchor="address-information"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow title="Postal Code">
                        <Input
                          v-model="form.postalCode"
                          size="large"
                          class="w-full"
                          autocomplete="postal-code"
                          aria-label="Postal Code"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        v-for="place in places"
                        :key="place.key"
                        :title="place.label"
                      >
                        <Select
                          v-model="form[place.key]"
                          size="large"
                          :display-value="
                            (value) =>
                              place.options.find((option) => option.value === value)?.label ?? ''
                          "
                        >
                          <Select.Trigger
                            class="w-full"
                            :aria-label="place.label"
                          />
                          <Select.Content>
                            <Select.Option
                              v-for="option in place.options"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </SettingRow>
                      <SettingRow title="Address">
                        <Input
                          v-model="form.address"
                          size="large"
                          class="w-full"
                          autocomplete="address-line1"
                          aria-label="Address"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow title="Apartment, floor, etc.">
                        <Input
                          v-model="form.apartment"
                          size="large"
                          class="w-full"
                          autocomplete="address-line2"
                          aria-label="Apartment, floor, etc."
                          placeholder="1st floor"
                          :disabled="saving"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Login Settings"
                hint="How the users linked to this account sign in."
                anchor="login-settings"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Allow social login"
                        description="Users linked to the account can log in with their social network credentials."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.allowSocialLogin"
                          aria-label="Allow social login"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Enforce multi-factor authentication"
                        description="MFA is required on login for every user linked to this account."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.enforceMfa"
                          aria-label="Enforce multi-factor authentication"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Authenticator devices"
                        description="Manage the devices and recovery codes registered for this account."
                        kind="compact"
                      >
                        <Button
                          type="button"
                          label="Manage"
                          kind="outlined"
                          size="medium"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Source control"
                hint="The Git providers this account builds applications from, connected at the provider and outside Save."
                anchor="source-control"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <Item
                        v-for="provider in sourceControls"
                        :key="provider.key"
                        size="small"
                      >
                        <Item.Media>
                          <span
                            class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <i
                              :class="[
                                provider.icon,
                                'text-body-lg leading-none text-(--text-default)'
                              ]"
                              aria-hidden="true"
                            />
                          </span>
                        </Item.Media>
                        <Item.Content>
                          <Item.Title>
                            {{ provider.name }}
                            <Tag
                              v-if="provider.tag"
                              :label="provider.tag"
                              severity="success"
                              size="small"
                            />
                          </Item.Title>
                          <Item.Description>{{ provider.description }}</Item.Description>
                        </Item.Content>
                        <Item.Actions>
                          <Button
                            type="button"
                            :label="provider.action"
                            kind="outlined"
                            size="medium"
                            :icon="provider.connected ? undefined : 'pi pi-external-link'"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Appearance"
                hint="Preferences for this browser, applied the moment you change them and not part of Save."
                anchor="appearance"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Font family"
                        description="The primary sans typeface across the console."
                      >
                        <Select
                          v-model="font"
                          size="large"
                          :display-value="
                            (value) => fonts.find((option) => option.value === value)?.label ?? ''
                          "
                        >
                          <Select.Trigger
                            class="w-full"
                            aria-label="Font family"
                          />
                          <Select.Content>
                            <Select.Option
                              v-for="option in fonts"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </SettingRow>
                      <SettingRow
                        title="System appearance"
                        description="Follow the operating system, or force a light or dark theme."
                      >
                        <Select
                          v-model="theme"
                          size="large"
                          :display-value="
                            (value) =>
                              appearances.find((option) => option.value === value)?.label ?? ''
                          "
                        >
                          <Select.Trigger
                            class="w-full"
                            aria-label="System appearance"
                          />
                          <Select.Content>
                            <Select.Option
                              v-for="option in appearances"
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
                title="Danger Zone"
                hint="Actions that cannot be undone."
                anchor="danger-zone"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Remove personal account"
                        description="Permanently deletes this Personal Account and all associated data from the platform. It cannot be undone."
                        kind="compact"
                      >
                        <Button
                          type="button"
                          label="Delete account"
                          kind="danger"
                          size="medium"
                          icon="pi pi-trash"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
            </fieldset>
          </div>
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
    </div>
  </main>
</template>
