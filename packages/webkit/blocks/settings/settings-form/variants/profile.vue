<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref, useId } from 'vue'

  const form = reactive({
    accountName: 'Acme',
    clientId: '9757a',
    companyName: '',
    taxId: '',
    billingEmails: '',
    postalCode: '94105',
    country: 'us',
    state: 'ca',
    city: 'sf',
    address: '100 Market Street',
    apartment: 'Suite 400',
    allowSocialLogin: true
  })
  const saving = ref(false)
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const errors = reactive({ accountName: '', billingEmails: '' })
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const SAVE_TOAST = 'profile-save'

  const validate = () => {
    const emails = form.billingEmails
      .split(';')
      .map((value) => value.trim())
      .filter(Boolean)
    errors.accountName = form.accountName.trim() ? '' : 'This field is required.'
    errors.billingEmails = !emails.length
      ? 'This field is required.'
      : emails.every((value) => emailPattern.test(value))
        ? ''
        : 'Enter valid email addresses, separated by semicolons.'
    const first = (['accountName', 'billingEmails'] as const).find((field) => errors[field])
    if (first) nextTick(() => document.getElementById(`profile-${first}`)?.focus())
    return !first
  }

  const save = () => {
    if (saving.value || !validate()) return
    saving.value = true
    toast.dismiss(SAVE_TOAST)
    setTimeout(() => {
      saving.value = false
      if (form.accountName.trim().toLowerCase() === 'offline') {
        toast.error("The profile wasn't saved.", {
          id: SAVE_TOAST,
          description: "The request didn't reach the server. Your changes are kept.",
          action: { label: 'Retry', onClick: () => save() }
        })
        return
      }
      baseline.value = JSON.stringify(form)
      toast.success('Profile saved.', { id: SAVE_TOAST })
    }, 900)
  }
  const loading = ref(false)
  const loadFailed = ref(false)
  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const deleteOpen = ref(false)
  const deleteConfirmation = ref('')
  const deleting = ref(false)
  const deleteLabelId = useId()
  const savedName = computed<string>(() => JSON.parse(baseline.value).accountName)
  const canDelete = computed(
    () => deleteConfirmation.value.trim() === savedName.value && !deleting.value
  )
  const openDelete = () => {
    deleteConfirmation.value = ''
    deleteOpen.value = true
  }
  const confirmDelete = () => {
    if (!canDelete.value) return
    deleting.value = true
    setTimeout(() => {
      deleting.value = false
      deleteOpen.value = false
      toast.success('Account scheduled for deletion.', {
        description: 'You get an email to confirm it; nothing is deleted before then.'
      })
    }, 800)
  }

  const discard = () => {
    Object.assign(form, JSON.parse(baseline.value))
    Object.assign(errors, { accountName: '', billingEmails: '' })
  }

  interface Place {
    key: 'country' | 'state' | 'city'
    label: string
    options: { label: string; value: string }[]
  }

  const places: Place[] = [
    {
      key: 'country',
      label: 'Country',
      options: [
        { label: 'Brazil', value: 'br' },
        { label: 'Canada', value: 'ca' },
        { label: 'Germany', value: 'de' },
        { label: 'Japan', value: 'jp' },
        { label: 'United Kingdom', value: 'gb' },
        { label: 'United States', value: 'us' }
      ]
    },
    {
      key: 'state',
      label: 'State or region',
      options: [
        { label: 'California', value: 'ca' },
        { label: 'New York', value: 'ny' },
        { label: 'Texas', value: 'tx' },
        { label: 'Washington', value: 'wa' }
      ]
    },
    {
      key: 'city',
      label: 'City',
      options: [
        { label: 'Los Angeles', value: 'la' },
        { label: 'San Diego', value: 'sd' },
        { label: 'San Francisco', value: 'sf' }
      ]
    }
  ]
  const sourceControls = [
    {
      key: 'github',
      name: 'GitHub',
      href: 'https://github.com/settings/installations',
      icon: 'az az-github',
      connected: true,
      tag: 'Active',
      description:
        'Connected as jane-doe, with access to the acme and jane-doe-personal organizations.',
      action: 'Manage'
    },
    {
      key: 'gitlab',
      name: 'GitLab',
      href: '/account/integrations/gitlab',
      icon: 'az-color az-gitlab',
      connected: false,
      tag: '',
      description: 'Connect GitLab to build and deploy from its repositories.',
      action: 'Connect'
    },
    {
      key: 'bitbucket',
      name: 'Bitbucket',
      href: '/account/integrations/bitbucket',
      icon: 'az-color az-bitbucket',
      connected: false,
      tag: '',
      description: 'Connect Bitbucket to build and deploy from its repositories.',
      action: 'Connect'
    }
  ]
  const fonts = [
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
  <div class="flex flex-1 flex-col">
    <div class="flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Profile"
        novalidate
        @submit.prevent="save"
      >
        <div class="flex-1">
          <div
            class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Profile"
              description="Manage your identity, company details, address, and sign-in preferences."
              size="small"
            />
            <div
              v-if="loading"
              class="mt-(--layout-section-gap) flex min-w-0 flex-col gap-(--layout-section-gap)"
              role="status"
              aria-busy="true"
              aria-label="Loading the profile"
            >
              <Card
                v-for="section in 3"
                :key="section"
              >
                <template #default>
                  <div class="flex flex-col gap-(--spacing-md)">
                    <Skeleton
                      v-for="row in 3"
                      :key="row"
                      height="2.5rem"
                    />
                  </div>
                </template>
              </Card>
            </div>
            <div
              v-else-if="loadFailed"
              class="mt-(--layout-section-gap)"
            >
              <Alert severity="danger">
                The profile could not be loaded. Nothing was changed; try again.
                <template #actions>
                  <Button
                    type="button"
                    label="Retry"
                    variant="secondary"
                    size="small"
                    @click="retryLoad"
                  />
                </template>
              </Alert>
            </div>
            <fieldset
              v-else
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
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Account name"
                        description="What this account is called across the console."
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            id="profile-accountName"
                            v-model="form.accountName"
                            size="large"
                            class="w-full"
                            aria-label="Account name"
                            :required="!!errors.accountName"
                            :aria-describedby="
                              errors.accountName ? 'profile-accountName-error' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="errors.accountName = ''"
                          />
                          <FieldError
                            v-if="errors.accountName"
                            id="profile-accountName-error"
                            >{{ errors.accountName }}</FieldError
                          >
                        </div>
                      </SettingsRow>
                      <SettingsRow
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
                      </SettingsRow>
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
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Company name"
                        description="The legal entity that owns this account."
                      >
                        <Input
                          v-model="form.companyName"
                          size="large"
                          class="w-full"
                          aria-label="Company name"
                          autocomplete="organization"
                          :disabled="saving"
                        />
                      </SettingsRow>
                      <SettingsRow
                        title="Tax ID"
                        description="The tax ID of the person or company that owns this account."
                      >
                        <Input
                          v-model="form.taxId"
                          size="large"
                          class="w-full"
                          aria-label="Tax ID"
                          :disabled="saving"
                        />
                      </SettingsRow>
                      <SettingsRow
                        title="Billing emails"
                        description="Invoices go to every address listed here. Separate addresses with a semicolon."
                        variant="stacked"
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Textarea
                            id="profile-billingEmails"
                            v-model="form.billingEmails"
                            class="w-full"
                            :rows="3"
                            aria-label="Billing emails"
                            :required="!!errors.billingEmails && !form.billingEmails.trim()"
                            :invalid="!!errors.billingEmails && !!form.billingEmails.trim()"
                            :aria-describedby="
                              errors.billingEmails ? 'profile-billingEmails-error' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="errors.billingEmails = ''"
                          />
                          <FieldError
                            v-if="errors.billingEmails"
                            id="profile-billingEmails-error"
                            >{{ errors.billingEmails }}</FieldError
                          >
                        </div>
                      </SettingsRow>
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
                  <template #default>
                    <Item.List>
                      <SettingsRow title="Postal code">
                        <Input
                          v-model="form.postalCode"
                          size="large"
                          class="w-full"
                          autocomplete="postal-code"
                          aria-label="Postal code"
                          :disabled="saving"
                        />
                      </SettingsRow>
                      <SettingsRow
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
                            <Select.Item
                              v-for="option in place.options"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Item>
                          </Select.Content>
                        </Select>
                      </SettingsRow>
                      <SettingsRow title="Address">
                        <Input
                          v-model="form.address"
                          size="large"
                          class="w-full"
                          autocomplete="address-line1"
                          aria-label="Address"
                          :disabled="saving"
                        />
                      </SettingsRow>
                      <SettingsRow
                        title="Address line 2"
                        description="Optional. Apartment, suite or floor."
                      >
                        <Input
                          v-model="form.apartment"
                          size="large"
                          class="w-full"
                          autocomplete="address-line2"
                          aria-label="Address line 2"
                          placeholder="1st floor"
                          :disabled="saving"
                        />
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Login settings"
                hint="How the users linked to this account sign in."
                anchor="login-settings"
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Allow social login"
                        description="Users linked to the account can log in with their social network credentials."
                        variant="compact"
                      >
                        <Switch
                          v-model="form.allowSocialLogin"
                          aria-label="Allow social login"
                          :disabled="saving"
                        />
                      </SettingsRow>
                      <SettingsRow
                        title="Multi-factor authentication"
                        description="Require MFA for everyone in the account, see who has set it up and reset a lost device on the MFA management page."
                        variant="compact"
                      >
                        <Button
                          label="Manage MFA"
                          variant="outline"
                          size="medium"
                          href="/account/security/mfa"
                        />
                      </SettingsRow>
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
                  <template #default>
                    <Item.List>
                      <Item
                        v-for="provider in sourceControls"
                        :key="provider.key"
                        size="small"
                      >
                        <Item.Media>
                          <span
                            class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <i
                              :class="[provider.icon, 'text-body-lg text-(--text-default)']"
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
                            :label="provider.action"
                            :aria-label="`${provider.action} ${provider.name}`"
                            variant="outline"
                            size="medium"
                            :icon="
                              provider.connected || !provider.href.startsWith('http')
                                ? undefined
                                : 'az az-external-link'
                            "
                            :href="provider.href"
                            :target="provider.href.startsWith('http') ? '_blank' : undefined"
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
                  <template #default>
                    <Item.List>
                      <SettingsRow
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
                            <Select.Item
                              v-for="option in fonts"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Item>
                          </Select.Content>
                        </Select>
                      </SettingsRow>
                      <SettingsRow
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
                            <Select.Item
                              v-for="option in appearances"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Item>
                          </Select.Content>
                        </Select>
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
              <SettingsSection
                title="Danger zone"
                hint="Actions that cannot be undone."
                anchor="danger-zone"
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Delete personal account"
                        description="Permanently deletes this personal account and all its data. It cannot be undone."
                        variant="compact"
                      >
                        <Button
                          type="button"
                          label="Delete account"
                          variant="danger"
                          size="medium"
                          icon="az az-trash"
                          @click="openDelete"
                        />
                      </SettingsRow>
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
                variant="outline"
                size="medium"
                :disabled="saving"
                @click="discard"
              />
              <Button
                label="Save"
                variant="primary"
                size="medium"
                :loading="saving"
                @click="save"
              />
            </template>
          </SaveBar>
        </Transition>
      </form>
    </div>

    <ConfirmDialog
      v-model:open="deleteOpen"
      variant="danger"
      title="Delete account"
      size="medium"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          The account, its applications, domains, users and invoices are deleted with all their
          data.
        </p>
        <p
          :id="deleteLabelId"
          class="m-0 text-body-sm text-(--text-default)"
        >
          Type <code class="text-label-code-sm">{{ savedName }}</code> to confirm.
        </p>
        <Input
          v-model="deleteConfirmation"
          :aria-labelledby="deleteLabelId"
          autocomplete="off"
          class="w-full"
          @keydown.enter.prevent="confirmDelete"
        />
      </div>
      <template #actions="{ close }">
        <Button
          type="button"
          label="Cancel"
          variant="outline"
          size="medium"
          :disabled="deleting"
          @click="close"
        />
        <Button
          type="button"
          label="Delete account"
          variant="danger"
          size="medium"
          :disabled="!canDelete"
          :loading="deleting"
          @click="confirmDelete"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
