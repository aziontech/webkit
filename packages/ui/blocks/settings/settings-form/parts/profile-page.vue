<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import { useCardSave } from '../composables/use-card-save'
  import {
    type ProfileAccountErrors,
    type ProfileAccountForm,
    sampleProfileAccount
  } from '../sample'
  import ProfileAddressGroup from './profile-address-group.vue'
  import ProfileAppearanceGroup from './profile-appearance-group.vue'
  import ProfileCompanyGroup from './profile-company-group.vue'
  import ProfileGeneralGroup from './profile-general-group.vue'
  import ProfileSourceControlGroup from './profile-source-control-group.vue'

  export interface ProfileProps {
    /** The saved account; the form opens on it and Discard returns to it. Left out, the sample renders. */
    profile?: ProfileAccountForm
    /** The first load is in flight: Skeleton rows stand in for the sections. */
    loading?: boolean
    /** Why the first load failed, shown in a danger Alert with Retry in place of the sections. */
    error?: string
    /** The save is in flight: the fieldset and Discard lock and Save spins. */
    saving?: boolean
    /** Why the save failed, shown in the error toast with Retry; the edits are kept. */
    saveError?: string
    /** The account deletion is in flight; the dialog closes when it ends. */
    deleting?: boolean
  }

  const props = withDefaults(defineProps<ProfileProps>(), {
    profile: () => sampleProfileAccount,
    loading: false,
    error: '',
    saving: false,
    saveError: '',
    deleting: false
  })

  const emit = defineEmits<{
    submit: [event: Event, values: ProfileAccountForm]
    retry: [event: MouseEvent]
    delete: [event: Event]
  }>()

  const form = reactive<ProfileAccountForm>({ ...props.profile })
  const errors = reactive<ProfileAccountErrors>({ accountName: '', billingEmails: '' })
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
    return !(errors.accountName || errors.billingEmails)
  }

  const {
    dirty,
    baseline,
    discard: restore,
    submitting: saving,
    submit: save
  } = useCardSave({
    id: 'profile',
    values: form,
    saved: () => props.profile,
    loading: () => props.saving,
    error: () => props.saveError,
    savedMessage: 'Profile saved.',
    failedMessage: "The profile wasn't saved.",
    valid: validate,
    onInvalid: () => {
      const first = errors.accountName ? 'accountName' : 'billingEmails'
      nextTick(() => document.getElementById(`profile-${first}`)?.focus())
    },
    onSubmit: (event, values) => emit('submit', event, values)
  })

  const deleteOpen = ref(false)
  const savedName = computed(() => baseline.value.accountName)
  const openDelete = () => {
    deleteOpen.value = true
  }
  const confirmDelete = (event: Event) => {
    if (props.deleting) return
    emit('delete', event)
  }
  watch(
    () => props.deleting,
    (now, before) => {
      if (before && !now) deleteOpen.value = false
    }
  )

  const discard = () => {
    restore()
    Object.assign(errors, { accountName: '', billingEmails: '' })
  }
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
              v-else-if="error"
              class="mt-(--layout-section-gap)"
            >
              <Alert severity="danger">
                {{ error }}
                <template #actions>
                  <Button
                    type="button"
                    label="Retry"
                    variant="secondary"
                    size="small"
                    @click="emit('retry', $event)"
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
              <ProfileGeneralGroup
                :form="form"
                :errors="errors"
                :saving="saving"
              />
              <ProfileCompanyGroup
                :form="form"
                :errors="errors"
                :saving="saving"
              />
              <ProfileAddressGroup
                :form="form"
                :saving="saving"
              />
              <SettingsGroup
                label="Login settings"
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
              </SettingsGroup>
              <ProfileSourceControlGroup />
              <ProfileAppearanceGroup />
              <SettingsGroup
                label="Danger zone"
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
              </SettingsGroup>
            </fieldset>
          </div>
        </div>
        <Transition
          enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          enter-from-class="translate-y-2 opacity-0"
          leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          leave-to-class="translate-y-2 opacity-0"
        >
          <SaveBar
            v-if="dirty || saving"
            @save="save"
          >
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
                variant="primary"
                size="medium"
                type="submit"
                :loading="saving"
                aria-keyshortcuts="Meta+S Control+S"
              >
                Save
                <span
                  class="pointer-coarse:hidden"
                  aria-hidden="true"
                  data-testid="shortcut-hint"
                >
                  <Kbd
                    meta
                    size="small"
                    >S</Kbd
                  >
                </span>
              </Button>
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
      confirm-label="Delete account"
      :confirmation-phrase="savedName"
      :loading="deleting"
      @confirm="confirmDelete"
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
      </div>
    </ConfirmDialog>
  </div>
</template>
