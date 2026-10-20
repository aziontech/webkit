<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { useTheme } from '@shared/lib/theme.js'
  import { reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'

  import FieldRow from '../../../components/form/FieldRow.vue'
  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { saveGroup, useBaseline } from '../../../lib/behavior/forms'
  import { emailOrOwner, fullNameFromEmail } from '../../../lib/data/greeting'
  import { useFont } from '../../../lib/state/font.js'

  const route = useRoute()
  const { font, fonts } = useFont()
  const { theme } = useTheme()
  const appearances = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ]

  const countries = [
    { label: 'Brazil', value: 'br' },
    { label: 'United States', value: 'us' },
    { label: 'Portugal', value: 'pt' }
  ]
  const states = [
    { label: 'Rio Grande do Sul', value: 'rs' },
    { label: 'São Paulo', value: 'sp' },
    { label: 'Rio de Janeiro', value: 'rj' }
  ]
  const cities = [
    { label: 'Porto Alegre', value: 'poa' },
    { label: 'São Paulo', value: 'sao' },
    { label: 'Rio de Janeiro', value: 'rio' }
  ]

  const form = reactive({
    accountName: fullNameFromEmail(route.query.email),
    clientId: '9757a',
    companyName: '',
    companyId: '',
    billingEmails: emailOrOwner(route.query.email),
    postalCode: '00000-000',
    country: 'br',
    state: 'rs',
    city: 'poa',
    address: 'n',
    apartment: '',
    allowSocialLogin: true,
    enforceMfa: false
  })

  const places = [
    { key: 'country', label: 'Country', options: countries },
    { key: 'state', label: 'State/Region', options: states },
    { key: 'city', label: 'City', options: cities }
  ]

  const saving = ref(false)

  const { dirty, commit } = useBaseline(form)

  const snapshot = ref(JSON.parse(JSON.stringify(form)))

  const save = () =>
    saveGroup(saving, 'Account settings saved.', () => {
      commit()
      snapshot.value = JSON.parse(JSON.stringify(form))
    })

  const discard = () => {
    Object.assign(form, JSON.parse(JSON.stringify(snapshot.value)))
  }

  const sourceControls = [
    {
      key: 'github',
      name: 'Github',
      icon: 'pi pi-github',
      connected: true,
      tag: 'Active',
      description:
        'Connected as rafael.umman: to repositories in organizations: azion-tech, rafael-personal.',
      action: 'Manage'
    },
    {
      key: 'gitlab',
      name: 'Gitlab',
      icon: 'ai-cor ai-gitlab',
      connected: false,
      description: 'Connect GitLab for Cloud Agents, and enhanced codebase control.',
      action: 'Connect'
    },
    {
      key: 'bitbucket',
      name: 'Bitbucket',
      icon: 'ai-cor ai-bitbucket',
      connected: false,
      description: 'Connect Bitbucket for Cloud Agents, and enhanced codebase control.',
      action: 'Connect'
    }
  ]

  const onProviderAction = (provider) =>
    provider.connected
      ? toast.success(`Opening ${provider.name} integration settings…`)
      : toast.success(`Connecting to ${provider.name}…`)

  const deleteAccount = () =>
    toast.error('This action is disabled in the demo.', {
      description: 'Deleting an account is irreversible.'
    })
</script>

<template>
  <form
    class="flex min-h-0 flex-1 flex-col"
    aria-label="Account settings"
    novalidate
    @submit.prevent="save"
  >
    <div class="min-h-0 flex-1 overflow-auto">
      <div
        class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
      >
        <PageHeading
          title="Account Settings"
          description="Manage your account's identity, company details, address, and login preferences."
        />

        <fieldset
          class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
          :disabled="saving"
        >
          <legend class="sr-only">Account settings</legend>

          <Section
            stacked
            anchor
            :divided="false"
            title="General"
            hint="How this account is identified on the platform."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
                    title="Account Name"
                    description="What this account is called across the console."
                  >
                    <InputText
                      v-model="form.accountName"
                      size="large"
                      class="w-full"
                      aria-label="Account Name"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
                    title="Client ID"
                    description="Can't be changed. Quote it when opening a support ticket about this account."
                  >
                    <InputText
                      v-model="form.clientId"
                      size="large"
                      class="w-full"
                      aria-label="Client ID"
                      readonly
                      :disabled="saving"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Company information"
            hint="The company that owns the account, as it appears on every invoice."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
                    title="Company Name"
                    description="The legal entity that owns this account."
                  >
                    <InputText
                      v-model="form.companyName"
                      size="large"
                      class="w-full"
                      aria-label="Company Name"
                      placeholder="Company S.A."
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
                    title="Company ID"
                    description="Personal or company ID number that identifies account ownership."
                  >
                    <InputText
                      v-model="form.companyId"
                      size="large"
                      class="w-full"
                      aria-label="Company ID"
                      placeholder="00.000.000/0001-00"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
                    kind="wide"
                    title="Billing emails"
                    description="Billing is forwarded to every address listed here. Separate each one with a semicolon ( ; )."
                  >
                    <Textarea
                      v-model="form.billingEmails"
                      class="w-full"
                      :rows="3"
                      aria-label="Billing emails"
                      :disabled="saving"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Address information"
            hint="Where the account owner is registered, for invoices and tax purposes."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow title="Postal Code">
                    <InputText
                      v-model="form.postalCode"
                      size="large"
                      class="w-full"
                      aria-label="Postal Code"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
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
                  </FieldRow>
                  <FieldRow title="Address">
                    <InputText
                      v-model="form.address"
                      size="large"
                      class="w-full"
                      aria-label="Address"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow title="Apartment, floor, etc.">
                    <InputText
                      v-model="form.apartment"
                      size="large"
                      class="w-full"
                      aria-label="Apartment, floor, etc."
                      placeholder="1st floor"
                      :disabled="saving"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Login Settings"
            hint="How the users linked to this account sign in."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
                    kind="compact"
                    title="Allow social login"
                    description="Users linked to the account can log in with their social network credentials."
                  >
                    <Switch
                      v-model="form.allowSocialLogin"
                      aria-label="Allow social login"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
                    kind="compact"
                    title="Enforce multi-factor authentication"
                    description="MFA is required on login for every user linked to this account."
                  >
                    <Switch
                      v-model="form.enforceMfa"
                      aria-label="Enforce multi-factor authentication"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
                    kind="compact"
                    title="Authenticator devices"
                    description="Manage the devices and recovery codes registered for this account."
                  >
                    <Button
                      type="button"
                      label="Manage"
                      kind="outlined"
                      size="medium"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Source control"
            hint="The Git providers this account builds applications from, connected at the provider and outside Save."
          >
            <CardBox :padded="false">
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
                    <Item.Actions class="justify-end">
                      <Button
                        type="button"
                        :label="provider.action"
                        kind="outlined"
                        size="medium"
                        :icon="provider.connected ? undefined : 'pi pi-external-link'"
                        @click="onProviderAction(provider)"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Appearance"
            hint="Preferences for this browser, applied the moment you change them and not part of Save."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
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
                  </FieldRow>
                  <FieldRow
                    title="System appearance"
                    description="Follow the operating system, or force a light or dark theme."
                  >
                    <Select
                      v-model="theme"
                      size="large"
                      :display-value="
                        (value) => appearances.find((option) => option.value === value)?.label ?? ''
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
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Danger Zone"
            hint="Actions that cannot be undone."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
                    kind="compact"
                    title="Remove personal account"
                    description="Permanently deletes this Personal Account and all associated data from Azion's platform. It cannot be undone."
                  >
                    <Button
                      type="button"
                      label="Delete account"
                      kind="danger"
                      size="medium"
                      icon="pi pi-trash"
                      @click="deleteAccount"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>
        </fieldset>
      </div>
    </div>

    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      @save="save"
      @discard="discard"
    />
  </form>
</template>
