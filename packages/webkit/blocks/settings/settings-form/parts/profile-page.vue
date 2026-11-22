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
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref } from 'vue'

  import { type ProfileAccountErrors, sampleProfileAccount } from '../sample'
  import ProfileAddressGroup from './profile-address-group.vue'
  import ProfileAppearanceGroup from './profile-appearance-group.vue'
  import ProfileCompanyGroup from './profile-company-group.vue'
  import ProfileGeneralGroup from './profile-general-group.vue'
  import ProfileSourceControlGroup from './profile-source-control-group.vue'

  export interface ProfileProps {
    /** The page opens on its first load: Skeleton rows stand in for the sections. */
    defaultLoading?: boolean
    /** The page opens on a failed load: a danger Alert with Retry replaces the sections. */
    defaultLoadFailed?: boolean
  }

  const props = withDefaults(defineProps<ProfileProps>(), {
    defaultLoading: false,
    defaultLoadFailed: false
  })

  const form = reactive({ ...sampleProfileAccount })
  const saving = ref(false)
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const errors = reactive<ProfileAccountErrors>({ accountName: '', billingEmails: '' })
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

  const onSaveShortcut = () => {
    if (!dirty.value || saving.value) return
    save()
  }
  const loading = ref(props.defaultLoading)
  const loadFailed = ref(props.defaultLoadFailed)
  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const deleteOpen = ref(false)
  const deleting = ref(false)
  const savedName = computed<string>(() => JSON.parse(baseline.value).accountName)
  const openDelete = () => {
    deleteOpen.value = true
  }
  const confirmDelete = () => {
    if (deleting.value) return
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
            @save="onSaveShortcut"
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
                :loading="saving"
                @click="save"
                aria-keyshortcuts="Meta+S Control+S"
              >
                Save
                <Kbd
                  meta
                  size="small"
                  aria-hidden="true"
                  >S</Kbd
                >
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
